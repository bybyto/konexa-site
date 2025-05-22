import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const [animateIn, setAnimateIn] = useState(false);
  const [typedText, setTypedText] = useState('');
  const welcomeText = "Communauté numérique interactive";
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Animation on mount
  useEffect(() => {
    setTimeout(() => {
      setAnimateIn(true);
    }, 300);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (currentCharIndex < welcomeText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + welcomeText[currentCharIndex]);
        setCurrentCharIndex(currentCharIndex + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A2647' }}>
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center">
        {/* Left Section - Text and Buttons */}
        <div className={`lg:w-1/2 transition-all duration-1000 ease-out transform ${animateIn ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'} z-10`}>
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Bienvenue sur Konexa
            </h1>
            <p className="text-2xl md:text-3xl font-medium mb-6 text-blue-300 min-h-[40px]">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
            <p className="text-lg text-gray-200 mb-8 max-w-xl">
              Rejoignez notre communauté dynamique où vous pouvez échanger des idées, 
              participer à des sondages, et interagir avec Bybyto, notre assistant numérique 
              intelligent conçu pour enrichir votre expérience.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-200">Discussions en Temps Réel</h3>
                <p className="text-sm text-gray-300">Échangez avec d'autres membres de la communauté</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-200">Sondages Interactifs</h3>
                <p className="text-sm text-gray-300">Participez aux sondages hebdomadaires</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-200">Interface Intuitive</h3>
                <p className="text-sm text-gray-300">Navigation fluide et adaptée à tous les appareils</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-200">Assistant IA Bybyto</h3>
                <p className="text-sm text-gray-300">Votre guide personnalisé dans l'expérience Konexa</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/login" 
              className="inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Se connecter
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link 
              to="/register" 
              className="inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              S'inscrire
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Section - Bybyto Assistant */}
        <div className={`lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1000 ease-out transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
          <div className="relative flex justify-center items-center h-full">
            {/* Bybyto Assistant */}
            <div className={`transition-all duration-700 ease-out transform ${animateIn ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-20 opacity-0 rotate-12'} delay-500`}>
              <div className="bg-white rounded-full p-3 shadow-xl">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <div className="text-white font-bold text-center">
                    <div className="text-3xl md:text-4xl">B</div>
                    <div className="text-xs md:text-sm">Bybyto</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 bg-pink-500 rounded-full w-4 h-4 animate-ping"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-yellow-300 rounded-full opacity-70 animate-bounce-slow"></div>
            <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-pink-400 rounded-full opacity-70 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/5 w-8 h-8 bg-indigo-300 rounded-full opacity-70 animate-bounce-slow delay-300"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full py-3 text-center text-gray-300 text-sm">
        © 2025 Konexa | Développé par Rooby
      </div>
    </div>
  );
};

export default Welcome;