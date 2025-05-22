import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

const PollResults = ({ poll }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  
  // Calculate total votes
  const totalVotes = poll.items.reduce((sum, item) => sum + item.votes.length, 0);
  
  // Sort items by votes (descending)
  const sortedItems = [...poll.items].sort((a, b) => b.votes.length - a.votes.length);
  
  // Find which item the current user voted for
  const userVote = sortedItems.find(item => item.votes.includes(user.username));
  
  return (
    <div className={`space-y-6 ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Results</h3>
        <div className={`text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Total votes: {totalVotes}
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedItems.map((item) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((item.votes.length / totalVotes) * 100);
          const isWinning = sortedItems[0].id === item.id && percentage > 0;
          const isUserVote = item.votes.includes(user.username);
          
          return (
            <div 
              key={item.id}
              className={`${theme.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-sm transition-all ${isUserVote ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <h4 className="font-medium">{item.title}</h4>
                  {isUserVote && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Your vote
                    </span>
                  )}
                  {isWinning && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Leading
                    </span>
                  )}
                </div>
                <span className="font-medium">{percentage}%</span>
              </div>
              
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isWinning ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-blue-500'} transition-all duration-500`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className={`mt-2 text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.votes.length} {item.votes.length === 1 ? 'vote' : 'votes'}
              </div>
              
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="mt-3 w-full h-40 object-cover rounded-lg opacity-80"
                  loading="lazy"
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <p className={`text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          Voting is closed. Results will be reset when the next poll begins.
        </p>
      </div>
    </div>
  );
};

export default PollResults;