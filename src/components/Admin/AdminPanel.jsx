import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { CommunityContext } from '../../context/CommunityContext';
import { PollContext } from '../../context/PollContext';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminPanel = () => {
  const { users, updateUserRole, blockUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { toggleCommunityStatus, communityEnabled, clearAllMessages } = useContext(CommunityContext);
  const { createPoll, resetCurrentPoll } = useContext(PollContext);

  const [selectedTab, setSelectedTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollDescription, setNewPollDescription] = useState('');
  const [pollItems, setPollItems] = useState([
    { id: 1, title: '', author: '', description: '', imageUrl: '' },
    { id: 2, title: '', author: '', description: '', imageUrl: '' }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsView, setUserDetailsView] = useState(false);
  const [editUserMode, setEditUserMode] = useState(false);
  const [editUserData, setEditUserData] = useState({
    username: '',
    realName: '',
    password: '',
    isAdmin: false
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.realName?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleToggleAdmin = (username, isAdmin) => {
    if (window.confirm(`Êtes-vous sûr de vouloir ${isAdmin ? 'supprimer les droits d\'administrateur de' : 'nommer administrateur'} ${username}?`)) {
      updateUserRole(username, !isAdmin);
      showSuccess(`L'utilisateur ${username} ${isAdmin ? 'n\'est plus administrateur' : 'est maintenant administrateur'}`);
    }
  };

  const handleToggleBlock = (username, isBlocked) => {
    if (window.confirm(`Êtes-vous sûr de vouloir ${isBlocked ? 'débloquer' : 'bloquer'} ${username}?`)) {
      blockUser(username, !isBlocked);
      showSuccess(`L'utilisateur ${username} a été ${isBlocked ? 'débloqué' : 'bloqué'}`);
    }
  };
  
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsView(true);
    setEditUserMode(false);
  };
  
  const handleEditUser = () => {
    setEditUserMode(true);
    setEditUserData({
      username: selectedUser.username,
      realName: selectedUser.realName || '',
      password: '', // We don't pre-fill the password for security reasons
      isAdmin: selectedUser.isAdmin
    });
  };
  
  const { editUser, deleteUser } = useContext(AuthContext);

  const handleSaveUserEdit = () => {
    try {
      const updatedData = {
        ...editUserData,
        // Only include password if it was changed
        ...(editUserData.password ? { password: editUserData.password } : {})
      };
      
      editUser(selectedUser.id, updatedData);
      showSuccess(`Les informations de l'utilisateur ${editUserData.username} ont été mises à jour`);
      
      // Update the selected user with new data
      setSelectedUser({...selectedUser, ...updatedData});
      setEditUserMode(false);
    } catch (error) {
      showError(`Échec de la mise à jour: ${error.message}`);
    }
  };
  
  const handleDeleteUser = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${selectedUser.username}? Cette action est irréversible.`)) {
      try {
        deleteUser(selectedUser.id);
        showSuccess(`L'utilisateur ${selectedUser.username} a été supprimé`);
        setSelectedUser(null);
        setUserDetailsView(false);
      } catch (error) {
        showError(`Échec de la suppression: ${error.message}`);
      }
    }
  };
  
  const handleBackToList = () => {
    setSelectedUser(null);
    setUserDetailsView(false);
    setEditUserMode(false);
  };

  const handleToggleCommunity = () => {
    if (window.confirm(`Are you sure you want to ${communityEnabled ? 'disable' : 'enable'} the community section?`)) {
      toggleCommunityStatus();
      showSuccess(`Community section has been ${communityEnabled ? 'disabled' : 'enabled'}`);
    }
  };

  const handleClearMessages = () => {
    if (window.confirm('Are you sure you want to delete ALL messages? This cannot be undone!')) {
      clearAllMessages();
      showSuccess('All messages have been deleted');
    }
  };

  const handleResetPoll = () => {
    if (window.confirm('Are you sure you want to end the current poll and reset results?')) {
      resetCurrentPoll();
      showSuccess('Poll has been reset');
    }
  };

  const handleAddPollItem = () => {
    setPollItems([
      ...pollItems,
      { id: Date.now(), title: '', author: '', description: '', imageUrl: '' }
    ]);
  };

  const handleRemovePollItem = (id) => {
    if (pollItems.length <= 2) {
      showError('A poll must have at least 2 options');
      return;
    }
    setPollItems(pollItems.filter(item => item.id !== id));
  };

  const handlePollItemChange = (id, field, value) => {
    setPollItems(
      pollItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCreatePoll = () => {
    if (!newPollTitle) {
      showError('Poll title is required');
      return;
    }

    const invalidItems = pollItems.filter(item => !item.title || !item.author);
    if (invalidItems.length > 0) {
      showError('All poll items must have a title and author');
      return;
    }

    try {
      createPoll({
        title: newPollTitle,
        description: newPollDescription,
        items: pollItems,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // One week from now
      });
      
      // Reset form
      setNewPollTitle('');
      setNewPollDescription('');
      setPollItems([
        { id: 1, title: '', author: '', description: '', imageUrl: '' },
        { id: 2, title: '', author: '', description: '', imageUrl: '' }
      ]);
      
      showSuccess('New poll created successfully!');
    } catch (error) {
      showError('Failed to create poll: ' + error.message);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 5000);
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <h2 className="text-3xl font-bold mb-6">Panneau d'Administration</h2>
      
      {/* Alert Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'users'
                ? `${theme.darkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600'}`
                : `border-transparent ${theme.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setSelectedTab('users')}
          >
            Gestion des Utilisateurs
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'community'
                ? `${theme.darkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600'}`
                : `border-transparent ${theme.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setSelectedTab('community')}
          >
            Gestion de la Communauté
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'polls'
                ? `${theme.darkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600'}`
                : `border-transparent ${theme.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setSelectedTab('polls')}
          >
            Gestion des Sondages
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* User Management Tab */}
        {selectedTab === 'users' && (
          <div>
            {!userDetailsView ? (
              /* User List View */
              <>
                <div className="mb-6">
                  <label htmlFor="search" className="sr-only">Recherche</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      type="search"
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 ${
                        theme.darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Rechercher des utilisateurs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredUsers.length > 0 ? (
                  <div className={`overflow-x-auto rounded-lg shadow ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className={theme.darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Nom d'utilisateur
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Nom réel
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Rôle
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Statut
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme.darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {filteredUsers.map((user) => (
                          <tr key={user.id || user.username} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">
                                {user.username}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">
                                {user.realName || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isAdmin
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.isAdmin ? 'Admin' : 'Utilisateur'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isBlocked
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.isBlocked ? 'Bloqué' : 'Actif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex">
                              <button
                                onClick={() => handleViewUserDetails(user)}
                                className="mr-3 text-indigo-600 hover:text-indigo-900 flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Détails
                              </button>
                              <button
                                onClick={() => handleToggleAdmin(user.username, user.isAdmin)}
                                className={`mr-3 ${
                                  user.isAdmin
                                    ? 'text-red-600 hover:text-red-900'
                                    : 'text-blue-600 hover:text-blue-900'
                                } flex items-center`}
                              >
                                {user.isAdmin ? (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    Retirer Admin
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Faire Admin
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleToggleBlock(user.username, user.isBlocked)}
                                className={`${
                                  user.isBlocked
                                    ? 'text-green-600 hover:text-green-900'
                                    : 'text-red-600 hover:text-red-900'
                                } flex items-center`}
                              >
                                {user.isBlocked ? (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                    Débloquer
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Bloquer
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">Aucun utilisateur trouvé</h3>
                  </div>
                )}
              </>
            ) : (
              /* User Detail View */
              <div className={`rounded-lg shadow p-6 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <button 
                      onClick={handleBackToList}
                      className="mr-4 text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Retour
                    </button>
                    <h3 className="text-xl font-medium">
                      {editUserMode ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'}
                    </h3>
                  </div>
                  
                  {!editUserMode && (
                    <div>
                      <button 
                        onClick={handleEditUser}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-3"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={handleDeleteUser}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
                
                {editUserMode ? (
                  /* Edit User Form */
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-username" className="block text-sm font-medium mb-1">
                        Nom d'utilisateur
                      </label>
                      <input
                        id="edit-username"
                        type="text"
                        value={editUserData.username}
                        onChange={(e) => setEditUserData({...editUserData, username: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          theme.darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-800'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-realname" className="block text-sm font-medium mb-1">
                        Nom réel
                      </label>
                      <input
                        id="edit-realname"
                        type="text"
                        value={editUserData.realName}
                        onChange={(e) => setEditUserData({...editUserData, realName: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          theme.darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-800'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-password" className="block text-sm font-medium mb-1">
                        Nouveau mot de passe (laisser vide pour ne pas changer)
                      </label>
                      <input
                        id="edit-password"
                        type="password"
                        value={editUserData.password}
                        onChange={(e) => setEditUserData({...editUserData, password: e.target.value})}
                        className={`w-full p-3 rounded-lg border ${
                          theme.darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-800'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="edit-is-admin"
                        type="checkbox"
                        checked={editUserData.isAdmin}
                        onChange={(e) => setEditUserData({...editUserData, isAdmin: e.target.checked})}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="edit-is-admin" className="ml-2 block text-sm">
                        Administrateur
                      </label>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={() => setEditUserMode(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mr-3"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={handleSaveUserEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  /* User Details View */
                  <div className="space-y-6">
                    <div className={`p-5 rounded-lg ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className="text-lg font-medium mb-4">Informations de base</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                          <p className="font-medium">{selectedUser?.username}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Nom réel</p>
                          <p className="font-medium">{selectedUser?.realName || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rôle</p>
                          <p>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              selectedUser?.isAdmin
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedUser?.isAdmin ? 'Administrateur' : 'Utilisateur standard'}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Statut</p>
                          <p>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              selectedUser?.isBlocked
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {selectedUser?.isBlocked ? 'Bloqué' : 'Actif'}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date d'inscription</p>
                          <p className="font-medium">
                            {selectedUser?.createdAt 
                              ? new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) 
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-5 rounded-lg ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className="text-lg font-medium mb-4">Activité</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Dernière connexion</p>
                          <p className="font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Utilisateurs bloqués</p>
                          <p className="font-medium">{selectedUser?.blockedUsers?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex mt-6 justify-between">
                      <button
                        onClick={() => handleToggleBlock(selectedUser.username, selectedUser.isBlocked)}
                        className={`px-4 py-2 rounded-lg ${selectedUser?.isBlocked 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                      >
                        {selectedUser?.isBlocked ? 'Débloquer l\'utilisateur' : 'Bloquer l\'utilisateur'}
                      </button>
                      
                      <button
                        onClick={() => handleToggleAdmin(selectedUser.username, selectedUser.isAdmin)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedUser?.isAdmin 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                      >
                        {selectedUser?.isAdmin 
                          ? 'Retirer les droits d\'administrateur' 
                          : 'Accorder les droits d\'administrateur'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Community Management Tab */}
        {selectedTab === 'community' && (
          <div className={`p-6 rounded-lg shadow-sm ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Statut de la Communauté</h3>
              <div className="flex items-center justify-between mb-4">
                <span>La section communauté est actuellement {communityEnabled ? 'activée' : 'désactivée'}</span>
                <button
                  onClick={handleToggleCommunity}
                  className={`px-4 py-2 rounded-lg text-white ${
                    communityEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } transition-colors`}
                >
                  {communityEnabled ? 'Désactiver la Communauté' : 'Activer la Communauté'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {communityEnabled 
                  ? 'Les utilisateurs peuvent actuellement envoyer et recevoir des messages dans la section communautaire.'
                  : 'La section communautaire est actuellement désactivée. Les utilisateurs ne peuvent pas envoyer ou voir de messages.'}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Gestion des Messages</h3>
              <button
                onClick={handleClearMessages}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer Tous les Messages
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Cela supprimera définitivement tous les messages de tous les utilisateurs. Cette action ne peut pas être annulée.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Règles de la Communauté</h3>
              <div className={`p-4 rounded-lg ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="mb-2">Rappelez-vous de faire respecter les règles suivantes:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Pas de contenu inapproprié ou de harcèlement</li>
                  <li>Respectez tous les membres de la communauté</li>
                  <li>Pas de spam ou de contenu promotionnel sans approbation</li>
                  <li>Bloquez les utilisateurs qui enfreignent constamment les directives</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Poll Management Tab */}
        {selectedTab === 'polls' && (
          <div>
            <div className={`p-6 rounded-lg shadow-sm mb-8 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-medium mb-4">Sondage Actuel</h3>
              <button
                onClick={handleResetPoll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Terminer le Sondage Actuel
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Cela terminera le sondage actuel et réinitialisera tous les votes. Les résultats resteront visibles jusqu'à la création d'un nouveau sondage.
              </p>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-medium mb-6">Créer un Nouveau Sondage</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="poll-title" className="block text-sm font-medium mb-1">
                    Titre du Sondage *
                  </label>
                  <input
                    id="poll-title"
                    type="text"
                    value={newPollTitle}
                    onChange={(e) => setNewPollTitle(e.target.value)}
                    placeholder="Défi Hebdomadaire: Meilleure Photo de Nature"
                    className={`w-full p-3 rounded-lg border ${
                      theme.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="poll-description" className="block text-sm font-medium mb-1">
                    Description du Sondage
                  </label>
                  <textarea
                    id="poll-description"
                    value={newPollDescription}
                    onChange={(e) => setNewPollDescription(e.target.value)}
                    placeholder="Partagez vos meilleures photos de nature de vos récentes aventures!"
                    className={`w-full p-3 rounded-lg border ${
                      theme.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Éléments du Sondage</h4>
                    <button
                      type="button"
                      onClick={handleAddPollItem}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Ajouter un Élément
                    </button>
                  </div>
                  
                  {pollItems.map((item, index) => (
                    <div key={item.id} className={`mb-6 p-4 rounded-lg ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">Élément #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => handleRemovePollItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor={`item-title-${item.id}`} className="block text-sm font-medium mb-1">
                            Titre *
                          </label>
                          <input
                            id={`item-title-${item.id}`}
                            type="text"
                            value={item.title}
                            onChange={(e) => handlePollItemChange(item.id, 'title', e.target.value)}
                            placeholder="Lever de Soleil en Montagne"
                            className={`w-full p-2 rounded-lg border ${
                              theme.darkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-800'
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                          />
                        </div>

                        <div>
                          <label htmlFor={`item-author-${item.id}`} className="block text-sm font-medium mb-1">
                            Auteur *
                          </label>
                          <input
                            id={`item-author-${item.id}`}
                            type="text"
                            value={item.author}
                            onChange={(e) => handlePollItemChange(item.id, 'author', e.target.value)}
                            placeholder="Marie Dupont"
                            className={`w-full p-2 rounded-lg border ${
                              theme.darkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-800'
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <label htmlFor={`item-description-${item.id}`} className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <input
                          id={`item-description-${item.id}`}
                          type="text"
                          value={item.description}
                          onChange={(e) => handlePollItemChange(item.id, 'description', e.target.value)}
                          placeholder="Lever de soleil capturé depuis le Mont Blanc le week-end dernier"
                          className={`w-full p-2 rounded-lg border ${
                            theme.darkMode
                              ? 'bg-gray-600 border-gray-500 text-white'
                              : 'bg-white border-gray-300 text-gray-800'
                          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        />
                      </div>

                      <div className="mt-2">
                        <label htmlFor={`item-image-${item.id}`} className="block text-sm font-medium mb-1">
                          URL de l'Image
                        </label>
                        <input
                          id={`item-image-${item.id}`}
                          type="text"
                          value={item.imageUrl}
                          onChange={(e) => handlePollItemChange(item.id, 'imageUrl', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className={`w-full p-2 rounded-lg border ${
                            theme.darkMode
                              ? 'bg-gray-600 border-gray-500 text-white'
                              : 'bg-white border-gray-300 text-gray-800'
                          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={handleCreatePoll}
                      className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Créer le Sondage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;