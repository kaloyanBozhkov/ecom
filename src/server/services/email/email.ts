import { Resend } from "resend";
import { env } from "@/env";
import { orderConfirmationStyles } from "./templates/orderConfirmation.styles";

const resend = new Resend(env.RESEND_API_KEY);

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailParams {
  customerEmail: string;
  customerName?: string | null;
  orderNumber: string;
  orderDate: string;
  orderItems: OrderItem[];
  subtotal: number;
  total: number;
  orderUrl: string;
}

export class EmailService {
  static async sendOrderConfirmationEmail({
    customerEmail,
    customerName,
    orderNumber,
    orderDate,
    orderItems,
    subtotal,
    total,
    orderUrl,
  }: OrderConfirmationEmailParams): Promise<void> {
    const displayName = customerName || customerEmail.split("@")[0];
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - SafeHeat™</title>
${orderConfirmationStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔥 SafeHeat™</div>
              <div class="header-subtitle">Your Order is Confirmed</div>
            </div>
            
            <div class="content">
              <div class="success-badge">
                <div class="success-icon">✓</div>
                <h2 class="success-title">Order Confirmed!</h2>
              </div>

              <p>Hi ${displayName},</p>
              <p>Thank you for your order! We're excited to get your SafeHeat™ Propane Garage Heater on its way to you.</p>
              
              <div class="order-details">
                <div class="order-row">
                  <span class="order-label">Order Number</span>
                  <span class="order-value">#${orderNumber}</span>
                </div>
                <div class="order-row">
                  <span class="order-label">Order Date</span>
                  <span class="order-value">${orderDate}</span>
                </div>
                <div class="order-row">
                  <span class="order-label">Email</span>
                  <span class="order-value">${customerEmail}</span>
                </div>
              </div>

              <h3>Order Summary</h3>
              <div class="cart-items">
                ${orderItems.map(item => `
                  <div class="cart-item">
                    <div class="item-image">
                      <span style="font-size: 32px;">🔥</span>
                    </div>
                    <div class="item-details">
                      <div class="item-name">${item.productName}</div>
                      <div class="item-qty">Quantity: ${item.quantity}</div>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                `).join('')}
              </div>

              <div class="total-section">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Shipping</span>
                  <span style="color: #16a34a; font-weight: 600;">FREE</span>
                </div>
                <div class="total-row total-final">
                  <span>Total</span>
                  <span>$${total.toFixed(2)}</span>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="${orderUrl}" class="button">View Order Details</a>
              </div>

              <div class="info-box">
                <h4 style="margin-top: 0;">What's Next?</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Your order will ship within 2-5 business days</li>
                  <li>You'll receive a shipping confirmation with tracking</li>
                  <li>Free U.S. shipping included</li>
                  <li>2-year warranty automatically activated</li>
                </ul>
              </div>

              <p style="margin-top: 30px;">If you have any questions about your order, feel free to reply to this email or contact our support team.</p>
              
              <p style="margin-top: 20px;">Stay warm!<br><strong>The SafeHeat™ Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This email was sent to ${customerEmail}</p>
              <div class="footer-links">
                <a href="${orderUrl}" class="footer-link">View Order</a>
                <a href="${env.NEXT_PUBLIC_APP_URL}/product/safeheat-propane-heater" class="footer-link">Product Info</a>
                <a href="${env.NEXT_PUBLIC_APP_URL}" class="footer-link">Visit Store</a>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} SafeHeat™. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await resend.emails.send({
        from: "SafeHeat™ <orders@safeheat.com>",
        to: [customerEmail],
        subject: `Order Confirmation - Order #${orderNumber}`,
        html: htmlContent,
      });
      
      console.log(`✅ Order confirmation email sent to ${customerEmail}`);
    } catch (error) {
      console.error("Failed to send order confirmation email:", error);
      throw new Error("Failed to send order confirmation email");
    }
  }
}

