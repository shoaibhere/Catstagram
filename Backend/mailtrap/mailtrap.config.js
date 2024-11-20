const dotenv = require("dotenv");
const { MailtrapClient } = require("mailtrap");

dotenv.config(); // Load environment variables from .env file

const TOKEN = "435a8d6072d22e6ca1f34c54db1bebdd"; // Fetch token from environment variable
const ENDPOINT = "https://send.api.mailtrap.io/"; // Correct API endpoint

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint: ENDPOINT,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Catstagram Team",
};

module.exports = { mailtrapClient, sender };
