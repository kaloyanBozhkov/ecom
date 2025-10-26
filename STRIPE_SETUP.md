# Stripe Integration Setup Guide

This guide follows the exact pattern from the `profiler` project for Stripe checkout flows.

## 🎯 Pattern Overview

The implementation follows this structure:
- **Server-side**: `/src/server/stripe/` - Stripe client and helpers
- **Client-side**: `/src/utils/stripe/` - Frontend utilities
- **API Routes**: `/src/pages/api/stripe/` - Checkout and webhook endpoints
- **Success Page**: `/src/app/order/[sessionId]/` - Order confirmation

## 📋 Prerequisites

1. Create a Stripe account at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/test/apikeys

## 🔧 Setup Steps

### 1. Environment Variables

Create `.env.local` in the project root:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: 
- Get `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from your Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` comes from setting up the webhook (see step 3)

### 2. Test the Checkout Flow

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Add items to cart**:
   - Visit http://localhost:3000/product/safeheat-propane-heater
   - Click "Add to Cart"
   - Cart drawer opens on the right

3. **Proceed to checkout**:
   - Click "Proceed to Checkout" button
   - You'll be redirected to Stripe's hosted checkout page

4. **Test payment**:
   Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires auth**: `4000 0025 0000 3155`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC (e.g., 123)
   - Any ZIP code (e.g., 12345)

5. **After successful payment**:
   - Redirects to `/order/{CHECKOUT_SESSION_ID}`
   - Shows order confirmation page

### 3. Webhook Setup (for Production)

Webhooks allow Stripe to notify your app when events happen (like successful payments).

#### Development (Using Stripe CLI)

1. **Install Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://github.com/stripe/stripe-cli
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copy the webhook secret** shown in the terminal to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Test webhook** (in a new terminal):
   ```bash
   stripe trigger checkout.session.completed
   ```

#### Production (Stripe Dashboard)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
5. Copy the "Signing secret" to your production environment variables

## 📁 File Structure (Following Profiler Pattern)

```
src/
├── server/stripe/
│   ├── stripe.ts                 # Stripe client initialization
│   └── stripe.helpers.ts         # Amount formatting helpers
│
├── utils/stripe/
│   ├── getStripe.ts              # Client-side Stripe loader
│   └── checkout.helpers.ts       # cartCheckout() function
│
├── pages/api/stripe/
│   ├── checkout_sessions/
│   │   ├── index.ts             # POST: Create checkout session
│   │   ├── [id].ts              # GET: Retrieve session details
│   │   └── helpers/
│   │       ├── isValidSessionId.ts
│   │       └── retrieveSession.ts
│   └── webhook.ts               # POST: Handle Stripe webhooks
│
├── app/
│   └── order/[sessionId]/
│       └── page.tsx             # Order success page
│
└── components/organisms/
    └── CartDrawer.tsx           # Checkout integration
```

## 🔄 Checkout Flow

```
1. User clicks "Proceed to Checkout" in CartDrawer
   ↓
2. cartCheckout() called with:
   - total: Total price
   - currency: "USD"
   - config: Cart items data
   ↓
3. POST to /api/stripe/checkout_sessions
   - Creates Stripe Checkout Session
   - Returns session ID
   ↓
4. Redirect to Stripe's hosted checkout page
   - User enters payment details
   ↓
5. After successful payment:
   - Stripe redirects to /order/{CHECKOUT_SESSION_ID}
   - Webhook receives checkout.session.completed event
   ↓
6. Order Success Page
   - Fetches session details via GET /api/stripe/checkout_sessions/[id]
   - Displays order confirmation
```

## 🎨 Frontend Integration

The checkout is triggered in `CartDrawer.tsx`:

```typescript
await cartCheckout({
  total: totalPrice,
  currency: "USD",
  config: {
    cartItems: JSON.stringify(
      cartItemsWithDetails.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      }))
    ),
  },
  onCancelRedirectTo: "/",
});
```

## 🔐 Security Notes

1. **Never expose secret keys** - Only use `NEXT_PUBLIC_` prefixed keys on client-side
2. **Validate webhook signatures** - Always verify webhooks using `STRIPE_WEBHOOK_SECRET`
3. **Amount validation** - Server validates amounts before creating sessions
4. **Use HTTPS in production** - Stripe requires HTTPS for webhooks

## 🧪 Testing Checklist

- [ ] Checkout button redirects to Stripe
- [ ] Test card payment succeeds
- [ ] Redirect to success page works
- [ ] Order ID displayed on success page
- [ ] Webhook receives event (check console logs)
- [ ] Error handling works (try declined card)
- [ ] Cancel button returns to home page

## 📝 Webhook Event Handling

Current webhook handles these events:

- **checkout.session.completed** - Payment successful, create order
- **payment_intent.succeeded** - Payment processed successfully
- **payment_intent.payment_failed** - Payment failed
- **charge.succeeded** - Charge completed

To process orders after payment, edit `/src/pages/api/stripe/webhook.ts`:

```typescript
case "checkout.session.completed": {
  const session = event.data.object;
  const customerDetails = session.customer_details;
  
  // TODO: Add your order processing logic here
  // 1. Create order in database
  // 2. Send confirmation email
  // 3. Update inventory
  
  break;
}
```

## 🚀 Production Deployment

1. **Set production environment variables** in your hosting platform
2. **Use production API keys** from Stripe Dashboard
3. **Set up production webhook** endpoint
4. **Test with small real payment** before going live
5. **Enable Stripe Radar** for fraud detection (recommended)

## 💡 Common Issues

**Q: Webhook not receiving events?**
- Check Stripe CLI is running (`stripe listen`)
- Verify `STRIPE_WEBHOOK_SECRET` matches CLI output
- Check firewall/port forwarding for local development

**Q: "Invalid API Key" error?**
- Ensure `.env.local` exists and is loaded
- Restart dev server after adding env vars
- Check you're using test keys for development

**Q: Redirect not working?**
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check browser console for errors
- Ensure success_url includes `{CHECKOUT_SESSION_ID}`

## 📚 Resources

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

---

**Pattern Credit**: This implementation strictly follows the Stripe integration pattern from the `profiler` project.

