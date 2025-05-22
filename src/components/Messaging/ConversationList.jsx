import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessagingContext } from '../../context/MessagingContext';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const ConversationList = () => {
  const { conversations, fetchConversations, markAsRead, searchConversations } = useContext(MessagingContext);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        await fetchConversations();
      } catch (err) {
        setError('Impossible de charger les conversations');
        console.error('Erreur lors du chargement des conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [fetchConversations]);

  const handleConversationClick = async (conversation) => {
    try {
      // Mark conversation as read when clicked
      if (conversation.unreadCount > 0) {
        await markAsRead(conversation.id);
      }
      navigate(`/messaging/${conversation.id}`);
    } catch (err) {
      console.error('Erreur lors de la navigation vers la conversation:', err);
    }
  };

  // Use memo to filter the conversations based on search term
  const filteredConversations = useMemo(() => {
    return searchConversations(searchTerm);
  }, [searchConversations, searchTerm, conversations]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}. <button className="underline" onClick={() => fetchConversations()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className={`rounded-lg ${theme.darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <div className="mt-2">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 ${theme.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'} placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Rechercher dans les conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredConversations.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          {searchTerm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Aucune conversation ne correspond à votre recherche.</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-3 text-blue-600 hover:underline"
              >
                Effacer la recherche
              </button>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p>Vous n'avez pas encore de conversations.</p>
              <p className="mt-2">Commencez à discuter avec d'autres membres de la communauté!</p>
            </>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredConversations.map((conversation) => {
            // Determine if this user is the recipient or sender
            const otherUser = conversation.participants.find(p => p.id !== user.id);
            
            return (
              <li 
                key={conversation.id} 
                onClick={() => handleConversationClick(conversation)}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  conversation.unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                    {otherUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {otherUser.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(conversation.lastMessageDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className="text-sm truncate text-gray-500 dark:text-gray-400">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-3 inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link to="/community" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle conversation
        </Link>
      </div>
    </div>
  );
};

export default ConversationList;