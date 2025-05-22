import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/Admin/AdminPanel';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-admin users away from this page
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // If no user or user is not admin, show access denied message
  if (!user || !user.isAdmin) {
    return (
      <div className="flex-1 p-6 ml-64 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className={`text-2xl font-bold mb-2 ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Access Denied
          </h2>
          <p className={theme.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            You don't have permission to access the admin panel. This page is for administrators only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 ml-64">
      <AdminPanel />
    </div>
  );
};

export default Admin;