import React, { useState, useEffect } from 'react';
import Header from '../Header';
import AltAnimeCard from './AltAnimeCard';
import Pagination from './Pagination';
import axios from 'axios';
import '../../styles/PersonalRecommendationPage.css';
import { jwtDecode } from 'jwt-decode';

function PersonalRecommendationPage() {
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true); // Initially set as true to load recommendations on mount
  const [isModelRetraining, setIsModelRetraining] = useState(true); // Initially set as true

  useEffect(() => {
    checkModelStatus(); // Check model status immediately upon component mount
    const intervalId = setInterval(() => {
      checkModelStatus(); // Check model status every 5 seconds
    }, 5000); // Adjusted interval to 5 seconds as per your requirement
  
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isModelRetraining) {
      // Model retraining is complete, fetch recommendations
      fetchRecommendations();
    }
  }, [isModelRetraining]);

  const checkModelStatus = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/model/status');
      const { retraining } = response.data;
      setIsModelRetraining(retraining);
    } catch (error) {
      console.error('Error checking model status:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const response = await axios.get(`http://127.0.0.1:5000/recommendations/${userId}`);
  
      const recommendations = await Promise.all(response.data.map(async (recommendation) => {
        const animeId = recommendation[0];
        const animeName = recommendation[1];
        const predictedRating = Math.round(recommendation[2]);
        try {
          const animeResponse = await axios.get(`http://192.168.100.67:3001/anime/${animeId}`);
          const imageUrl = animeResponse.data.imageUrl;
          return {
            animeId,
            animeName,
            predictedRating,
            imageUrl // Include imageUrl in the recommendation object
          };
        } catch (error) {
          console.error('Error fetching anime details:', error);
          return {
            animeId,
            animeName,
            predictedRating,
            imageUrl: null // If fetching image fails, set imageUrl to null
          };
        }
      }));
  
      setRecommendedAnime(recommendations);
      setLoadingRecommendations(false);
      console.log('Personal Recommendations:', recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };
  
  const handleUpdateRecommendation = async () => {
    try {
      setIsModelRetraining(true); // Set the state to indicate model retraining is in progress
      // Call the backend endpoint to update the model
      await fetch('http://192.168.100.67:3001/users/updateModelWithScores', {
        method: 'POST',
      });
      console.log('Updating recommendation...');
    } catch (error) {
      console.error('Error updating recommendation:', error);
    } finally {
      setIsModelRetraining(false); // Set the state back to indicate model retraining is completed
    }
  };

  return (
    <div>
      <Header />

      <div className="button-container">
        <div className="overlay"></div>

        <button
          className="update-recommendation-button"
          onClick={handleUpdateRecommendation}
          disabled={isModelRetraining}
        >
          {isModelRetraining ? 'Updating Recommendation...' : 'Update Recommendation'}
        </button>
      </div>

      <div className="personal-recommendation-container">
        {loadingRecommendations ? (
          <div className="loading-placeholder">Loading Recommendations...</div>
        ) : recommendedAnime.length > 0 ? (
          <div className="anime-list">
            <div className="anime-cards">
              {recommendedAnime.map((anime, index) => (
                <AltAnimeCard key={index} anime={anime} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PersonalRecommendationPage;
