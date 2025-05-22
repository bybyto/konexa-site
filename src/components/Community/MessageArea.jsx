import React, { useContext, useEffect, useRef, useState } from 'react';
import { CommunityContext } from '../../context/CommunityContext';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import MessageBubble from './MessageBubble';

const MessageArea = () => {
  const { messages, blockedUsers } = useContext(CommunityContext);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Set animation effect when component mounts
  useEffect(() => {
    setTimeout(() => {
      setAnimateIn(true);
    }, 300);
  }, []);
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter out messages from blocked users
  const visibleMessages = messages.filter(msg => !blockedUsers.includes(msg.username));

  return (
    <div className="flex-1 relative">
      {/* Top fade effect */}
      <div className={`absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none ${theme.darkMode ? 'bg-gradient-to-b from-gray-900 to-transparent' : 'bg-gradient-to-b from-blue-50 to-transparent'}`}></div>
      
      {/* Bottom fade effect */}
      <div className={`absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none ${theme.darkMode ? 'bg-gradient-to-t from-gray-900 to-transparent' : 'bg-gradient-to-t from-blue-50 to-transparent'}`}></div>
      
      <div 
        className={`h-full p-5 overflow-y-auto ${theme.darkMode ? 'bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-sm' : 'bg-blue-50 bg-opacity-40 backdrop-filter backdrop-blur-sm'}`}
        style={{
          backgroundImage: theme.darkMode ? 
            'radial-gradient(circle at 100% 0%, rgba(75, 85, 99, 0.3) 0%, transparent 25%), radial-gradient(circle at 0% 80%, rgba(55, 65, 153, 0.2) 0%, transparent 25%)' : 
            'radial-gradient(circle at 100% 0%, rgba(96, 165, 250, 0.2) 0%, transparent 25%), radial-gradient(circle at 0% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 25%)'
        }}
      >
        <div className="max-w-4xl mx-auto space-y-4 pb-16 pt-2 transition-opacity duration-500 ease-in-out" style={{ opacity: animateIn ? '1' : '0' }}>
        {visibleMessages.length > 0 ? (
          visibleMessages.map((message, index) => (
            <div 
              key={message.id}
              className="transition-all duration-500 ease-out hover:scale-[1.01] transform"
              style={{ 
                transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
                opacity: animateIn ? 1 : 0,
                transitionDelay: `${Math.min(index * 70, 1000)}ms`
              }}
            >
              <MessageBubble
                message={message}
                isOwnMessage={message.username === user.username}
                isAdmin={user.isAdmin}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-10 transition-all duration-500 ease-out transform" style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? 'translateY(0)' : 'translateY(20px)' }}>
            <div className="p-5 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 inline-block mb-6 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className={`text-xl font-medium mb-2 ${theme.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Bienvenue dans la communauté Konexa  
            </p>
            <p className={`text-md mb-4 ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Soyez le premier à entamer la conversation !
            </p>
            <div className="inline-block animate-bounce mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      </div>
    </div>
  );
};

export default MessageArea;