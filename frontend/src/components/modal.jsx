import React from 'react';
import { useTheme } from '../contexts/themeContext';

const Modal = ({ isOpen, onClose, children }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className={`w-full max-w-lg max-h-[80vh] flex flex-col rounded-lg overflow-hidden ${
        isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      }`}>
        <div className={`p-4 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className={`float-right text-2xl font-bold ${
              isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold">Comments</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

