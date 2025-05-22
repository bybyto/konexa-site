import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { MessagingContext } from '../context/MessagingContext';
import ConversationList from '../components/Messaging/ConversationList';
import MessageThread from '../components/Messaging/MessageThread';
import PrivateMessage from '../components/Messaging/PrivateMessage';

const Messaging = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { conversations, fetchConversations } = useContext(MessagingContext);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const navigate = useNavigate();
  const { conversationId } = useParams();
  
  useEffect(() => {
    const loadConversations = async () => {
      try {
        await fetchConversations();
      } catch (err) {
        console.error('Erreur lors du chargement des conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
  }, [fetchConversations]);
  
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.id === conversationId);
      setSelectedConversation(conversation || null);
    } else {
      setSelectedConversation(null);
    }
  }, [conversationId, conversations]);
  
  // For narrow screens, we'll only show either the list or the thread
  const isViewingThread = Boolean(conversationId);
  
  const handleBackToList = () => {
    navigate('/messaging');
  };
  
  const handleNewMessage = () => {
    setShowNewMessageForm(true);
  };
  
  const handleCloseNewMessage = () => {
    setShowNewMessageForm(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/" className="text-blue-600 hover:text-blue-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
          <h1 className={`text-2xl font-bold ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
            Messagerie
          </h1>
        </div>
        <button
          onClick={handleNewMessage}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau message
        </button>
      </div>
      
      {showNewMessageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <PrivateMessage onClose={handleCloseNewMessage} />
          </div>
        </div>
      )}
      
      <div className={`grid gap-6 ${isViewingThread ? 'md:grid-cols-[300px_1fr]' : 'grid-cols-1'}`}>
        {/* For mobile: Show back button when viewing a thread */}
        {isViewingThread && (
          <button
            onClick={handleBackToList}
            className="md:hidden flex items-center text-blue-600 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux conversations
          </button>
        )}
        
        {/* Conversations List - Hidden on mobile when viewing a thread */}
        <div className={`${isViewingThread ? 'hidden md:block' : ''}`}>
          <ConversationList />
        </div>
        
        {/* Message Thread or Empty State */}
        <div className={`${!isViewingThread ? 'hidden md:block' : ''}`}>
          {conversationId ? (
            <MessageThread />
          ) : (
            <div className={`h-full flex flex-col items-center justify-center p-10 rounded-lg ${theme.darkMode ? 'bg-gray-800' : 'bg-white'} shadow text-center`}>
              <div className="w-20 h-20 mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
                Votre messagerie
              </h3>
              <p className={`text-gray-500 max-w-md`}>
                Sélectionnez une conversation dans la liste ou commencez une nouvelle discussion en cliquant sur "Nouveau message".
              </p>
              <button
                onClick={handleNewMessage}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Commencer une nouvelle conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;