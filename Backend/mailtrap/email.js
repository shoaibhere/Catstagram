const nodemailer = require("nodemailer");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("./emailTemplate.js");

// Create a Nodemailer transporter (You can use Gmail SMTP, SMTP server, etc.)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // SMTP server for Brevo
  port: 587, // TLS port (use 465 for SSL)
  secure: false, // Use TLS (true for SSL)
  auth: {
    user: "8460e3001@smtp-brevo.com", // Your Brevo SMTP username (use the provided email)
    pass: "NbCXaRcp9x1AUmfh", // Your Brevo SMTP key
  },
});

// Sender email address
const sender = '"Catstagram" <danialwajid112@gmail.com>'; // Customize your app name and email

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email, // Single recipient email
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ), // Customize with template
    });
    console.log("Verification email sent successfully");
    return response; // Return response for further use or testing
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
    throw new Error("Failed to send verification email: " + error.message);
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email, // Single recipient email
      subject: "Welcome to Catstagram!", // Customize as per your needs
      html: WELCOME_EMAIL_TEMPLATE.replace("{Name}", name), // Replace with an actual template if needed
    });
    console.log("Welcome email sent successfully");
    return response;
  } catch (error) {
    console.error("Failed to send welcome email:", error.message);
    throw new Error("Failed to send welcome email: " + error.message);
  }
};

const sendResetPasswordEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email, // Single recipient email
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL), // Replace reset URL in template
    });
    console.log("Password reset email sent successfully");
    return response;
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    throw new Error("Failed to send password reset email: " + error.message);
  }
};

const sendResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email, // Single recipient email
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE, // Use the template for success message
    });
    console.log("Password reset success email sent successfully");
    return response;
  } catch (error) {
    console.error(
      "Failed to send password reset success email:",
      error.message
    );
    throw new Error(
      "Failed to send password reset success email: " + error.message
    );
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
};
