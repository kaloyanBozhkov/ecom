# SafeHeat™ Ecommerce Store

A modern, trustworthy ecommerce website for the SafeHeat™ Propane Garage Heater built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Package Manager:** pnpm

## 📁 Project Structure

The project follows **Atomic Design** principles:

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with Navbar & Footer
│   ├── page.tsx                 # Landing page
│   └── product/[slug]/page.tsx  # Dynamic product page
├── components/
│   ├── atoms/                   # Smallest reusable components
│   │   ├── Button, Card, Badge  # shadcn/ui components (re-exported)
│   │   ├── Icon.tsx            # Icon system
│   │   ├── Logo.tsx            # Brand logo
│   │   ├── Price.tsx           # Price display
│   │   └── Container.tsx       # Layout container
│   ├── molecules/               # Components made of atoms
│   │   ├── FeatureCard.tsx
│   │   ├── TrustBadge.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── SpecificationList.tsx
│   │   ├── SafetyFeatureItem.tsx
│   │   └── Navbar.tsx
│   └── organisms/               # Complex components with state & side effects
│       ├── Hero.tsx
│       ├── FeaturesSection.tsx
│       ├── SafetySection.tsx
│       ├── ProductDetails.tsx
│       └── Footer.tsx
├── data/
│   ├── products.json           # Product data (dummy data for now)
│   └── productService.ts       # Data access functions
├── store/
│   └── cartStore.ts           # Zustand cart state management
└── types/
    └── product.ts             # TypeScript interfaces
```

## 🎨 Design Highlights

### Landing Page Features:
- **Hero Section** - Eye-catching hero with CTA buttons and trust badges
- **Features Section** - 6 key product features with icons
- **Safety Section** - Comprehensive safety information (addresses top customer concern)
- **Social Proof** - Customer reviews and testimonials
- **FAQ Section** - Answers to common questions
- **CTA Section** - Final conversion push with pricing

### Product Page Features:
- **Product Details** - Image gallery, pricing, quantity selector, add to cart
- **Technical Specifications** - Detailed spec list
- **Features Overview** - Key benefits highlighted
- **Safety Information** - Multiple safety features and certifications
- **How It Works** - 4-step usage guide
- **What's Included** - Package contents
- **Customer Reviews** - 6 detailed reviews with ratings

### Key Design Decisions:
- **Safety First** - Green sections and shield icons emphasize safety
- **Trust Building** - Certifications, warranty, and shipping badges throughout
- **Orange/Red Color Scheme** - Evokes warmth and heat
- **Professional & Clean** - Modern UI that looks trustworthy

## 🛒 Cart Functionality

The shopping cart uses Zustand with persistence (localStorage):
- Add items to cart
- Update quantities
- Remove items
- Persist across page refreshes
- Badge shows total item count in navbar

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run development server:**
   ```bash
   pnpm dev
   ```

3. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📄 Pages

- **Home:** `/` - Landing page with hero, features, safety info, reviews, FAQ
- **Product Page:** `/product/safeheat-propane-heater` - Detailed product information

## 💳 Stripe Integration - COMPLETE! ✅

**Stripe checkout is now fully implemented!** The pattern strictly follows your `profiler` project implementation.

### Quick Start:

1. **Set up environment variables** (see `ENV.md`):
   ```bash
   # Add to .env.local
   DATABASE_URL="postgresql://localhost:5432/ecom"
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Set up database**:
   ```bash
   # Generate Prisma Client
   pnpm dlx prisma generate
   
   # Run migrations
   pnpm dlx prisma migrate dev --name init
   ```

3. **Test checkout flow**:
   - Add items to cart
   - Click "Proceed to Checkout"
   - Use test card: `4242 4242 4242 4242`
   - Order is saved to database!

📖 **Full setup guide**: See [`STRIPE_SETUP.md`](./STRIPE_SETUP.md) and [`ENV.md`](./ENV.md)

### What's Implemented:

✅ **Stripe Payments:**
  - Server-side Stripe client (`/src/server/stripe/`)  
  - Client-side utilities (`/src/utils/stripe/`)  
  - Checkout session API (`/pages/api/stripe/checkout_sessions/`)  
  - Webhook handler (`/pages/api/stripe/webhook.ts`)  
  - Order success page (`/app/order/[sessionId]/`)  
  - Cart drawer checkout integration  

✅ **Database (Prisma + PostgreSQL):**
  - T3 env validation (`/src/env.js`)  
  - Prisma schema with User & Order models  
  - Order tracking with status  
  - Queries folder pattern (`/src/server/queries/`)  
  - Webhook saves orders to database  

## 🔄 Next Steps (Optional Enhancements)

The core payment flow and database are complete! Optional additions:

1. **Email Notifications:**
   ```bash
   pnpm add resend
   ```
   - Send order confirmation emails
   - Shipping notifications
   - Order status updates

2. **Admin Dashboard:**
   - View all orders
   - Update order status (PENDING → PAID → PROCESSING → SHIPPED → DELIVERED)
   - Manage products
   - Customer management

3. **Additional Features to Consider:**
   - User authentication (NextAuth.js)
   - Customer order history
   - Inventory management
   - Multiple product support
   - Product reviews
   - Wishlist functionality

## 🎯 Product Information

**Product:** SafeHeat™ Propane Garage Heater  
**Price:** $179.99 (was $249.99)  
**Key Selling Points:**
- 9,000–18,000 BTU output
- Auto shut-off + oxygen sensor (indoor-safe)
- Heats up to 500 sq ft in minutes
- Compatible with standard propane tanks
- Ships from U.S. warehouse

**Safety Focus:** The entire site emphasizes safety features to address the #1 customer concern (CO₂ safety) mentioned in Amazon reviews.

## 🛠️ Development Commands

```bash
# Development
pnpm dev          # Start dev server

# Build
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint

# Prisma (when you add it)
pnpm prisma studio    # Open Prisma Studio
pnpm prisma migrate   # Run migrations
```

## 📝 Notes

- All components are fully typed with TypeScript
- Responsive design (mobile, tablet, desktop)
- No linter errors
- Ready for backend integration
- Product images are placeholders (replace with actual product photos)
- Cart functionality works but checkout needs Stripe integration

---

Built with ❤️ using Next.js and modern web technologies.
