const emailVerificationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
  <!-- Main Wrapper with Background Image -->
  <div style="background-image: url('https://background.jpg'); background-size: cover; background-position: center center; padding: 50px 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: rgba(255, 255, 255, 0.8); padding: 30px; border-radius: 8px; text-align: center;">
      <!-- Logo Section -->
      <div style="margin-bottom: 30px;">
      </div>
      
      <!-- Heading -->
      <h1 style="color: #333; font-size: 32px; margin-bottom: 20px;">Verify Your Email Address</h1>
      <p style="color: #555; font-size: 18px; line-height: 1.5;">Thank you for signing up! To complete your registration, please use the verification code below:</p>
      
      <!-- Verification Token -->
      <div style="background-color: #4CAF50; color: white; font-size: 32px; font-weight: bold; padding: 20px; margin: 30px 0; border-radius: 5px;">
        {verificationToken}
      </div>
      
      <p style="color: #555; font-size: 16px; line-height: 1.5;">Enter this code on the verification page to confirm your email. This code will expire in 15 minutes.</p>
      
      <p style="color: #555; font-size: 16px; line-height: 1.5;">If you didn’t sign up for an account, please disregard this email.</p>
      
      <!-- Footer -->
      <p style="color: #888; font-size: 0.8em; margin-top: 40px;">This is an automated message, please do not reply to this email.</p>
      <p style="font-weight:bold" >Regards,</p>
      <p style="font-weight:bold">Team Catstagram</p>
    </div>
  </div>
</body>
</html>

`;

// const passwordResetTemplateWithCode = (resetCode) => `
//   <div style="background-image: url('https://your-background-image-url.com'); padding: 20px; font-family: Arial, sans-serif; text-align: center;">
//     <div style="background-color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto;">
//       <img src="https://your-logo-url.com" alt="Logo" style="width: 150px; margin-bottom: 20px;">
//       <h1 style="color: #333;">Password Reset</h1>
//       <p style="font-size: 16px; color: #666;">We received a request to reset your password. Use the code below to reset it:</p>
//       <p style="font-size: 24px; color: #4CAF50; font-weight: bold; margin: 20px 0;">${resetCode}</p>
//       <p style="font-size: 14px; color: #888;">If you did not request a password reset, please ignore this email.</p>
//     </div>
//   </div>
// `;
// const passwordResetSuccessTemplate = `
//   <div style="background-image: url('https://your-background-image-url.com'); padding: 20px; font-family: Arial, sans-serif; text-align: center;">
//     <div style="background-color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto;">
//       <img src="https://your-logo-url.com" alt="Logo" style="width: 150px; margin-bottom: 20px;">
//       <h1 style="color: #333;">Password Reset Successfully</h1>
//       <p style="font-size: 16px; color: #666;">Your password has been reset successfully. You can now log in with your new password.</p>
//       <a href="https://your-login-page-url.com" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
//       <p style="font-size: 14px; color: #888; margin-top: 20px;">If you did not reset your password, please contact our support team immediately.</p>
//     </div>
//   </div>
// `;

// module.exports = passwordResetSuccessTemplate;
// module.exports = passwordResetTemplateWithCode;
module.exports = emailVerificationTemplate;
