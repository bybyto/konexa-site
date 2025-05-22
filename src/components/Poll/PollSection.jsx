import React, { useContext, useState, useEffect } from 'react';
import { PollContext } from '../../context/PollContext';
import PollItem from './PollItem';
import PollResults from './PollResults';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

const PollSection = () => {
  const { currentPoll, hasVoted, getNextPollDate } = useContext(PollContext);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Update countdown timer
    const updateTimer = () => {
      if (currentPoll) {
        const nextPollDate = getNextPollDate();
        const now = new Date();
        const diff = nextPollDate - now;

        if (diff <= 0) {
          setTimeLeft('Poll is ending soon...');
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [currentPoll, getNextPollDate]);

  if (!currentPoll) {
    return (
      <div className={`h-full flex items-center justify-center ${theme.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <div className="text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No Active Poll</h3>
          <p className="mb-4">A new poll will be available soon!</p>
          {user?.isAdmin && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Create New Poll
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className={`mb-8 pb-6 border-b ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{currentPoll.title}</h2>
          <div className={`text-sm ${theme.darkMode ? 'text-blue-300' : 'text-blue-600'} font-medium`}>
            {timeLeft}
          </div>
        </div>
        <p className={`${theme.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {currentPoll.description}
        </p>
      </div>

      {hasVoted ? (
        <PollResults poll={currentPoll} />
      ) : (
        <>
          <h3 className="text-lg font-medium mb-4">Cast your vote:</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {currentPoll.items.map((item) => (
              <PollItem key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PollSection;