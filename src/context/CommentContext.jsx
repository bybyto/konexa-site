import React, { createContext, useState, useEffect } from 'react';

// Create the Comment Context
export const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Load comments from localStorage on component mount
    const loadComments = () => {
      try {
        const savedComments = JSON.parse(localStorage.getItem('konexa_comments')) || [];
        setComments(savedComments);
        
        // Calculate average rating
        if (savedComments.length > 0) {
          const totalRating = savedComments.reduce((sum, comment) => sum + comment.rating, 0);
          setAverageRating((totalRating / savedComments.length).toFixed(1));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  // Save comments to localStorage whenever comments state changes
  useEffect(() => {
    localStorage.setItem('konexa_comments', JSON.stringify(comments));
    
    // Recalculate average rating whenever comments change
    if (comments.length > 0) {
      const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
      setAverageRating((totalRating / comments.length).toFixed(1));
    } else {
      setAverageRating(0);
    }
  }, [comments]);

  // Add a new comment
  const addComment = (userId, username, text, rating) => {
    const newComment = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      userId,
      username,
      text,
      rating,
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true // By default comments are approved
    };

    setComments([...comments, newComment]);
    return newComment;
  };

  // Delete a comment (admin function or own comment)
  const deleteComment = (commentId, userId, isAdmin) => {
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) {
      throw new Error('Commentaire non trouvé');
    }

    if (comment.userId !== userId && !isAdmin) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce commentaire');
    }

    setComments(comments.filter(c => c.id !== commentId));
    return true;
  };

  // Like a comment
  const likeComment = (commentId) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  // Admin functions
  const approveComment = (commentId, isApproved, isAdmin) => {
    if (!isAdmin) {
      throw new Error('Permission refusée');
    }

    setComments(comments.map(c => 
      c.id === commentId ? { ...c, isApproved } : c
    ));
  };

  // Get user's comment if any
  const getUserComment = (userId) => {
    return comments.find(c => c.userId === userId);
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        averageRating,
        addComment,
        deleteComment,
        likeComment,
        approveComment,
        getUserComment
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};