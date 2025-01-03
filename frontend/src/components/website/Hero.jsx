import { Link } from "react-router-dom"; // Corrected import
import React from "react";

const Hero = () => {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <div
        className="pt-8 border-t border-purple-900 dark:border-purple-900 absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white dark:text-gray-100 mb-4 leading-tight animate-fade-in-down">
              Purr-fect Website for Your
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white dark:text-gray-100 mb-8 leading-tight animate-fade-in-down">
              Feline Friends
            </h1>
            <p className="text-xl md:text-2xl text-purple-300 dark:text-purple-200 mb-12 animate-fade-in-up">
              Where every cat is treated like royalty.
            </p>
            <Link
              to="/signup" // Use "to" for routing
            >
              <button className="bg-purple-600 dark:bg-purple-500 text-white py-3 px-8 rounded-full text-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition duration-3000 transform hover:scale-105 animate-bounce">
                Meow to Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
