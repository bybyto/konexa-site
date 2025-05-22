import React, { useState, useContext, useRef, useEffect } from 'react';
import { CommunityContext } from '../../context/CommunityContext';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const { sendMessage } = useContext(CommunityContext);
  const { user, users } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Monitor for @ symbol to trigger user tagging
  useEffect(() => {
    if (!message) return;
    
    const lastAtSignIndex = message.lastIndexOf('@');
    
    if (lastAtSignIndex !== -1) {
      const afterAt = message.substring(lastAtSignIndex + 1);
      const hasSpace = afterAt.includes(' ');
      
      if (!hasSpace) {
        setTagQuery(afterAt);
        setShowTagSuggestions(true);
        findSuggestedUsers(afterAt);
        return;
      }
    }
    
    setShowTagSuggestions(false);
  }, [message]);

  // Click outside handler to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find users that match the tag query
  const findSuggestedUsers = (query) => {
    if (!query || query.length === 0) {
      setSuggestedUsers(users.slice(0, 5)); // Show first 5 users if no query
      return;
    }
    
    const filteredUsers = users
      .filter(u => u.username.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5); // Limit to 5 suggestions
    
    setSuggestedUsers(filteredUsers);
  };

  // Handle selecting a user tag
  const handleSelectUser = (username) => {
    const lastAtSignIndex = message.lastIndexOf('@');
    const newMessage = message.substring(0, lastAtSignIndex) + `@${username} `;
    
    setMessage(newMessage);
    setShowTagSuggestions(false);
    inputRef.current.focus();
  };

  // Track cursor position for tag suggestions
  const handleCursorChange = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() && !attachment) return;
    
    sendMessage(message, attachment);
    setMessage('');
    setAttachment(null);
    setPreviewUrl(null);
    setShowTagSuggestions(false);
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image or video
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file.');
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB.');
      return;
    }

    setAttachment(file);
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    fileReader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`border-t ${theme.darkMode ? 'border-gray-700 bg-gray-800 bg-opacity-80' : 'border-gray-200 bg-white bg-opacity-80'} backdrop-filter backdrop-blur-lg p-5 sticky bottom-0 shadow-lg z-10`}>
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {previewUrl && (
          <div className="mb-4 relative">
            <div className={`rounded-xl overflow-hidden border ${theme.darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} shadow-lg transition-all duration-300 transform hover:scale-[1.01]`}>
              <div className="relative">
                {attachment?.type.startsWith('image/') ? (
                  <img 
                    src={previewUrl} 
                    alt="Aperçu de l'image" 
                    className="max-h-60 object-contain w-full" 
                  />
                ) : (
                  <video 
                    src={previewUrl} 
                    className="max-h-60 object-contain w-full" 
                    controls 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className={`py-2 px-3 flex justify-between items-center ${theme.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <span className="text-sm truncate ${theme.darkMode ? 'text-gray-300' : 'text-gray-600'}">
                  {attachment?.name || 'Pièce jointe'}
                </span>
                <button
                  type="button"
                  onClick={removeAttachment}
                  className={`p-1.5 rounded-full ${theme.darkMode ? 'bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-red-300' : 'bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-500'} transition-colors duration-200`}
                  title="Supprimer la pièce jointe"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-full ${theme.darkMode ? 'text-gray-400 hover:text-blue-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-500 hover:text-blue-500 bg-gray-100 hover:bg-gray-200'} transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*, video/*"
            onChange={handleAttachmentChange}
            className="hidden"
          />
          
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={handleCursorChange}
              onClick={handleCursorChange}
              className={`w-full rounded-full py-3.5 px-5 pr-16 ${
                theme.darkMode 
                  ? 'bg-gray-700 bg-opacity-70 text-white border-gray-600 focus:bg-gray-700 focus:bg-opacity-90' 
                  : 'bg-white bg-opacity-80 text-gray-900 border-gray-300 focus:bg-white'
              } border shadow-inner focus:shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200 outline-none`}
              placeholder="Tapez un message... (utilisez @ pour mentionner des utilisateurs)"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button 
                type="button"
                className={`text-gray-400 hover:text-blue-500 transition-all duration-200 p-1.5 rounded-full ${theme.darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transform hover:scale-110`}
                title="Emoji"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            {/* User tagging suggestions dropdown */}
            {showTagSuggestions && (
              <div 
                ref={suggestionsRef}
                className={`absolute bottom-full left-4 mb-3 w-72 max-h-60 overflow-hidden rounded-xl shadow-xl ${theme.darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white'} border ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'} z-10 backdrop-filter backdrop-blur-sm transition-all duration-300 animate-fadeIn`}
                style={{transform: 'translateY(8px)', animation: 'fadeIn 0.3s ease-out forwards'}}
              >
                <div className={`flex items-center justify-between px-4 py-2.5 border-b ${theme.darkMode ? 'border-gray-700 bg-gray-700 bg-opacity-40' : 'border-gray-100 bg-gray-50'}`}>
                  <div className={`text-sm font-medium flex items-center ${theme.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${theme.darkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mentionner un utilisateur
                  </div>
                  <button onClick={() => setShowTagSuggestions(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto max-h-48">
                  {suggestedUsers.length > 0 ? (
                    <ul className="py-1">
                      {suggestedUsers.map((suggestedUser, index) => (
                        <li 
                          key={suggestedUser.username} 
                          className={`px-4 py-2.5 cursor-pointer ${theme.darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-150`}
                          onClick={() => handleSelectUser(suggestedUser.username)}
                          style={{animationDelay: `${index * 50}ms`}}
                        >
                          <div className="flex items-center">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center mr-3 shadow-sm">
                              <span className="text-white text-sm font-medium">
                                {suggestedUser.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className={`font-medium ${theme.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{suggestedUser.username}</span>
                              <p className={`text-xs ${theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{suggestedUser.username.toLowerCase()}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Aucun utilisateur trouvé
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() && !attachment}
            className={`p-3.5 rounded-full transform transition-all duration-300 shadow-md ${
              message.trim() || attachment
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 hover:shadow-lg hover:rotate-3'
                : 'bg-gradient-to-r from-blue-300 to-indigo-400 cursor-not-allowed opacity-70'
            } text-white`}
            title="Envoyer le message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="sr-only">Envoyer</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;