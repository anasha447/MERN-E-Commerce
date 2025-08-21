const orderConfirmationEmail = (order) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Quicksand', sans-serif; margin: 0; padding: 0; background-color: #F9F7F3; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #EADBA2; border-radius: 8px; overflow: hidden; }
        .header { background-color: #2F3B28; color: #EADBA2; padding: 40px; text-align: center; }
        .header h1 { margin: 0; font-family: 'Asul', serif; font-size: 32px; }
        .content { padding: 40px; color: #3E5F2D; line-height: 1.6; }
        .content h2 { color: #2F3B28; }
        .order-details { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .order-details th, .order-details td { border: 1px solid #EADBA2; padding: 12px; text-align: left; }
        .order-details th { background-color: #F9F7F3; }
        .footer { background-color: #f2f2f2; color: #777; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You For Your Order!</h1>
        </div>
        <div class="content">
          <h2>Hi ${order.shippingAddress.name},</h2>
          <p>We've received your order and are getting it ready for you. Here are the details:</p>
          <h3>Order ID: ${order._id}</h3>
          <table class="order-details">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                  <td>$${item.price.toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2" style="text-align:right;">Subtotal:</th>
                <td>$${order.itemsPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th colspan="2" style="text-align:right;">Shipping:</th>
                <td>$${order.shippingPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th colspan="2" style="text-align:right;">Tax:</th>
                <td>$${order.taxPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th colspan="2" style="text-align:right;">Total:</th>
                <td>$${order.totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <h3>Shipping Address</h3>
          <p>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2025 MaTeesa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default orderConfirmationEmail;
