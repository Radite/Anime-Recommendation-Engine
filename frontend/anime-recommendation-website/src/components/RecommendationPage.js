import React, { useState, useEffect } from 'react';
import '../styles/RecommendationPage.css'; // Import CSS file for styling

function RecommendationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [suggestedAnime, setSuggestedAnime] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recommendationsPerPage] = useState(9);
  const [loading, setLoading] = useState(false); // Initially set loading to false

  useEffect(() => {
    fetchAnimeNames();
  }, []);

  const fetchAnimeNames = async () => {
    try {
      const response = await fetch('http://192.168.100.67:3001/anime/names');
      const data = await response.json();
      setAnimeList(data);
    } catch (error) {
      console.error('Error fetching anime names:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filter anime list based on search term
    let filteredAnime = [];
    if (animeList) {
      filteredAnime = animeList.filter(
        (anime) =>
          anime.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          (anime.Alternative &&
            anime.Alternative.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    }
    // Display only top 5 matching anime names
    setSuggestedAnime(filteredAnime.slice(0, 5));
  };

  const handleRecommendation = async (animeId) => {
    setLoading(true); // Set loading to true when starting to fetch recommendations
    try {
      const response = await fetch(`http://192.168.100.67:3001/api/recommendation/${animeId}`);
      const data = await response.json();
      setRecommendedAnime(data);
      setCurrentPage(1); // Reset current page to 1 when new recommendations are fetched
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false); // Set loading to false when recommendations are fetched (or if there's an error)
    }
  };

  const handleSuggestionClick = (animeName) => {
    setSearchTerm(animeName);
    const selectedAnime = animeList.find((anime) => anime.Name === animeName);
    if (selectedAnime) {
      handleRecommendation(selectedAnime.Anime_ID);
      setLoading(true); // Set loading to true when suggestion is clicked
    }
    setSuggestedAnime([]); // Clear suggestions after clicking
  };

  const handleBlur = () => {
    setTimeout(() => {
      setSuggestedAnime([]); // Clear suggestions after leaving the input field
    }, 200);
  };

  // Logic for pagination
  const indexOfLastAnime = currentPage * recommendationsPerPage;
  const indexOfFirstAnime = indexOfLastAnime - recommendationsPerPage;
  const currentAnime = recommendedAnime.slice(indexOfFirstAnime, indexOfLastAnime);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="recommendation-container">
      <h2>Recommend Me an Anime</h2>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onBlur={handleBlur}
          placeholder="Search for anime..."
        />
        {suggestedAnime.length > 0 && (
          <div className="suggestion-box">
            {suggestedAnime.map((anime, index) => (
              <div
                key={index}
                className="suggested-anime"
                onClick={() => handleSuggestionClick(anime.Name)}
              >
                {anime.Name}
                {anime.Alternative && ` (${anime.Alternative})`}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="anime-list">
        {loading ? ( // Show loading placeholder if loading is true
          <div className="loading-placeholder">Loading...</div>
        ) : (
          currentAnime.map((anime, index) => (
            <div key={index} className="anime-item">
              {anime.Name}: {Math.ceil(anime.computedScore)}
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        {recommendedAnime.length > recommendationsPerPage && (
          <button onClick={() => paginate(currentPage - 1)}>Previous Page</button>
        )}
        {recommendedAnime.length > indexOfLastAnime && (
          <button onClick={() => paginate(currentPage + 1)}>Next Page</button>
        )}
      </div>
    </div>
  );
}

export default RecommendationPage;
