import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import AnimeListPage from './AnimeListPage';
import RecommendationPage from './RecommendationPage';
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
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
