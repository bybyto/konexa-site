import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

// Create the Community Context
export const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [communityEnabled, setCommunityEnabled] = useState(true);
  
  // Load messages from localStorage when component mounts
  useEffect(() => {
    const loadMessages = () => {
      try {
        const savedMessages = JSON.parse(localStorage.getItem('konexa_messages')) || [];
        setMessages(savedMessages);

        // Get community status
        const enabled = localStorage.getItem('konexa_community_enabled');
        if (enabled !== null) {
          setCommunityEnabled(JSON.parse(enabled));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    
    loadMessages();
  }, []);
  
  // Update blocked users whenever the user changes
  useEffect(() => {
    if (user) {
      setBlockedUsers(user.blockedUsers || []);
    } else {
      setBlockedUsers([]);
    }
  }, [user]);
  
  // Save messages whenever they change
  useEffect(() => {
    localStorage.setItem('konexa_messages', JSON.stringify(messages));
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Process message text to find tagged users
  const processMessageTags = (text) => {
    if (!text) return { text, taggedUsers: [] };
    
    // Find all @username patterns
    const tagRegex = /@(\w+)\b/g;
    const taggedUsers = [];
    let match;
    
    // Extract all tagged usernames
    while ((match = tagRegex.exec(text)) !== null) {
      const username = match[1];
      if (!taggedUsers.includes(username)) {
        taggedUsers.push(username);
      }
    }
    
    return { text, taggedUsers };
  };
  
  // Send a new message
  const sendMessage = (text, attachment = null) => {
    if (!user) return;
    if (!communityEnabled) return;
    
    // Process tags in the message
    const { text: processedText, taggedUsers } = processMessageTags(text);
    
    let media = null;
    let mediaType = null;
    
    // Process attachment if exists
    if (attachment) {
      const reader = new FileReader();
      reader.onload = () => {
        media = reader.result;
        mediaType = attachment.type.startsWith('image/') ? 'image' : 'video';
        
        const newMessage = {
          id: generateId(),
          username: user.username,
          text: processedText,
          media,
          mediaType,
          timestamp: new Date().toISOString(),
          taggedUsers: taggedUsers
        };
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Could implement notification system for tagged users here
      };
      reader.readAsDataURL(attachment);
    } else {
      // Text-only message
      const newMessage = {
        id: generateId(),
        username: user.username,
        text: processedText,
        media: null,
        mediaType: null,
        timestamp: new Date().toISOString(),
        taggedUsers: taggedUsers
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Could implement notification system for tagged users here
    }
  };
  
  // Delete a message
  const deleteMessage = (messageId) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
  };
  
  // Block a user
  const blockUser = (username) => {
    if (!user || user.username === username) return;
    
    // Update current user's blocked list
    const updatedBlockedUsers = [...blockedUsers, username];
    setBlockedUsers(updatedBlockedUsers);
    
    // Update in localStorage by getting all users and updating the current one
    const users = JSON.parse(localStorage.getItem('konexa_users')) || [];
    const updatedUsers = users.map(u => 
      u.username === user.username 
        ? { ...u, blockedUsers: updatedBlockedUsers } 
        : u
    );
    localStorage.setItem('konexa_users', JSON.stringify(updatedUsers));
    
    // Update current user in localStorage
    const currentUser = { ...user, blockedUsers: updatedBlockedUsers };
    localStorage.setItem('konexa_user', JSON.stringify(currentUser));
  };
  
  // Unblock a user
  const unblockUser = (username) => {
    const updatedBlockedUsers = blockedUsers.filter(name => name !== username);
    setBlockedUsers(updatedBlockedUsers);
    
    // Update in localStorage (users and current user)
    const users = JSON.parse(localStorage.getItem('konexa_users')) || [];
    const updatedUsers = users.map(u => 
      u.username === user.username 
        ? { ...u, blockedUsers: updatedBlockedUsers } 
        : u
    );
    localStorage.setItem('konexa_users', JSON.stringify(updatedUsers));
    
    const currentUser = { ...user, blockedUsers: updatedBlockedUsers };
    localStorage.setItem('konexa_user', JSON.stringify(currentUser));
  };
  
  // Admin functions
  const toggleCommunityStatus = () => {
    const newStatus = !communityEnabled;
    setCommunityEnabled(newStatus);
    localStorage.setItem('konexa_community_enabled', JSON.stringify(newStatus));
  };
  
  const clearAllMessages = () => {
    setMessages([]);
    localStorage.removeItem('konexa_messages');
  };
  
  return (
    <CommunityContext.Provider
      value={{
        messages,
        blockedUsers,
        communityEnabled,
        sendMessage,
        deleteMessage,
        blockUser,
        unblockUser,
        toggleCommunityStatus,
        clearAllMessages
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};