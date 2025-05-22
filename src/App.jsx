import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CommunityProvider } from './context/CommunityContext';
import { PollProvider } from './context/PollContext';
import { AssistantProvider } from './context/AssistantContext';
import { MessagingProvider } from './context/MessagingContext';
import { CommentProvider } from './context/CommentContext';

import Welcome from './pages/Welcome';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import Community from './pages/Community';
import Polls from './pages/Polls';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Messaging from './pages/Messaging';
import Comments from './pages/Comments';
import AssistantBot from './components/Assistant/AssistantBot';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('konexa_user'));
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <CommunityProvider>
            <PollProvider>
              <MessagingProvider>
                <CommentProvider>
                  <AssistantProvider>
                    <div className="min-h-screen font-['Raleway']">
                      {isAuthenticated && <Navbar />}
                      <div className="flex">
                        {isAuthenticated && <Sidebar />}
                        <div className="flex-1">
                          <Routes>
                            <Route path="/welcome" element={!isAuthenticated ? <Welcome /> : <Navigate to="/" />} />
                            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/welcome" />} />
                            <Route path="/community" element={isAuthenticated ? <Community /> : <Navigate to="/login" />} />
                            <Route path="/polls" element={isAuthenticated ? <Polls /> : <Navigate to="/login" />} />
                            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
                            <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
                            <Route path="/messaging" element={isAuthenticated ? <Messaging /> : <Navigate to="/login" />} />
                            <Route path="/messaging/:conversationId" element={isAuthenticated ? <Messaging /> : <Navigate to="/login" />} />
                            <Route path="/comments" element={isAuthenticated ? <Comments /> : <Navigate to="/login" />} />
                          </Routes>
                        </div>
                      </div>
                      <AssistantBot />
                    </div>
                  </AssistantProvider>
                </CommentProvider>
              </MessagingProvider>
            </PollProvider>
          </CommunityProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;