import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const NotificationSettings = () => {
  const { notificationPreferences, updateNotificationPreferences } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Local state for form values
  const [preferences, setPreferences] = useState({
    messagingNotifications: notificationPreferences.messagingNotifications,
    communityNotifications: notificationPreferences.communityNotifications,
    pollNotifications: notificationPreferences.pollNotifications,
    emailNotifications: notificationPreferences.emailNotifications,
    soundEnabled: notificationPreferences.soundEnabled,
  });

  // Handle toggle change for any preference
  const handleToggleChange = (prefName) => {
    setPreferences(prev => ({
      ...prev,
      [prefName]: !prev[prefName]
    }));
  };

  // Save preferences
  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    try {
      updateNotificationPreferences(preferences);
      setSuccess('Préférences de notification mises à jour avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Échec de mise à jour des préférences de notification');
      console.error('Error updating notification preferences:', err);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-6">Préférences de Notification</h2>
      
      <div className={`rounded-lg shadow-sm p-6 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSavePreferences}>
          <div className="space-y-6">
            {/* Messaging Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notifications de Messages</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir des notifications pour les nouveaux messages privés
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleChange('messagingNotifications')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.messagingNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.messagingNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            {/* Community Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notifications de la Communauté</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir des notifications pour les nouvelles publications et commentaires
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleChange('communityNotifications')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.communityNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.communityNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            {/* Poll Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notifications de Sondages</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir des notifications pour les nouveaux sondages communautaires
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleChange('pollNotifications')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.pollNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.pollNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notifications par Email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir des notifications par email (résumé hebdomadaire)
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleChange('emailNotifications')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            {/* Sound Settings */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Sons de Notification</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Activer les sons pour les notifications
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleChange('soundEnabled')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.soundEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Enregistrer les Préférences
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings;