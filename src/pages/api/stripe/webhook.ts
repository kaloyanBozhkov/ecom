import { type RequestHandler, buffer } from "micro";
import Cors from "micro-cors";
import type Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { stripeCli } from "@/server/stripe/stripe";
import { env } from "@/env";
import { createOrder } from "@/server/queries/order/createOrder";
import { EmailService } from "@/server/services/email/email";

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

export type StripeItemMetadata = {
  consumed: boolean;
};

export type CustomerDetails = {
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    state: string | null;
  };
  email: string;
  name: string;
  phone: string;
  tax_exempt: "none" | "exempt" | "reverse";
  tax_ids: unknown[]; // You might want to define a more specific type for tax_ids if needed
};

const cors = Cors({
    allowMethods: ["POST", "HEAD"],
  }),
  webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const sig = req.headers["stripe-signature"]!;
      let buf: Buffer;
      let event: Stripe.Event;

      try {
        buf = await buffer(req);
        event = stripeCli.webhooks.constructEvent(buf, sig, webhookSecret);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        // On error, log and return the error message.
        if (err instanceof Error) console.log(err);
        console.log(`❌ Error message: ${errorMessage}`);
        res.status(400).send(`Webhook Error: ${errorMessage}`);
        return;
      }

      // Successfully constructed event.
      console.log("✅ Success:", event.id);

      // Cast event data to Stripe object.
      switch (event.type) {
        case "checkout.session.completed": {
          console.log("session completed ran");
          const session = event.data.object;
          console.log(session);
          const checkoutSessionId = session.id;
          const customerDetails = session.customer_details as CustomerDetails;
          
          if (!session.metadata) throw Error("No metadata found");

          // Parse cart items from metadata
          const cartItems = JSON.parse(session.metadata.cartItems as string) as Array<{
            productId: string;
            productName: string;
            quantity: number;
            price: number;
          }>;

          // Create order in database
          await createOrder({
            checkoutSessionId,
            customerEmail: customerDetails.email,
            customerName: customerDetails.name,
            customerPhone: customerDetails.phone,
            billingAddress: customerDetails.address,
            totalAmount: session.amount_total || 0,
            currency: session.currency?.toUpperCase() || "USD",
            cartItems,
            status: "PAID",
          });

          console.log("✅ Order created successfully for:", customerDetails.email);
          console.log("Session ID:", checkoutSessionId);
          
          // Send order confirmation email
          const orderUrl = `${env.NEXT_PUBLIC_APP_URL}/order/${checkoutSessionId}`;
          const totalInDollars = (session.amount_total || 0) / 100;
          
          await EmailService.sendOrderConfirmationEmail({
            customerEmail: customerDetails.email,
            customerName: customerDetails.name,
            orderNumber: checkoutSessionId.slice(-8).toUpperCase(),
            orderDate: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            orderItems: cartItems,
            subtotal: totalInDollars,
            total: totalInDollars,
            orderUrl,
          });

          console.log("✅ Order confirmation email sent");
          
          // TODO: Update inventory if needed

          break;
        }
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
          break;
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object;
          console.log(
            `❌ Payment failed: ${paymentIntent?.last_payment_error?.message}`,
          );
          break;
        }
        case "charge.succeeded": {
          const charge = event.data.object;
          console.log(`💵 Charge id: ${charge.id}`);
          break;
        }
        default:
          console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      }

      // Return a response to acknowledge receipt of the event.
      res.json({ received: true });
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  };

export default cors(webhookHandler as RequestHandler);

