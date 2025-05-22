import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { CommunityContext } from '../context/CommunityContext';
import { AuthContext } from '../context/AuthContext';
import MessageArea from '../components/Community/MessageArea';
import MessageInput from '../components/Community/MessageInput';

const Community = () => {
  const { theme } = useContext(ThemeContext);
  const { communityEnabled } = useContext(CommunityContext);
  const { user } = useContext(AuthContext);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('général');
  
  // Mock channel data - in a real app this would come from an API or context
  const channels = [
    { id: 'général', name: 'Général', unread: 0 },
    { id: 'tech', name: 'Technologie', unread: 3 },
    { id: 'événements', name: 'Événements', unread: 1 },
    { id: 'projets', name: 'Projets', unread: 0 },
    { id: 'ressources', name: 'Ressources', unread: 2 },
  ];
  
  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateIn(true);
    }, 300);
  }, []);

  // If community is disabled, show message
  if (!communityEnabled) {
    return (
      <div className="flex-1 p-6 ml-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-[20%] right-[10%] w-60 h-60 bg-blue-300 dark:bg-blue-700 rounded-full filter blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[30%] left-[15%] w-72 h-72 bg-indigo-400 dark:bg-indigo-800 rounded-full filter blur-3xl opacity-20 dark:opacity-10 animate-pulse" style={{animationDuration: '12s'}}></div>
        
        <div className={`text-center max-w-md mx-auto p-10 rounded-2xl shadow-xl backdrop-filter backdrop-blur-md ${theme.darkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white bg-opacity-60'} transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} z-10`}>
          <div className="relative p-5 mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-900 inline-flex items-center justify-center mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Communauté Temporairement Désactivée
          </h2>
          <p className={`${theme.darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            La section communauté est actuellement désactivée par l'administrateur. Veuillez vérifier plus tard.
          </p>
          <div className="mt-2 inline-block">
            <button className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64 flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-[10%] right-[5%] w-64 h-64 bg-blue-300 dark:bg-blue-700 rounded-full filter blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
      <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-indigo-400 dark:bg-indigo-800 rounded-full filter blur-3xl opacity-20 dark:opacity-10 animate-pulse" style={{animationDuration: '15s'}}></div>
      <div className="absolute top-[40%] left-[30%] w-40 h-40 bg-purple-300 dark:bg-purple-800 rounded-full filter blur-3xl opacity-10 dark:opacity-5 animate-pulse" style={{animationDuration: '8s'}}></div>
      <div className="flex flex-col h-full">
        {/* Channel header */}
        <div className={`px-6 py-4 border-b ${theme.darkMode ? 'border-gray-700 bg-gray-800 bg-opacity-80' : 'border-gray-200 bg-white bg-opacity-70'} backdrop-filter backdrop-blur-sm shadow-sm transition-all duration-500 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'} z-10`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                #{selectedChannel}
              </h1>
              <p className={`text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Bienvenue dans le canal de discussion {selectedChannel}
              </p>
            </div>
            <div className="flex space-x-4">
              {/* Channel selector - mobile only */}
              <div className="md:hidden">
                <select 
                  value={selectedChannel} 
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className={`rounded-md px-3 py-2 text-sm ${theme.darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                >
                  {channels.map(channel => (
                    <option key={channel.id} value={channel.id}>{channel.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Online members */}
              <div className="hidden md:flex items-center">
                <div className="flex -space-x-2 mr-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium">JD</div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium">AS</div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium">MT</div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs font-medium">+5</div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">8 en ligne</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area with channels sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Channel sidebar - desktop only */}
          <div className={`hidden md:block w-64 ${theme.darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-75'} backdrop-filter backdrop-blur-sm border-r ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-md transition-all duration-500 ease-out transform ${animateIn ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'} z-10`}>
            <div className="p-4">
              <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-500 dark:text-gray-400">Canaux</h2>
              <ul className="space-y-1">
                {channels.map((channel, index) => (
                  <li key={channel.id}>
                    <button 
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${selectedChannel === channel.id 
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900 dark:to-indigo-900 dark:bg-opacity-40 dark:text-blue-300 shadow-sm' 
                        : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <span># {channel.name}</span>
                      {channel.unread > 0 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {channel.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t dark:border-gray-700">
              <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-500 dark:text-gray-400">Membres en ligne</h2>
              <ul className="space-y-2">
                <li>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                    <div className="relative mr-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
                    <span className="ml-2 text-xs text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 px-2 py-0.5 rounded-md">Vous</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                    <div className="relative mr-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">JD</div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jean Dupont</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                    <div className="relative mr-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">MT</div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Marie Tremblay</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Message area */}
          <div className="flex-1 flex flex-col">
            <MessageArea />
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;