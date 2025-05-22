import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { MessagingContext } from '../../context/MessagingContext';
import { AssistantContext } from '../../context/AssistantContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { hasUnreadMessages } = useContext(MessagingContext);
  const { toggleAssistant, isOpen } = useContext(AssistantContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Accueil';
    if (path === '/community') return 'Communauté';
    if (path === '/polls') return 'Sondages';
    if (path === '/settings') return 'Réglages';
    if (path === '/admin') return 'Panneau Admin';
    if (path === '/messaging' || path.startsWith('/messaging/')) return 'Messagerie';
    return '';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              Konexa
            </span>
          </Link>
          <span className="ml-6 text-gray-600 font-medium">{getPageTitle()}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Assistant Button */}
          <button 
            onClick={toggleAssistant}
            className="relative p-2 text-gray-600 hover:text-blue-500 transition-colors"
            title="Assistant virtuel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            {isOpen && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            )}
          </button>
          
          {/* Messaging Notification */}
          <Link 
            to="/messaging" 
            className="relative p-2 text-gray-600 hover:text-blue-500 transition-colors"
            title="Messagerie"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {hasUnreadMessages && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </Link>
          
          {/* User Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-3 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-gray-700 text-sm font-medium">{user?.username}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 flex items-center justify-center text-white font-medium">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Paramètres du profil
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Panneau d'administration
                  </Link>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;