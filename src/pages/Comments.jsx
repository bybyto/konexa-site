import React from 'react';
import CommentPanel from '../components/Comments/CommentPanel';
import { CommentProvider } from '../context/CommentContext';

const Comments = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Vos Avis</h1>
        <p className="text-gray-600 mb-8">
          Vos commentaires et évaluations nous aident à améliorer Konexa. 
          Partagez votre expérience et aidez-nous à créer une meilleure plateforme pour tous.
        </p>
        
        <CommentProvider>
          <CommentPanel />
        </CommentProvider>
      </div>
    </div>
  );
};

export default Comments;