import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

// Create the Poll Context
export const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollHistory, setPollHistory] = useState([]);
  
  // Load poll data from localStorage when component mounts
  useEffect(() => {
    const loadPollData = () => {
      try {
        // Load current poll
        const savedPoll = JSON.parse(localStorage.getItem('konexa_current_poll'));
        if (savedPoll) {
          setCurrentPoll(savedPoll);
        }
        
        // Load poll history
        const savedHistory = JSON.parse(localStorage.getItem('konexa_poll_history')) || [];
        setPollHistory(savedHistory);
      } catch (error) {
        console.error('Error loading poll data:', error);
      }
    };
    
    loadPollData();
  }, []);
  
  // Check if current user has voted in the current poll
  useEffect(() => {
    if (user && currentPoll) {
      const hasUserVoted = currentPoll.items.some(item => 
        item.votes.includes(user.username)
      );
      setHasVoted(hasUserVoted);
    } else {
      setHasVoted(false);
    }
  }, [user, currentPoll]);
  
  // Auto-reset poll each week
  useEffect(() => {
    const checkPollExpiration = () => {
      if (currentPoll) {
        const endDate = new Date(currentPoll.endDate);
        const now = new Date();
        
        if (now > endDate) {
          // Archive current poll to history
          const pollWithResults = { ...currentPoll, ended: true, endedAt: new Date().toISOString() };
          setPollHistory(prev => [pollWithResults, ...prev]);
          
          // Reset current poll
          setCurrentPoll(null);
          localStorage.removeItem('konexa_current_poll');
          
          // Save updated history
          localStorage.setItem('konexa_poll_history', JSON.stringify([pollWithResults, ...pollHistory]));
        }
      }
    };
    
    // Check once on load
    checkPollExpiration();
    
    // Check every hour
    const intervalId = setInterval(checkPollExpiration, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [currentPoll, pollHistory]);
  
  // Calculate next poll date
  const getNextPollDate = () => {
    if (!currentPoll) return new Date();
    
    return new Date(currentPoll.endDate);
  };
  
  // Vote in the current poll
  const vote = (itemId) => {
    if (!user || !currentPoll || hasVoted) return;
    
    // Update the item with the user's vote
    const updatedItems = currentPoll.items.map(item => ({
      ...item,
      votes: item.id === itemId ? [...item.votes, user.username] : item.votes
    }));
    
    const updatedPoll = { ...currentPoll, items: updatedItems };
    setCurrentPoll(updatedPoll);
    setHasVoted(true);
    
    // Save to localStorage
    localStorage.setItem('konexa_current_poll', JSON.stringify(updatedPoll));
  };
  
  // Create a new poll (admin function)
  const createPoll = (pollData) => {
    if (!user?.isAdmin) return;
    
    // If there's a current poll, archive it
    if (currentPoll) {
      const pollWithResults = { ...currentPoll, ended: true, endedAt: new Date().toISOString() };
      setPollHistory(prev => [pollWithResults, ...prev]);
      localStorage.setItem('konexa_poll_history', JSON.stringify([pollWithResults, ...pollHistory]));
    }
    
    // Format the poll items to include empty votes array
    const formattedItems = pollData.items.map(item => ({
      ...item,
      votes: []
    }));
    
    // Create new poll with formatted items
    const newPoll = {
      ...pollData,
      items: formattedItems,
      createdAt: new Date().toISOString(),
      createdBy: user.username
    };
    
    setCurrentPoll(newPoll);
    localStorage.setItem('konexa_current_poll', JSON.stringify(newPoll));
  };
  
  // Reset current poll (admin function)
  const resetCurrentPoll = () => {
    if (!user?.isAdmin || !currentPoll) return;
    
    // Archive current poll to history
    const pollWithResults = { ...currentPoll, ended: true, endedAt: new Date().toISOString() };
    setPollHistory(prev => [pollWithResults, ...prev]);
    
    // Reset current poll
    setCurrentPoll(null);
    localStorage.removeItem('konexa_current_poll');
    
    // Save updated history
    localStorage.setItem('konexa_poll_history', JSON.stringify([pollWithResults, ...pollHistory]));
  };
  
  return (
    <PollContext.Provider
      value={{
        currentPoll,
        hasVoted,
        pollHistory,
        vote,
        createPoll,
        resetCurrentPoll,
        getNextPollDate
      }}
    >
      {children}
    </PollContext.Provider>
  );
};