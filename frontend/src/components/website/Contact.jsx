import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-300">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-white">Reach Out to Us</h3>
            <p className="text-gray-300 mb-8">We'd love to hear from you. Feel free to reach out with any questions about our Catstagram services.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-purple-400 mr-4" />
                <p className="text-gray-300"><strong className="text-white">Phone:</strong> +92 322 4354756 </p>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-purple-400 mr-4" />
                <p className="text-gray-300"><strong className="text-white">Email:</strong> team@catstagram.com</p>
              </div>
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-purple-400 mr-4" />
                <p className="text-gray-300"><strong className="text-white">Address:</strong> 123 Meow Street, Paw-Villa, Postal-Code 12345</p>
              </div>
            </div>
          </div>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Your Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

