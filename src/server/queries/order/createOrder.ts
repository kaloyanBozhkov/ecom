import { prisma } from "@/server/db";
import { type order_status } from "@prisma/client";

export const createOrder = async ({
  checkoutSessionId,
  customerEmail,
  customerName,
  customerPhone,
  billingAddress,
  totalAmount,
  currency,
  cartItems,
  status = "PAID",
}: {
  checkoutSessionId: string;
  customerEmail: string;
  customerName?: string | null;
  customerPhone?: string | null;
  billingAddress?: {
    city?: string | null;
    country?: string | null;
    line1?: string | null;
    line2?: string | null;
    postal_code?: string | null;
    state?: string | null;
  };
  totalAmount: number; // in cents
  currency: string;
  cartItems: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  status?: order_status;
}) => {
  // First, ensure user exists or create them
  const user = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      name: customerName || customerEmail.split("@")[0],
      phone_number: customerPhone,
    },
    create: {
      email: customerEmail,
      name: customerName || customerEmail.split("@")[0],
      phone_number: customerPhone,
    },
  });

  // Create the order
  const order = await prisma.order.create({
    data: {
      user_id: user.id,
      checkout_session_id: checkoutSessionId,
      status,
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone,
      billing_address_city: billingAddress?.city,
      billing_address_country: billingAddress?.country,
      billing_address_line1: billingAddress?.line1,
      billing_address_line2: billingAddress?.line2,
      billing_address_postal_code: billingAddress?.postal_code,
      billing_address_state: billingAddress?.state,
      total_amount: totalAmount,
      currency,
      cart_items: cartItems,
    },
  });

  return order;
};

