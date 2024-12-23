import React, { useState } from "react";
import { useTheme } from "./ThemeContext"; // Ensure the path is correct
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isDarkMode } = useTheme(); // Use the theme context

  const handleSubmit = () => {
    setIsSubmitted(true); // Set state to true on successful submission
  };

  // Conditional classes based on the theme
  const inputStyle = isDarkMode
    ? "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
    : "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900";

  const labelStyle = isDarkMode
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-600 mb-1";

  return (
    <section
      id="contact"
      className={`pt-8 border-t ${
        isDarkMode
          ? "border-purple-900 py-20 bg-gray-800"
          : "border-purple-500 py-20 bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
            isDarkMode ? "text-purple-200" : "text-gray-800"
          }`}
        >
          Get in Touch
        </h2>

        <div className="flex justify-center">
          <form
            className="space-y-6 w-full md:w-1/2"
            action="https://api.web3forms.com/submit"
            method="POST"
            onSubmit={handleSubmit} // Allow form submission and handle success
          >
            <input
              type="hidden"
              name="access_key"
              value="0fe491ff-09b1-4358-ba44-780f92009d47"
            />
            {/* Use conditional styles */}
            <div>
              <label htmlFor="name" className={labelStyle}>
                Your Name
              </label>
              <input type="text" id="name" name="name" className={inputStyle} />
            </div>
            <div>
              <label htmlFor="email" className={labelStyle}>
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="message" className={labelStyle}>
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className={inputStyle}
              ></textarea>
            </div>
            <input
              type="hidden"
              name="redirect"
              value="http://localhost:5173"
            ></input>
            <button
              type="submit"
              className={`w-full ${
                isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-400 hover:bg-purple-500"
              } text-white py-3 px-6 rounded-md transition duration-300 transform hover:scale-105`}
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Success Alert Box */}
        {isSubmitted && (
          <div className="flex justify-center mt-8">
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <strong className="font-bold">Success!</strong>
              <span className="ml-2 block sm:inline">
                Your message has been sent successfully.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
