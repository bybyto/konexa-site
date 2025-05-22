import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { AssistantContext } from '../../context/AssistantContext';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const AssistantBot = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, isOpen, toggleAssistant, isTyping, clearConversation, assistantTheme } = useContext(AssistantContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input, 'user');
      setInput('');
    }
  };
  
  // Get gradient style for themed elements
  const getGradientStyle = () => {
    return {
      background: `linear-gradient(to right, ${assistantTheme.primaryColor}, ${assistantTheme.accentColor})`
    };
  };
  
  // Get avatar style based on theme settings
  const getAvatarStyle = () => {
    switch(assistantTheme.avatarStyle) {
      case 'solid':
        return { backgroundColor: assistantTheme.primaryColor };
      case 'outline':
        return { 
          backgroundColor: theme.darkMode ? '#1f2937' : 'white',
          border: `2px solid ${assistantTheme.primaryColor}` 
        };
      case 'gradient':
      default:
        return getGradientStyle();
    }
  };
  
  // Get bubble style classes based on selected style
  const getBubbleClasses = () => {
    switch(assistantTheme.bubbleStyle) {
      case 'modern':
        return 'rounded-lg shadow-md';
      case 'classic':
        return 'rounded-md border';
      default: // 'rounded'
        return 'rounded-2xl';
    }
  };
  
  // Get font style classes based on selected style
  const getFontClasses = () => {
    switch(assistantTheme.fontStyle) {
      case 'playful':
        return 'font-comic text-lg';
      case 'formal':
        return 'font-serif text-base';
      default: // 'default'
        return 'font-sans text-base';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleAssistant}
        style={getGradientStyle()}
        className="fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
        aria-label="Ouvrir l'assistant"
      >
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-lg shadow-xl overflow-hidden flex flex-col ${theme.darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 animate-slideUp`}>
      <style jsx>{`
        .tooltip-container {
          position: relative;
        }
        .tooltip-text {
          visibility: hidden;
          position: absolute;
          z-index: 100;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          border-radius: 6px;
          padding: 5px 10px;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
      {/* Assistant Header */}
      <div className="p-4 flex items-center justify-between" style={getGradientStyle()}>
        <div className="flex items-center space-x-3">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              assistantTheme.avatarStyle === 'outline' ? 'border-2 border-white' : 'bg-white'
            }`}
            style={assistantTheme.avatarStyle !== 'outline' ? {} : {backgroundColor: 'rgba(255,255,255,0.9)'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
                 className="h-5 w-5" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke={assistantTheme.primaryColor}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <h3 className="font-medium text-white">Bybyto</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={clearConversation}
            className="text-white opacity-80 hover:opacity-100 transition tooltip-container"
            aria-label="Effacer la conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="tooltip-text">Effacer la conversation</span>
          </button>
          <button 
            onClick={toggleAssistant}
            className="text-white opacity-80 hover:opacity-100 transition"
            aria-label="Fermer l'assistant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className={`flex-1 p-4 overflow-y-auto max-h-96 ${theme.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 ${msg.sender === 'assistant' ? 'flex' : 'flex justify-end'}`}
          >
            {msg.sender === 'assistant' && (
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                  assistantTheme.avatarStyle === 'outline' ? 'border-2' : ''
                }`}
                style={getAvatarStyle()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={assistantTheme.avatarStyle === 'outline' ? assistantTheme.primaryColor : 'white'}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
            )}
            
            <div 
              className={`px-4 py-3 ${getBubbleClasses()} max-w-[80%] ${
                msg.sender === 'assistant' 
                  ? theme.darkMode ? 'bg-gray-700' : 'bg-gray-100' 
                  : 'text-white'
              }`}
              style={msg.sender !== 'assistant' ? getGradientStyle() : {}}
            >
              <p className={`whitespace-pre-wrap ${getFontClasses()}`}>{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex mb-4">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                assistantTheme.avatarStyle === 'outline' ? 'border-2' : ''
              }`}
              style={getAvatarStyle()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={assistantTheme.avatarStyle === 'outline' ? assistantTheme.primaryColor : 'white'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div className={`px-4 py-3 ${getBubbleClasses()} ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{animationDelay: '0ms', backgroundColor: assistantTheme.primaryColor}}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{animationDelay: '100ms', backgroundColor: assistantTheme.primaryColor}}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{animationDelay: '200ms', backgroundColor: assistantTheme.primaryColor}}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className={`border-t ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 ${
              theme.darkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
            style={{borderColor: assistantTheme.primaryColor}}
            placeholder="Écrivez votre message..."
          />
          <button
            type="submit"
            className="text-white px-4 rounded-r-lg hover:opacity-90 transition"
            style={getGradientStyle()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssistantBot;