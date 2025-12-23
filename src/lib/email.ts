import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface StockAlertEmailProps {
  productName: string;
  sku: string;
  currentStock: number;
  threshold: number;
  category?: string;
}

export async function sendStockAlertEmail({
  productName,
  sku,
  currentStock,
  threshold,
  category,
}: StockAlertEmailProps) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">⚠️ Stock Alert: ${productName}</h2>
        
        <div style="background-color: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #e53e3e;">
          <h3>Product Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Product:</strong> ${productName}</li>
            ${sku ? `<li><strong>SKU:</strong> ${sku}</li>` : ''}
            ${category ? `<li><strong>Category:</strong> ${category}</li>` : ''}
            <li><strong>Current Stock:</strong> ${currentStock} units</li>
            <li><strong>Minimum Threshold:</strong> ${threshold} units</li>
          </ul>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fed7d7; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold;">
              ${currentStock === 0 ? '⚠️ OUT OF STOCK!' : `⚠️ Stock is below minimum threshold!`}
            </p>
            <p style="margin: 10px 0 0 0;">
              ${currentStock === 0 
                ? 'This product is out of stock. Please restock immediately.' 
                : 'Please consider restocking this product soon.'
              }
            </p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px;">
            This alert was generated automatically by your inventory management system.
          </p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Inventory Alert <${process.env.EMAIL_FROM || 'noreply@resend.dev'}>`,
      to: ['admin@yourcompany.com', 'manager@yourcompany.com'], // Ganti dengan email yang sesuai
      subject: `⚠️ Stock Alert: ${productName} (${currentStock} units left)`,
      html: html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}