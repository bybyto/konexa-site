import React, { useState, useContext, useEffect } from 'react';
import { CommentContext } from '../../context/CommentContext';
import { AuthContext } from '../../context/AuthContext';

const CommentForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { addComment, getUserComment } = useContext(CommentContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const existingComment = getUserComment(user.id);
      if (existingComment) {
        setRating(existingComment.rating);
        setComment(existingComment.text);
        setHasSubmitted(true);
      }
    }
  }, [user, getUserComment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Vous devez être connecté pour laisser un commentaire');
      return;
    }

    if (hasSubmitted) {
      setError('Vous avez déjà soumis un commentaire');
      return;
    }

    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    if (comment.trim() === '') {
      setError('Veuillez entrer un commentaire');
      return;
    }

    try {
      addComment(user.id, user.username, comment, rating);
      setSuccess('Votre commentaire a été ajouté avec succès');
      setHasSubmitted(true);
      // Don't reset the form to show what was submitted
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center mb-4">
        <span className="text-gray-700 mr-2">Note:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-2xl focus:outline-none ${
                (hoveredRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300'
              } transition-colors duration-150`}
              onClick={() => !hasSubmitted && setRating(star)}
              onMouseEnter={() => !hasSubmitted && setHoveredRating(star)}
              onMouseLeave={() => !hasSubmitted && setHoveredRating(0)}
              disabled={hasSubmitted}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="ml-2 text-gray-600">{rating}/5</span>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="bg-gray-100 rounded-md p-4 text-center">
        <p className="text-gray-600">Connectez-vous pour laisser un commentaire</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-md p-5 transition-all duration-300">
      <h3 className="text-lg font-medium mb-3">
        {hasSubmitted ? 'Votre avis' : 'Partagez votre avis'}
      </h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {renderStarRating()}
        
        <div className="mb-4">
          <label 
            htmlFor="comment" 
            className="block text-gray-700 mb-2"
          >
            Commentaire:
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => !hasSubmitted && setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            placeholder="Partagez votre expérience..."
            disabled={hasSubmitted}
          ></textarea>
        </div>
        
        {!hasSubmitted && (
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
            Soumettre
          </button>
        )}
      </form>
    </div>
  );
};

export default CommentForm;