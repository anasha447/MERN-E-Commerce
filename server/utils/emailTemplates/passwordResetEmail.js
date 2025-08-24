const passwordResetEmail = (resetUrl) => {
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
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello,</h2>
          <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the button below to reset your password. This link is valid for 10 minutes.</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 MaTeesa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default passwordResetEmail;
