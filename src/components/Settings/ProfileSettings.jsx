import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const ProfileSettings = () => {
  const { user, updateUsername, updatePassword } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameSuccess('');
    setUsernameError('');
    
    if (!username.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }
    
    try {
      await updateUsername(username);
      setUsernameSuccess('Username updated successfully!');
      setTimeout(() => setUsernameSuccess(''), 3000);
    } catch (error) {
      setUsernameError(error.message || 'Failed to update username');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password');
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
      <div className={`rounded-lg shadow-sm p-6 mb-8 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-medium mb-4">Update Username</h3>
        
        {usernameSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            {usernameSuccess}
          </div>
        )}
        
        {usernameError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {usernameError}
          </div>
        )}
        
        <form onSubmit={handleUsernameSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                theme.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Update Username
          </button>
        </form>
      </div>
      
      <div className={`rounded-lg shadow-sm p-6 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-medium mb-4">Change Password</h3>
        
        {passwordSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            {passwordSuccess}
          </div>
        )}
        
        {passwordError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {passwordError}
          </div>
        )}
        
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label htmlFor="current-password" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                theme.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-password" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                theme.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                theme.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;