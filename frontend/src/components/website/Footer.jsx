import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="pt-8 border-t border-purple-900 dark:border-purple-900 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-purple-300">
              Catstagram
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Purr-fect platform for cats.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-300 transition duration-300 transform hover:scale-110"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          <div></div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-purple-300">
              Catstagram Contact
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Phone: 111 111 111
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Email: team@catstagram.com
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Address: Comsats University Islamabad , Lahore Campus
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 dark:border-gray-600 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Catstagram. All rights are
            paws-erved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
