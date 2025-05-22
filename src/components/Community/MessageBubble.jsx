import React, { useState, useContext, useCallback } from 'react';
import { CommunityContext } from '../../context/CommunityContext';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

const MessageBubble = ({ message, isOwnMessage, isAdmin }) => {
  const { deleteMessage, blockUser } = useContext(CommunityContext);
  const { theme } = useContext(ThemeContext);
  const { users } = useContext(AuthContext);
  const [showOptions, setShowOptions] = useState(false);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      month: 'short',
      day: 'numeric'
    });
  };

  // Format message text and highlight tagged users
  const formatMessageWithTags = useCallback((text) => {
    if (!text) return null;
    
    // Regular expression to find @username mentions
    const tagRegex = /@(\w+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let index = 0;
    
    while ((match = tagRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
        index++;
      }
      
      // Add the highlighted tag
      const username = match[1];
      const isValidUser = users.some(u => u.username === username);
      
      parts.push(
        <span 
          key={`tag-${index}`}
          className={`${isValidUser ? 'font-semibold' : ''} ${isOwnMessage ? 'text-blue-100' : theme.darkMode ? 'text-blue-300' : 'text-blue-500'} ${isValidUser ? 'underline' : ''}`}
          title={isValidUser ? `Utilisateur taggé: ${username}` : ''}
        >
          @{username}
        </span>
      );
      index++;
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${index}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : text;
  }, [users, isOwnMessage, theme.darkMode]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(message.id);
      setShowOptions(false);
    }
  };

  const handleBlock = () => {
    if (window.confirm(`Are you sure you want to block ${message.username}? They won't know they're blocked.`)) {
      blockUser(message.username);
      setShowOptions(false);
    }
  };

  // Determine bubble style based on ownership and theme
  const bubbleStyle = isOwnMessage
    ? theme.darkMode
      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
    : theme.darkMode
      ? 'bg-gray-800 bg-opacity-90 text-white'
      : 'bg-white backdrop-filter backdrop-blur-sm bg-opacity-90 text-gray-800 border border-gray-200';
      
  // Determine animation style
  const animStyle = isOwnMessage ? 'animate-slideInRight' : 'animate-fadeIn';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group mb-3`}>
      <div className="max-w-[75%]">
        {!isOwnMessage && (
          <div className="ml-2 mb-1 text-sm font-medium flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">
                {message.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={theme.darkMode ? 'text-gray-300' : 'text-gray-600'}>{message.username}</span>
          </div>
        )}
        
        <div className="relative">
          <div
            className={`${bubbleStyle} p-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${isOwnMessage ? 'rounded-br-none' : 'rounded-bl-none'} ${animStyle}`}
            style={{animationDuration: '0.4s', animationFillMode: 'backwards'}}
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}
          >
            {message.text && (
              <p className="break-words">
                {formatMessageWithTags(message.text)}
              </p>
            )}
            
            {message.media && message.mediaType === 'image' && (
              <div className="mt-3 mb-1 overflow-hidden rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                <img
                  src={message.media}
                  alt="Message attachment"
                  className="max-w-full object-cover w-full"
                  loading="lazy"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Simulate a lightbox effect by setting a full screen view
                    if (window.confirm('Ouvrir l\'image en plein écran?')) {
                      window.open(message.media, '_blank');
                    }
                  }}
                />
              </div>
            )}
            
            {message.media && message.mediaType === 'video' && (
              <div className="mt-3 mb-1 overflow-hidden rounded-lg shadow-md">
                <video
                  src={message.media}
                  className="max-w-full w-full"
                  controls
                  preload="metadata"
                />
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <div className={`text-xs flex items-center ${isOwnMessage ? 'text-blue-200' : theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTimestamp(message.timestamp)}
              </div>
              
              {/* Message delivery status for own messages */}
              {isOwnMessage && (
                <div className="text-xs text-blue-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Message options */}
            {showOptions && (isOwnMessage || isAdmin) && (
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 flex space-x-1">
                {isOwnMessage && (
                  <button 
                    onClick={(e) => {e.stopPropagation(); alert('Fonctionnalité d\'édition à venir')}}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    title="Modifier le message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  title="Supprimer le message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}

            {/* Block user option (only for admin) */}
            {showOptions && isAdmin && !isOwnMessage && (
              <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                <button 
                  onClick={handleBlock}
                  className="bg-gray-700 hover:bg-gray-800 text-white p-1.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-1"
                  title={`Bloquer ${message.username}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span className="text-xs hidden sm:inline">Bloquer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;