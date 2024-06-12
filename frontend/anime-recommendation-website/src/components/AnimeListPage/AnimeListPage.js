import React, { useState, useEffect } from 'react';
import '../../styles/AnimeListPage.css'; // Import CSS file
import Header from '../Header'; // Import the Header component
import SearchBar from './SearchBar';
import AnimeList from './AnimeList';
import fetchAnimeNames from '../../utils/fetchAnimeNames'; // Import the fetchAnimeNames utility function

function AnimeListPage() {
  const [animeList, setAnimeList] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      fetchData();
      setCurrentPage(1); // Reset pagination to page 1 when search term changes
    }
  }, [debouncedSearchTerm]);

  const fetchData = async () => {
    try {
      const data = await fetchAnimeNames();
      setAnimeList(data);
    } catch (error) {
      console.error('Error fetching anime names:', error);
    }
  };

  const calculateRelevanceScore = (anime, searchTerm) => {
    // Calculate relevance score based on various factors like match in name, alternative name, etc.
    let score = 0;
    if (anime.Name.toLowerCase().includes(searchTerm.toLowerCase())) {
      score += 3; // Higher weight for matching name
    }
    if (anime.Alternative && anime.Alternative.toLowerCase().includes(searchTerm.toLowerCase())) {
      score += 2; // Moderate weight for matching alternative name
    }
    // Add more factors for relevance scoring if needed
    return score;
  };

  let filteredAnime = [];
  if (animeList) {
    filteredAnime = animeList.filter(
      (anime) =>
        anime.Name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || // Use includes for substring matching
        (anime.Alternative && anime.Alternative.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );

    // Sort filtered anime based on relevance to search term
    filteredAnime.sort((a, b) => {
      const aScore = calculateRelevanceScore(a, debouncedSearchTerm);
      const bScore = calculateRelevanceScore(b, debouncedSearchTerm);
      return bScore - aScore;
    });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedAnime = filteredAnime.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <Header />
      <div className="anime-list-container">
        <div className="overlay"></div>
        <div className="anime-list-content">
          <h2>Anime Search</h2>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setDebouncedSearchTerm={setDebouncedSearchTerm}
          />
          {debouncedSearchTerm.trim() !== '' && (
            <>
              <AnimeList animeList={displayedAnime} />
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <button onClick={nextPage} disabled={indexOfLastItem >= filteredAnime.length}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimeListPage;
