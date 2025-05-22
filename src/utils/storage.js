/**
 * Storage utility functions for Konexa community website
 * Handles local storage operations with error handling
 */

// Save data to localStorage with proper error handling
export const saveToStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

// Get data from localStorage with proper error handling
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Remove data from localStorage with proper error handling
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

// Clear all app related data from localStorage
export const clearAllAppData = () => {
  try {
    const appKeys = [
      'konexa_user',
      'konexa_users',
      'konexa_messages',
      'konexa_theme',
      'konexa_community_enabled',
      'konexa_current_poll',
      'konexa_poll_history'
    ];
    
    appKeys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};

// Check if storage is available
export const isStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};