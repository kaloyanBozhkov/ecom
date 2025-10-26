export const orderConfirmationStyles = `<style>
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
    line-height: 1.6; 
    color: #333; 
    margin: 0; 
    padding: 0;
    background-color: #f5f5f5;
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background-color: #ffffff;
  }
  .header { 
    background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
    text-align: center; 
    padding: 40px 20px;
    color: white;
  }
  .logo { 
    font-size: 28px; 
    font-weight: bold; 
    color: white;
    margin-bottom: 10px;
  }
  .header-subtitle {
    font-size: 16px;
    opacity: 0.9;
  }
  .content { 
    padding: 40px 30px;
  }
  .success-badge {
    background: #dcfce7;
    border: 2px solid #16a34a;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    margin-bottom: 30px;
  }
  .success-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }
  .success-title {
    font-size: 24px;
    font-weight: bold;
    color: #16a34a;
    margin: 0;
  }
  .order-details {
    background: #f9fafb;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .order-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
  .order-row:last-child {
    border-bottom: none;
  }
  .order-label {
    color: #6b7280;
    font-size: 14px;
  }
  .order-value {
    font-weight: 600;
    color: #111827;
    font-size: 14px;
  }
  .cart-items {
    margin: 30px 0;
  }
  .cart-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  .item-image {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #fed7aa 0%, #fecaca 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .item-details {
    flex: 1;
  }
  .item-name {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 5px;
  }
  .item-qty {
    color: #6b7280;
    font-size: 14px;
  }
  .item-price {
    font-weight: 600;
    color: #ea580c;
    font-size: 16px;
  }
  .total-section {
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .total-final {
    font-size: 24px;
    font-weight: bold;
    padding-top: 15px;
    border-top: 2px solid #f59e0b;
    margin-top: 10px;
  }
  .button { 
    display: inline-block; 
    background: #ea580c; 
    color: white; 
    padding: 14px 28px; 
    text-decoration: none; 
    border-radius: 8px; 
    font-weight: 600;
    text-align: center;
    margin: 20px 0;
  }
  .button:hover {
    background: #c2410c;
  }
  .info-box {
    background: #dbeafe;
    border-left: 4px solid #3b82f6;
    padding: 15px;
    margin: 20px 0;
    border-radius: 4px;
  }
  .footer { 
    text-align: center; 
    color: #6b7280; 
    font-size: 14px;
    padding: 30px 20px;
    background: #f9fafb;
  }
  .footer-links {
    margin-top: 15px;
  }
  .footer-link {
    color: #ea580c;
    text-decoration: none;
    margin: 0 10px;
  }
</style>`;

