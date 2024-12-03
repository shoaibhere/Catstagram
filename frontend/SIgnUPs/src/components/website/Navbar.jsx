import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';// Corrected import path


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Activities', href: '#activities'},
    { name: 'Team', href: '#team' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href !== '#') {
      const section = document.querySelector(href);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-gray-800 shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={logo} alt="Catstagram" />
              <span className="ml-2 text-3xl font-normal text-purple-400" style={{ fontFamily: "'Billabong', cursive" }}>
                Catstagram
              </span>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="relative text-gray-300 hover:text-white px-1 pt-1 text-sm font-medium group"
              >
                {item.name}
                <span className="hidden group-hover:inline-block ml-1 transform rotate-45 transition-transform duration-300">🐾</span>
                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-purple-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" 
                      style={{ bottom: '-8px' }}></span>
              </a>
            ))}
            <Link
            to='/login'
            >
            <button className="relative text-gray-300 hover:text-white px-1 pt-1 text-sm font-medium group">
              <User className="h-6 w-6 mr-2 inline-block" />
              <span>
                Login
                <span className="hidden group-hover:inline-block ml-1 transform rotate-45 transition-transform duration-300">🐾</span>
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-purple-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" 
                    style={{ bottom: '-8px' }}></span>
            </button>
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-purple-400 text-base font-medium transition-all duration-300"
              >
                {item.name}
              </a>
            ))}
            <button className="text-gray-300 hover:text-white w-full pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-purple-400 text-base font-medium transition-all duration-300 flex items-center">
              <User className="h-6 w-6 mr-2" />
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

