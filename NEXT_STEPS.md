# Next Steps: Adding Backend & Payment Processing

## 🎯 Current Status
✅ **Frontend Complete** - Fully functional ecommerce frontend with:
- Landing page with hero, features, safety info, reviews, FAQ
- Product page with details, specs, reviews
- Shopping cart with Zustand (persists to localStorage)
- Responsive design, trustworthy UI
- No linter errors

## 📋 Backend Integration Roadmap

### Phase 1: Database Setup (Prisma + PostgreSQL)

#### 1.1 Install Prisma
```bash
pnpm add prisma @prisma/client
pnpm add -D prisma
```

#### 1.2 Initialize Prisma
```bash
pnpm dlx prisma init
```

#### 1.3 Create Database Schema
Create `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  tagline         String
  description     String
  price           Float
  originalPrice   Float?
  currency        String   @default("USD")
  inStock         Boolean  @default(true)
  badge           String?
  images          Json     // Array of ProductImage
  features        Json     // Array of ProductFeature
  specifications  Json     // Array of ProductSpec
  safetyFeatures  Json     // Array of strings
  certifications  Json     // Array of strings
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  orderItems      OrderItem[]
}

model Customer {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  customerId      String
  customer        Customer    @relation(fields: [customerId], references: [id])
  status          OrderStatus @default(PENDING)
  subtotal        Float
  tax             Float
  shipping        Float
  total           Float
  shippingAddress Json
  billingAddress  Json
  stripePaymentId String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  items           OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
  createdAt DateTime @default(now())
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

#### 1.4 Run Migration
```bash
pnpm dlx prisma migrate dev --name init
```

#### 1.5 Seed Database
Create `prisma/seed.ts` to import data from `products.json`:

```typescript
import { PrismaClient } from '@prisma/client';
import productsData from '../src/data/products.json';

const prisma = new PrismaClient();

async function main() {
  for (const product of productsData.products) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log('✅ Database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
pnpm dlx prisma db seed
```

#### 1.6 Create API Routes
Create `src/app/api/products/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}
```

Create `src/app/api/products/[slug]/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  return NextResponse.json(product);
}
```

#### 1.7 Update Product Service
Replace `src/data/productService.ts` with API calls:

```typescript
import { Product } from '@/types/product';

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch('/api/products', { cache: 'no-store' });
  return res.json();
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const res = await fetch(`/api/products/${slug}`, { cache: 'no-store' });
  if (!res.ok) return undefined;
  return res.json();
};

export const getFeaturedProduct = async (): Promise<Product> => {
  const products = await getProducts();
  return products[0];
};
```

---

### Phase 2: Stripe Integration

#### 2.1 Install Stripe
```bash
pnpm add stripe @stripe/stripe-js
```

#### 2.2 Environment Variables
Create `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

#### 2.3 Create Stripe Instance
Create `src/lib/stripe.ts`:

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
```

#### 2.4 Create Checkout API Route
Create `src/app/api/checkout/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    
    // Fetch product details from database
    const lineItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product!.name,
              description: product!.tagline,
            },
            unit_amount: Math.round(product!.price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

#### 2.5 Create Checkout Page
Create `src/app/checkout/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/atoms';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const items = useCartStore((state) => state.items);

  const handleCheckout = async () => {
    setLoading(true);
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    await stripe?.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {/* Add cart summary here */}
      <Button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </div>
  );
}
```

#### 2.6 Create Webhook Handler
Create `src/app/api/webhooks/stripe/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Create order in database
    // Send confirmation email
    // Update inventory
  }

  return NextResponse.json({ received: true });
}
```

#### 2.7 Update Cart to Link to Checkout
In `src/components/organisms/ProductDetails.tsx`, update the button:

```typescript
<Link href="/checkout">
  <Button>Proceed to Checkout</Button>
</Link>
```

---

### Phase 3: Additional Features

#### 3.1 Email Notifications (Resend)
```bash
pnpm add resend
```

Create `src/lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: any) {
  await resend.emails.send({
    from: 'SafeHeat <noreply@safeheat.com>',
    to: order.customer.email,
    subject: 'Order Confirmation',
    html: `<p>Thank you for your order #${order.orderNumber}</p>`,
  });
}
```

#### 3.2 Admin Dashboard
- Create `/admin` route group
- Add authentication (NextAuth.js)
- Build order management UI
- Add product management CRUD

#### 3.3 User Authentication (NextAuth.js)
```bash
pnpm add next-auth
```

---

## 🚀 Deployment Checklist

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables Needed
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY` (optional)

---

## 📝 Summary

**Current State:** Fully functional frontend with cart  
**Next Phase:** Add Prisma for database, then Stripe for payments  
**Timeline Estimate:**
- Phase 1 (Database): 2-4 hours
- Phase 2 (Stripe): 3-5 hours
- Phase 3 (Extras): 5-10 hours

**Total Estimate:** 10-19 hours to full ecommerce with payments

---

**Need help?** All the code structure is already set up - just follow these steps sequentially!

