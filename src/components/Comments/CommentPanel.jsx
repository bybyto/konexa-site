import React, { useContext, useState } from 'react';
import { CommentContext } from '../../context/CommentContext';
import { AuthContext } from '../../context/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CommentPanel = () => {
  const { comments, averageRating } = useContext(CommentContext);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');
  
  const approvedComments = comments.filter(c => c.isApproved);
  const pendingComments = comments.filter(c => !c.isApproved);

  const renderRatingStars = () => {
    const rating = parseFloat(averageRating);
    let stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-500 text-2xl">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-500 text-2xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 text-2xl">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
        Avis et Commentaires
      </h2>
      
      <div className="flex items-center mb-6">
        <div className="mr-3">
          <div className="flex">{renderRatingStars()}</div>
          <p className="text-gray-600 mt-1">
            {approvedComments.length === 0 
              ? 'Aucun avis pour le moment' 
              : `Basé sur ${approvedComments.length} avis`}
          </p>
        </div>
        <div className="text-3xl font-bold text-indigo-700 ml-auto">
          {averageRating > 0 ? averageRating : '-'}<span className="text-base font-normal text-gray-600">/5</span>
        </div>
      </div>

      <CommentForm />

      <div className="mt-8">
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'all' ? 'border-b-2 border-indigo-600 font-medium text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            Tous les avis ({approvedComments.length})
          </button>
          {user?.isAdmin && (
            <button
              className={`py-2 px-4 ${activeTab === 'pending' ? 'border-b-2 border-indigo-600 font-medium text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('pending')}
            >
              En attente de validation ({pendingComments.length})
            </button>
          )}
        </div>

        <CommentList comments={activeTab === 'all' ? approvedComments : pendingComments} />
      </div>
    </div>
  );
};

export default CommentPanel;