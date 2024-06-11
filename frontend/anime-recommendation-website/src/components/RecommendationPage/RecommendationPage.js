import React, { useState, useEffect } from 'react';
import Header from '../Header';
import SearchBar from './SearchBar';
import AnimeCard from './AnimeCard';
import AltAnimeCard from './AltAnimeCard'; // Import the AltAnimeCard component
import Pagination from './Pagination';
import '../../styles/RecommendationPage.css';
import fetchAnimeNames from '../../utils/fetchAnimeNames';
import { handleSearch, handleRecommendation, handleSuggestionClick, handleBlur, paginate } from '../../utils/animeFunctions';

function RecommendationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [suggestedAnime, setSuggestedAnime] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recommendationsPerPage] = useState(6);
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

  return (
    <div>
      <Header />
      <div className="recommendation-container">
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
            setCurrentPage(1); // Reset currentPage to 1 when a new suggestion is clicked
          }}
          
        />

        <div className="anime-list">
          {loading ? (
            <div className="loading-placeholder">Loading...</div>
          ) : (
            <div className="anime-cards">
              {generatedRecommendations && !suggestionClicked && !searchActive ? (
                recommendedAnime.slice((currentPage - 1) * recommendationsPerPage, currentPage * recommendationsPerPage).map((anime, index) => (
                  <AltAnimeCard key={index} anime={anime} />
                ))
              ) : (
                recommendedAnime.slice((currentPage - 1) * recommendationsPerPage, currentPage * recommendationsPerPage).map((anime, index) => (
                  <AnimeCard key={index} anime={anime} />
                ))
              )}
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          recommendedAnime={recommendedAnime}
          recommendationsPerPage={recommendationsPerPage}
          paginate={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default RecommendationPage;
