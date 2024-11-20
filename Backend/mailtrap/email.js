const { mailtrapClient, sender } = require("./mailtrap.config.js"); // Ensure client name matches
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("./emailTemplate.js");

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "94425b07-a576-4e6e-bc57-52b6e6bba48e",
      template_variables: {
        name: verificationToken,
      },
    });
    console.log("Email sent successfully");
    return response; // Return response for further use or testing
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Failed to send email: " + error.message);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "2fdba96c-15dc-496b-a263-47c7db33dc2b",
      template_variables: {
        name: name,
        company_info_name: "Catstagram",
        company_info_address: "CUI",
        company_info_city: "Lahore",
        company_info_zip_code: "54000",
        company_info_country: "Pakistan",
      },
    });
    console.log("Email set successfully");
  } catch (error) {
    throw new Error("Failed to send email: " + error.message);
  }
};

const sendResetPasswordEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    throw new Error("Failed to send password reset email: " + error.message);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Password reset success email sent successfully");
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
