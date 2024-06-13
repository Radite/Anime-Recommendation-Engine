import React, { useState, useEffect } from 'react';
import Header from '../Header';
import SearchBar from './SearchBar';
import AnimeCard from './AnimeCard';
import '../../styles/RecommendationPage.css';
import fetchAnimeNames from '../../utils/fetchAnimeNames';
import { handleSearch, handleRecommendation, handleSuggestionClick, handleBlur } from '../../utils/animeFunctions';

function RecommendationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [suggestedAnime, setSuggestedAnime] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedRecommendations, setGeneratedRecommendations] = useState(false); // State to track if recommendations were generated
  const [suggestionClicked, setSuggestionClicked] = useState(false); // State to track if a suggestion was clicked
  const [searchActive, setSearchActive] = useState(false); // State to track if a search is active

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAnimeNames();
        setAnimeList(data);
      } catch (error) {
        console.error('Error fetching anime names:', error);
      }
    }
    fetchData();
  }, []);

  // Function to handle recommendation fetching
  const handleRecommendations = async () => {
    try {
      setLoading(true);
      const recommendations = await handleRecommendation(searchTerm);
      setRecommendedAnime(recommendations);
      setLoading(false);
      setGeneratedRecommendations(true);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  // useEffect to fetch recommendations when searchTerm changes
  useEffect(() => {
    if (searchTerm !== '') {
      handleRecommendations();
    } else {
      setRecommendedAnime([]);
      setGeneratedRecommendations(false);
    }
  }, [searchTerm]);

  return (
    <div>
      <Header />
      <div className="search-bar-container">
        <div className="overlay"></div>
        <SearchBar
          searchTerm={searchTerm}
          handleSearch={(e) => {
            handleSearch(e, animeList, setSearchTerm, setSuggestedAnime);
            setSuggestionClicked(false); // Reset suggestionClicked state when search is performed
            setSearchActive(true); // Set searchActive state to true when search is active
          }}
          handleBlur={() => {
            handleBlur(setSuggestedAnime);
            setSearchActive(false); // Reset searchActive state when search is inactive
          }}
          suggestedAnime={suggestedAnime}
          handleSuggestionClick={(animeName) => {
            handleSuggestionClick(animeName, animeList, setSearchTerm, setSuggestedAnime, handleRecommendation, setLoading, setRecommendedAnime);
            setSuggestionClicked(true); // Set suggestionClicked state to true when suggestion is clicked
          }}
        />
      </div>

      {suggestionClicked && ( // Conditionally render recommendation container based on suggestionClicked state
        <div className="recommendation-container">
          <div className="anime-list">
            {loading ? (
              <div className="loading-placeholder">Loading...</div>
            ) : (
              <div className="anime-cards">
                {recommendedAnime.map((anime, index) => (
                  <AnimeCard key={index} anime={anime} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationPage;
