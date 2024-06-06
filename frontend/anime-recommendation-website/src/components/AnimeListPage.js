import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AnimeListPage.css'; // Import CSS file
import Header from './Header'; // Import the Header component

function AnimeListPage() {
  const [animeList, setAnimeList] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      fetchAnimeNames();
    }
  }, [debouncedSearchTerm]);

  const fetchAnimeNames = async () => {
    try {
      const response = await fetch('http://192.168.100.67:3001/anime/names');
      if (!response.ok) {
        throw new Error('Failed to fetch anime names');
      }
      const data = await response.json();
      setAnimeList(data);
    } catch (error) {
      console.error('Error fetching anime names:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let filteredAnime = [];
  if (animeList) {
    filteredAnime = animeList.filter(
      (anime) =>
        anime.Name.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()) ||
        (anime.Alternative && anime.Alternative.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()))
    );
  }

  const displayedAnime = filteredAnime.slice(0, 9); // Display only the first 9 items

  return (
    <div>
      <Header /> {/* Include the Header component here */}
      <div className="anime-list-container">
        <div className="overlay"></div>
        <div className="anime-list-content">
          <h2>Anime Search</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search Anime"
            value={searchTerm}
            onChange={handleSearch}
          />
          {debouncedSearchTerm.trim() !== '' && (
            <ul className="anime-list">
              {displayedAnime.map((anime) => (
                <li key={anime.Anime_ID} className="anime-list-item">
                  <div className="anime-card">
                    <Link to={`/anime/${anime.Anime_ID}`}>{anime.Name}</Link>
                    {anime.Alternative && <p className="alternative-name">({anime.Alternative})</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimeListPage;