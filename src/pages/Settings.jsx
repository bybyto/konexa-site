import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ProfileSettings from '../components/Settings/ProfileSettings';
import ThemeSettings from '../components/Settings/ThemeSettings';
import NotificationSettings from '../components/Settings/NotificationSettings';

const Settings = () => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex-1 p-6 ml-64">
      <div className={`max-w-4xl mx-auto ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? `${theme.darkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600'}`
                  : `border-transparent ${theme.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Settings
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? `${theme.darkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600'}`
                  : `border-transparent ${theme.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appearance'
                  ? `${theme.darkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600'}`
                  : `border-transparent ${theme.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'appearance' && <ThemeSettings />}
      </div>
    </div>
  );
};

export default Settings;