import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { PollContext } from '../context/PollContext';
import { formatTimeAgo } from '../utils/dateUtils';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { currentPoll, pollHistory } = useContext(PollContext);
  const [greeting, setGreeting] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateIn(true);
    }, 300);
  }, []);

  return (
    <div className="flex-1 p-6 ml-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <div className={`max-w-4xl mx-auto ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {/* Header Section with Animation */}
        <div className={`transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} mb-10`}>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {greeting}, {user?.username || 'Utilisateur'}!
          </h1>
          <p className={`text-lg ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Bienvenue sur la plateforme communautaire Konexa. Connectez-vous, partagez et interagissez avec d'autres membres.
          </p>
        </div>
        
        {/* Quick Stats with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-100 rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${theme.darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white backdrop-filter backdrop-blur-sm bg-opacity-70'}`}>
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg ml-2">Communauté</h3>
            </div>
            <p className={theme.darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Rejoignez la conversation dans notre espace communautaire.
            </p>
            <div className="mt-4">
              <a 
                href="/community" 
                className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 py-2 rounded-md transition-all duration-300"
              >
                Accéder à la Communauté
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className={`transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-200 rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${theme.darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white backdrop-filter backdrop-blur-sm bg-opacity-70'}`}>
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg ml-2">Sondages Hebdomadaires</h3>
            </div>
            <p className={theme.darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {currentPoll ? 'Votez dans le sondage de cette semaine !' : 'Revenez bientôt pour un nouveau sondage.'}
            </p>
            <div className="mt-4">
              <a 
                href="/polls" 
                className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white px-3 py-2 rounded-md transition-all duration-300"
              >
                Accéder aux Sondages
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className={`transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-300 rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${theme.darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white backdrop-filter backdrop-blur-sm bg-opacity-70'}`}>
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg ml-2">Personnaliser</h3>
            </div>
            <p className={theme.darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Personnalisez votre profil et les paramètres d'apparence.
            </p>
            <div className="mt-4">
              <a 
                href="/settings" 
                className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-3 py-2 rounded-md transition-all duration-300"
              >
                Accéder aux Paramètres
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Current Poll Preview (if exists) with Animation */}
        {currentPoll && (
          <div className={`transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-400 mb-12 rounded-lg overflow-hidden shadow-md hover:shadow-lg ${theme.darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white backdrop-filter backdrop-blur-sm bg-opacity-80'}`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">Sondage en Cours</h2>
              <p className={theme.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {currentPoll.title}
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentPoll.items.slice(0, 4).map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`transition-all duration-500 transform hover:-translate-y-1 hover:shadow-md rounded-lg p-3 ${theme.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {item.imageUrl && (
                      <div className="aspect-square rounded-md overflow-hidden mb-2">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className={`text-xs ${theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Par {item.author}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <a 
                  href="/polls" 
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:from-blue-600 hover:to-pink-600 transition-all transform hover:-translate-y-1 hover:shadow-md"
                >
                  Voter Maintenant
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Recent Poll Results with Animation */}
        {pollHistory.length > 0 && (
          <div className={`transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-500 rounded-lg shadow-md hover:shadow-lg ${theme.darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white backdrop-filter backdrop-blur-sm bg-opacity-80'}`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">Résultats des Sondages Récents</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {pollHistory.slice(0, 3).map((poll, index) => {
                // Find the winner (item with most votes)
                const winner = [...poll.items].sort((a, b) => b.votes.length - a.votes.length)[0];
                
                return (
                  <div 
                    key={poll.createdAt} 
                    className={`p-6 transition-all duration-500 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                    style={{ transitionDelay: `${(index * 150) + 500}ms` }}
                  >
                    <h3 className="font-medium mb-2">{poll.title}</h3>
                    <div className="flex items-center">
                      {winner.imageUrl && (
                        <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300">
                          <img src={winner.imageUrl} alt={winner.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          Gagnant: {winner.title} par {winner.author}
                        </p>
                        <p className={`text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {winner.votes.length} votes • Terminé {formatTimeAgo(poll.endedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;