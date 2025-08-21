const welcomeEmail = (name) => {
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
        .content p { margin: 0 0 20px; }
        .button { display: inline-block; background-color: #F26323; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { background-color: #f2f2f2; color: #777; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to MaTeesa!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for joining the MaTeesa family. We are thrilled to have you with us.</p>
          <p>Explore our collection of authentic mate and accessories and start your journey with this amazing beverage.</p>
          <a href="http://localhost:3000/shop" class="button">Shop Now</a>
        </div>
        <div class="footer">
          <p>&copy; 2025 MaTeesa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default welcomeEmail;
