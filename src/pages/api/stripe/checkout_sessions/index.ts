import type Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { stripeCli } from "@/server/stripe/stripe";
import { formatAmountForStripe } from "@/server/stripe/stripe.helpers";

export type CartCheckoutPayloadBody = {
  amount: number;
  currency: "USD";
  onCancelRedirectTo: string;
  config: Record<string, string | number>;
};

const MIN_AMOUNT = 0.5,
  MAX_AMOUNT = 100000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { amount, currency, onCancelRedirectTo, config } =
      req.body as CartCheckoutPayloadBody;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT))
        throw new Error("Invalid amount.");

      let onCancelRedirect = onCancelRedirectTo;

      if (!onCancelRedirectTo) onCancelRedirect = `/`;

      // Build line items from cart config
      const cartItems = JSON.parse(config.cartItems as string) as Array<{
        productId: string;
        productName: string;
        quantity: number;
        price: number;
      }>;

      const params: Stripe.Checkout.SessionCreateParams = {
          mode: "payment",
          submit_type: "pay",
          payment_method_types: ["card"],
          phone_number_collection: {
            enabled: true,
          },
          line_items: cartItems.map(item => ({
            price_data: {
              unit_amount: formatAmountForStripe(item.price, currency),
              currency,
              product_data: {
                images: [],
                name: item.productName,
                description: `Quantity: ${item.quantity}`,
              },
            },
            quantity: item.quantity,
          })),
          metadata: {
            ...config,
          },
          billing_address_collection: "required",
          cancel_url: `${req.headers.origin!}/${onCancelRedirect}`,
          success_url: `${req.headers.origin!}/order/{CHECKOUT_SESSION_ID}`,
          custom_text: {
            submit: {
              message: `Complete your order!`,
            },
          },
          customer_creation: "always",
          allow_promotion_codes: true,
          payment_intent_data: {
            setup_future_usage: "on_session",
          },
        },
        checkoutSession: Stripe.Checkout.Session =
          await stripeCli.checkout.sessions.create(params);

      console.log("checkoutSession", checkoutSession);

      // Return the checkout session URL instead of just the ID
      res.status(200).json({ 
        sessionId: checkoutSession.id,
        url: checkoutSession.url 
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

