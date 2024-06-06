import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import AnimeListPage from './components/AnimeListPage';
import RecommendationPage from './components/RecommendationPage';
import AnimePage from './components/AnimePage';
import Header from './components/Header';
import ProfilePage from './components/ProfilePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Set up default route for the root URL */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/anime-list" element={<AnimeListPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/anime/:id" element={<AnimePage />} />
          <Route path="/profile" element={<ProfilePage />} /> 
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
