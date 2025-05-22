import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MessagingContext } from '../../context/MessagingContext';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const MessageThread = () => {
  const { conversationId } = useParams();
  const { getConversation, getMessages, sendPrivateMessage, markAsRead } = useContext(MessagingContext);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Load conversation and messages
  useEffect(() => {
    const loadConversationData = async () => {
      try {
        setLoading(true);
        
        // Get conversation details
        const conversationData = await getConversation(conversationId);
        setConversation(conversationData);
        
        // Get messages
        const messagesData = await getMessages(conversationId);
        setMessages(messagesData);
        
        // Mark conversation as read
        await markAsRead(conversationId);
      } catch (err) {
        setError('Impossible de charger la conversation');
        console.error('Erreur lors du chargement de la conversation:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversationData();
  }, [conversationId, getConversation, getMessages, markAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Simulate receiving new messages (for demo purposes)
  useEffect(() => {
    // Cleanup polling interval on unmount
    let pollInterval;
    
    if (!loading && conversation) {
      pollInterval = setInterval(async () => {
        try {
          const updatedMessages = await getMessages(conversationId);
          
          // Only update if there are new messages
          if (updatedMessages.length > messages.length) {
            setMessages(updatedMessages);
          }
        } catch (err) {
          console.error('Erreur lors du rafraîchissement des messages:', err);
        }
      }, 10000); // Poll every 10 seconds
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [conversationId, loading, conversation, messages.length, getMessages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setIsTyping(true);
      
      // Send the message
      await sendPrivateMessage(conversationId, newMessage);
      
      // Clear input
      setNewMessage('');
      
      // Refresh messages
      const updatedMessages = await getMessages(conversationId);
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
    } finally {
      setIsTyping(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !conversation) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error || 'Conversation introuvable'}
      </div>
    );
  }
  
  // Find the other participant
  const otherUser = conversation.participants.find(p => p.id !== user.id);
  
  return (
    <div className={`flex flex-col h-[calc(100vh-12rem)] rounded-lg overflow-hidden ${theme.darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      {/* Conversation Header */}
      <div className={`p-4 border-b ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
          {otherUser.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <h3 className={`text-lg font-semibold ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
            {otherUser.username}
          </h3>
          <p className="text-sm text-gray-500">
            {otherUser.isOnline ? 'En ligne' : 'Hors ligne'}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className={`flex-1 p-4 overflow-y-auto ${theme.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className={`${theme.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Aucun message dans cette conversation</p>
            <p className="text-sm text-gray-500 mt-1">Envoyez votre premier message maintenant!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user.id;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwnMessage && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs mr-2">
                      {otherUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div 
                      className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                        isOwnMessage 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : theme.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className={`p-4 border-t ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
              theme.darkMode 
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                : 'bg-gray-50 text-gray-900 border border-gray-300 focus:ring-blue-600'
            }`}
            placeholder="Écrivez votre message..."
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isTyping || !newMessage.trim()}
          >
            {isTyping ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageThread;