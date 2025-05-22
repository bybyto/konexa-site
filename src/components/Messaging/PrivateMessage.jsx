import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { MessagingContext } from '../../context/MessagingContext';
import { ThemeContext } from '../../context/ThemeContext';

const PrivateMessage = ({ recipientId, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { sendPrivateMessage, checkConversationExists } = useContext(MessagingContext);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setErrorMessage('Le message ne peut pas être vide');
      return;
    }
    
    try {
      // Check if a conversation already exists or create a new one
      const conversationId = await checkConversationExists(recipientId);
      
      // Send the message
      await sendPrivateMessage(conversationId, message);
      
      // Clear the input and any error messages
      setMessage('');
      setErrorMessage('');
      
      // Navigate to the conversation thread
      navigate(`/messaging/${conversationId}`);
      
      // Close the modal if onClose function is provided
      if (onClose) onClose();
    } catch (error) {
      setErrorMessage('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      console.error("Erreur d'envoi de message:", error);
    }
  };

  return (
    <div className={`p-6 rounded-lg ${theme.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Nouveau message</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSendMessage}>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2 text-sm font-medium">
            Votre message
          </label>
          <textarea
            id="message"
            rows="4"
            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none ${
              theme.darkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                : 'bg-gray-50 text-gray-900 border border-gray-300 focus:ring-blue-600'
            }`}
            placeholder="Écrivez votre message ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrivateMessage;