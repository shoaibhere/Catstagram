import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQs = () => {
  const faqs = [
    {
      question: "Why should cats create an account on your web app?",
      answer:
        "Our app is designed to meet every feline's need for socializing, sharing their adventures, and finding the perfect scratching post recommendations.",
    },
    {
      question: "Will my privacy as a cat be safe?",
      answer:
        "Yes, your data is as safe as your favorite hiding spot! We follow strict protocols to ensure your data.",
    },
    {
      question: "Can I use this app to make friends with other cats?",
      answer:
        "Of course! Our app is a paw-some way to connect with like-minded felines.",
    },
    {
      question: "How can I show off my unique cat personality on the app?",
      answer:
        "You can create a customizable profile with options to share your mood, favorite activities, and even upload your cutest meow moments to gain fans!.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="pt-8 border-t border-purple-900 dark:border-purple-900 py-20 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="flex justify-between items-center w-full text-left p-4 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                )}
              </button>
              {openIndex === index && (
                <div className="mt-2 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-fade-in-down">
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
