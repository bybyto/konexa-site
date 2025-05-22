import React, { createContext, useState, useEffect } from 'react';

// Create the Auth Context
export const AuthContext = createContext();

// Notification preferences default settings
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  messagingNotifications: true,
  communityNotifications: true,
  pollNotifications: true,
  emailNotifications: false,
  soundEnabled: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationPreferences, setNotificationPreferences] = useState(DEFAULT_NOTIFICATION_PREFERENCES);

  useEffect(() => {
    // Load user data from localStorage on component mount
    const loadUserData = () => {
      try {
        // Load current user
        const currentUser = JSON.parse(localStorage.getItem('konexa_user'));
        if (currentUser) {
          setUser(currentUser);
          
          // Load notification preferences
          const savedPreferences = JSON.parse(localStorage.getItem('konexa_notification_preferences'));
          if (savedPreferences) {
            setNotificationPreferences(savedPreferences);
          } else {
            localStorage.setItem('konexa_notification_preferences', JSON.stringify(DEFAULT_NOTIFICATION_PREFERENCES));
          }
        }

        // Load all users
        let savedUsers = JSON.parse(localStorage.getItem('konexa_users')) || [];
        
        // Create demo users if no users exist yet
        if (savedUsers.length === 0) {
          savedUsers = [
            {
              id: '1',
              username: 'admin',
              password: 'admin',
              isAdmin: true,
              isBlocked: false,
              createdAt: new Date().toISOString(),
              blockedUsers: []
            },
            {
              id: '2',
              username: 'marie',
              password: 'password',
              isAdmin: false,
              isBlocked: false,
              createdAt: new Date().toISOString(),
              blockedUsers: []
            },
            {
              id: '3',
              username: 'pierre',
              password: 'password',
              isAdmin: false,
              isBlocked: false,
              createdAt: new Date().toISOString(),
              blockedUsers: []
            },
            {
              id: '4',
              username: 'sophie',
              password: 'password',
              isAdmin: false,
              isBlocked: false,
              createdAt: new Date().toISOString(),
              blockedUsers: []
            }
          ];
          localStorage.setItem('konexa_users', JSON.stringify(savedUsers));
        }
        
        setUsers(savedUsers);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save users to localStorage whenever users state changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('konexa_users', JSON.stringify(users));
    }
  }, [users]);

  // Register a new user
  const register = async (realName, username, password) => {
    // Check if username already exists
    if (users.some(user => user.username === username)) {
      throw new Error('Username already exists');
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      realName,
      username,
      password, // In a real app, this should be hashed
      isAdmin: users.length === 0, // First user is admin
      isBlocked: false,
      createdAt: new Date().toISOString(),
      blockedUsers: []
    };

    // Update users list
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('konexa_users', JSON.stringify(updatedUsers));

    // Set current user and store in localStorage
    setUser(newUser);
    localStorage.setItem('konexa_user', JSON.stringify(newUser));

    return true;
  };

  // Login a user
  const login = async (username, password) => {
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return false;
    }

    if (user.isBlocked) {
      throw new Error('Your account has been blocked');
    }

    setUser(user);
    localStorage.setItem('konexa_user', JSON.stringify(user));
    return true;
  };

  // Logout current user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('konexa_user');
  };

  // Update username
  const updateUsername = async (newUsername) => {
    if (users.some(u => u.username !== user.username && u.username === newUsername)) {
      throw new Error('Username already taken');
    }

    // Update in users array
    const updatedUsers = users.map(u => 
      u.username === user.username ? { ...u, username: newUsername } : u
    );
    setUsers(updatedUsers);

    // Update current user
    const updatedUser = { ...user, username: newUsername };
    setUser(updatedUser);
    localStorage.setItem('konexa_user', JSON.stringify(updatedUser));

    return true;
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update in users array
    const updatedUsers = users.map(u => 
      u.username === user.username ? { ...u, password: newPassword } : u
    );
    setUsers(updatedUsers);

    // Update current user
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    localStorage.setItem('konexa_user', JSON.stringify(updatedUser));

    return true;
  };

  // Admin functions
  const updateUserRole = (username, isAdmin) => {
    if (!user.isAdmin) {
      throw new Error('Permission denied');
    }

    const updatedUsers = users.map(u => 
      u.username === username ? { ...u, isAdmin } : u
    );
    setUsers(updatedUsers);

    // If changing current user role, update user state
    if (user.username === username) {
      const updatedUser = { ...user, isAdmin };
      setUser(updatedUser);
      localStorage.setItem('konexa_user', JSON.stringify(updatedUser));
    }
  };

  const blockUser = (username, isBlocked = true) => {
    if (!user.isAdmin) {
      throw new Error('Permission denied');
    }

    const updatedUsers = users.map(u => 
      u.username === username ? { ...u, isBlocked } : u
    );
    setUsers(updatedUsers);

    // If blocking current user, log them out
    if (user.username === username && isBlocked) {
      logout();
    }
  };
  
  // Edit user information (admin function)
  const editUser = (userId, userData) => {
    if (!user.isAdmin) {
      throw new Error('Permission denied');
    }
    
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, ...userData } 
        : u
    );
    
    setUsers(updatedUsers);
    
    // If editing current user, update user state
    if (user.id === userId) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('konexa_user', JSON.stringify(updatedUser));
    }
    
    return true;
  };
  
  // Delete a user (admin function)
  const deleteUser = (userId) => {
    if (!user.isAdmin) {
      throw new Error('Permission denied');
    }
    
    // Cannot delete yourself
    if (user.id === userId) {
      throw new Error('Vous ne pouvez pas supprimer votre propre compte');
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    
    return true;
  };

  // Update notification preferences
  const updateNotificationPreferences = (preferences) => {
    const updatedPreferences = { ...notificationPreferences, ...preferences };
    setNotificationPreferences(updatedPreferences);
    localStorage.setItem('konexa_notification_preferences', JSON.stringify(updatedPreferences));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        register,
        login,
        logout,
        updateUsername,
        updatePassword,
        updateUserRole,
        blockUser,
        notificationPreferences,
        updateNotificationPreferences,
        editUser,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};