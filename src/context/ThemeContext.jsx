import React, { createContext, useState, useEffect } from 'react';

// Create the Theme Context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    darkMode: false,
    backgroundColor: '#f0f4f8', // Default light blue background
    backgroundImage: null
  });

  useEffect(() => {
    // Load theme preferences from localStorage on component mount
    const loadThemeData = () => {
      try {
        const savedTheme = JSON.parse(localStorage.getItem('konexa_theme'));
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme data:', error);
      }
    };

    loadThemeData();
  }, []);

  // Update theme
  const updateTheme = (newThemeData) => {
    const updatedTheme = { ...theme, ...newThemeData };
    setTheme(updatedTheme);
    localStorage.setItem('konexa_theme', JSON.stringify(updatedTheme));
  };

  // Apply theme to root element
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark mode
    if (theme.darkMode) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '';
    }

    // Set font family
    document.body.style.fontFamily = 'Raleway, sans-serif';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};