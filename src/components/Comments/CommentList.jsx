import React, { useContext } from 'react';
import { CommentContext } from '../../context/CommentContext';
import { AuthContext } from '../../context/AuthContext';

const CommentList = ({ comments }) => {
  const { deleteComment, likeComment, approveComment } = useContext(CommentContext);
  const { user } = useContext(AuthContext);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleDelete = (commentId) => {
    try {
      deleteComment(commentId, user.id, user.isAdmin);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLike = (commentId) => {
    likeComment(commentId);
  };

  const handleApprove = (commentId, isApproved) => {
    try {
      approveComment(commentId, isApproved, user.isAdmin);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${
              rating >= star ? 'text-yellow-500' : 'text-gray-300'
            } text-lg`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        Aucun commentaire pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className={`border-b pb-5 ${!comment.isApproved ? 'bg-yellow-50 p-4 rounded-md' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium">{comment.username}</h4>
                  <p className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div>
              {renderStars(comment.rating)}
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-gray-800">{comment.text}</p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <button 
              onClick={() => handleLike(comment.id)}
              className="text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{comment.likes}</span>
            </button>
            
            <div className="flex gap-2">
              {user?.isAdmin && !comment.isApproved && (
                <button
                  onClick={() => handleApprove(comment.id, true)}
                  className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm"
                >
                  Approuver
                </button>
              )}
              
              {(user?.isAdmin || user?.id === comment.userId) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;