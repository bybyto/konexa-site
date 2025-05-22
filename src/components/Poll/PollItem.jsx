import React, { useContext } from 'react';
import { PollContext } from '../../context/PollContext';
import { ThemeContext } from '../../context/ThemeContext';

const PollItem = ({ item }) => {
  const { vote } = useContext(PollContext);
  const { theme } = useContext(ThemeContext);
  
  const handleVote = () => {
    vote(item.id);
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${theme.darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
      onClick={handleVote}
    >
      <div className="relative">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        )}
        
        <div className={`p-4 ${theme.darkMode ? 'border-t border-gray-700' : ''}`}>
          <h4 className="font-medium text-lg mb-1">{item.title}</h4>
          
          <p className={`text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            By {item.author}
          </p>
          
          {item.description && (
            <p className={`mt-2 text-sm ${theme.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.description}
            </p>
          )}
          
          <button 
            className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transform transition-all duration-200 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              handleVote();
            }}
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollItem;