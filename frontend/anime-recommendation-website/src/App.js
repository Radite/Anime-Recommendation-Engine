import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import SignUpPage from './components/SignUpPage/SignUpPage';
import AnimeListPage from './components/AnimeListPage/AnimeListPage';
import RecommendationPage from './components/RecommendationPage/RecommendationPage';
import AnimePage from './components/AnimePage/AnimePage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import PersonalRecommendationPage from './components/RecommendationPage/PersonalRecommendationPage';
import './App.css';

function App() {
  // Check if JWT token exists
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  // Conditional rendering or redirect to login
  const ProtectedRoute = ({ element: Component, ...rest }) => {
    return isAuthenticated() ? <Component {...rest} /> : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Default Route*/}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Routes accessible without authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Protected routes */}
          <Route path="/anime-list" element={<ProtectedRoute element={AnimeListPage} />} />
          <Route path="/recommendation" element={<ProtectedRoute element={RecommendationPage} />} />
          <Route path="/anime/:id" element={<ProtectedRoute element={AnimePage} />} />
          <Route path="/profile" element={<ProtectedRoute element={ProfilePage} />} /> 
          <Route path="/personalrecommendation" element={<ProtectedRoute element={PersonalRecommendationPage} />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
