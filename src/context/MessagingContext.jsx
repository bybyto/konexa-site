import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

// Create the Messaging Context
export const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Check for unread messages when conversations change
  useEffect(() => {
    const unread = conversations.some(conv => conv.unreadCount > 0);
    setHasUnreadMessages(unread);
  }, [conversations]);
  
  // Load conversations from localStorage
  useEffect(() => {
    if (user) {
      const savedConversations = JSON.parse(localStorage.getItem(`konexa_conversations_${user.id}`)) || [];
      setConversations(savedConversations);
    }
  }, [user]);
  
  // Save conversations to localStorage
  const saveConversations = (updatedConversations) => {
    if (user) {
      localStorage.setItem(`konexa_conversations_${user.id}`, JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    }
  };
  
  // Fetch all conversations for the current user
  const fetchConversations = async () => {
    if (!user) return [];
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to fetch conversations
      // For now, we'll use mock data from localStorage
      const savedConversations = JSON.parse(localStorage.getItem(`konexa_conversations_${user.id}`)) || [];
      
      // Sort conversations by most recent message
      const sortedConversations = savedConversations.sort((a, b) => {
        return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
      });
      
      setConversations(sortedConversations);
      return sortedConversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single conversation by ID
  const getConversation = async (conversationId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      return conversation;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  };
  
  // Get messages for a conversation
  const getMessages = async (conversationId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // In a real app, this would be an API call to fetch messages
      // For now, we'll use mock data from localStorage
      return conversation.messages || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  };
  
  // Check if a conversation exists with a user, or create a new one
  const checkConversationExists = async (recipientId) => {
    if (!user) throw new Error('User not authenticated');
    if (user.id === recipientId) throw new Error('Vous ne pouvez pas discuter avec vous-même');
    
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(c => {
        return c.participants.some(p => p.id === recipientId);
      });
      
      if (existingConversation) {
        return existingConversation.id;
      }
      
      // Create a new conversation
      const newConversation = {
        id: `conv_${Date.now()}`,
        participants: [
          { id: user.id, username: user.username },
          { id: recipientId, username: `User${recipientId}` } // In a real app, fetch the recipient's data
        ],
        messages: [],
        lastMessage: '',
        lastMessageDate: new Date().toISOString(),
        unreadCount: 0
      };
      
      const updatedConversations = [...conversations, newConversation];
      saveConversations(updatedConversations);
      
      return newConversation.id;
    } catch (error) {
      console.error('Error checking conversation existence:', error);
      throw error;
    }
  };
  
  // Send a private message
  const sendPrivateMessage = async (conversationId, messageContent) => {
    if (!user) throw new Error('User not authenticated');
    if (!messageContent.trim()) throw new Error('Message cannot be empty');
    
    try {
      // Find the conversation
      const conversationIndex = conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex === -1) {
        throw new Error('Conversation not found');
      }
      
      // Create a new message
      const newMessage = {
        id: `msg_${Date.now()}`,
        content: messageContent,
        senderId: user.id,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Update the conversation
      const updatedConversation = {
        ...conversations[conversationIndex],
        messages: [...(conversations[conversationIndex].messages || []), newMessage],
        lastMessage: messageContent,
        lastMessageDate: new Date().toISOString()
      };
      
      // Update conversations array
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = updatedConversation;
      
      saveConversations(updatedConversations);
      
      // In a real app, send the message to an API
      return newMessage;
    } catch (error) {
      console.error('Error sending private message:', error);
      throw error;
    }
  };
  
  // Mark a conversation as read
  const markAsRead = async (conversationId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const conversationIndex = conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex === -1) {
        throw new Error('Conversation not found');
      }
      
      // Mark all messages as read
      const updatedMessages = conversations[conversationIndex].messages.map(msg => {
        if (msg.senderId !== user.id && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
      
      // Update the conversation
      const updatedConversation = {
        ...conversations[conversationIndex],
        messages: updatedMessages,
        unreadCount: 0
      };
      
      // Update conversations array
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = updatedConversation;
      
      saveConversations(updatedConversations);
      
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  };
  
  // Simulate receiving a message (for demo purposes)
  const receiveMessage = async (senderId, conversationId, messageContent) => {
    try {
      let targetConversationId = conversationId;
      
      // If no conversationId is provided, check if a conversation exists with the sender
      if (!targetConversationId) {
        const existingConversation = conversations.find(c => {
          return c.participants.some(p => p.id === senderId);
        });
        
        if (existingConversation) {
          targetConversationId = existingConversation.id;
        } else {
          // Create a new conversation
          targetConversationId = await checkConversationExists(senderId);
        }
      }
      
      const conversationIndex = conversations.findIndex(c => c.id === targetConversationId);
      
      if (conversationIndex === -1) {
        throw new Error('Conversation not found');
      }
      
      // Create a new message
      const newMessage = {
        id: `msg_${Date.now()}`,
        content: messageContent,
        senderId: senderId,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Update the conversation
      const updatedConversation = {
        ...conversations[conversationIndex],
        messages: [...(conversations[conversationIndex].messages || []), newMessage],
        lastMessage: messageContent,
        lastMessageDate: new Date().toISOString(),
        unreadCount: conversations[conversationIndex].unreadCount + 1
      };
      
      // Update conversations array
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = updatedConversation;
      
      saveConversations(updatedConversations);
      
      return newMessage;
    } catch (error) {
      console.error('Error receiving message:', error);
      throw error;
    }
  };
  
  // Delete a conversation
  const deleteConversation = async (conversationId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const updatedConversations = conversations.filter(c => c.id !== conversationId);
      saveConversations(updatedConversations);
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  };

  // Search conversations by username or message content
  const searchConversations = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return conversations;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return conversations.filter(conversation => {
      // Search in participant usernames
      const usernameMatch = conversation.participants.some(participant => 
        participant.username.toLowerCase().includes(normalizedSearchTerm)
      );
      
      // Search in messages content
      const messageMatch = conversation.messages?.some(message => 
        message.content.toLowerCase().includes(normalizedSearchTerm)
      );
      
      // Search in last message
      const lastMessageMatch = conversation.lastMessage?.toLowerCase().includes(normalizedSearchTerm);
      
      return usernameMatch || messageMatch || lastMessageMatch;
    });
  };
  
  return (
    <MessagingContext.Provider value={{
        conversations,
        hasUnreadMessages,
        loading,
        fetchConversations,
        getConversation,
        getMessages,
        checkConversationExists,
        sendPrivateMessage,
        markAsRead,
        receiveMessage,
        deleteConversation,
        searchConversations
      }}>
      {children}
    </MessagingContext.Provider>
  );
};