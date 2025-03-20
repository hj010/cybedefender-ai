// UserMenu.js
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   // Navigate to profile settings page
   const handleProfileSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  // Navigate to profile settings page
  const handleSupportSettings = () => {
    setIsOpen(false);
    navigate('/support');
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User button that toggles dropdown */}
      <div 
        className="flex items-center gap-2 cursor-pointer bg-white rounded-full border px-3 py-1.5 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm">{Cookies.get('username') ? Cookies.get('username').charAt(0).toUpperCase() : 'U'}</span>
        </div>
        <span className="font-medium text-gray-700"> {Cookies.get('username') || 'Unknown User'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border animate-fadeIn z-50">
          {/* User info header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600"> {Cookies.get('username') ? Cookies.get('username').charAt(0).toUpperCase() : 'U'}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{Cookies.get('username') || 'Unknown User'}</div>
                <div className="text-sm text-gray-500">{Cookies.get('email') || 'No Email'}</div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
              onClick={handleProfileSettings}
            >
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile Settings
            </button>

            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
              onClick={handleSupportSettings}
            >
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Help & Support
            </button>

            <div className="h-px bg-gray-200 my-2"></div>

            <button 
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-red-600"
              onClick={onLogout}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;