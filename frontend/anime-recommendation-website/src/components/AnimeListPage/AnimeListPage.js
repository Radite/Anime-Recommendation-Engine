// src/pages/AnimeListPage.js
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

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      fetchData();
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

  let filteredAnime = [];
  if (animeList) {
    filteredAnime = animeList.filter(
      (anime) =>
        anime.Name.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()) ||
        (anime.Alternative && anime.Alternative.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()))
    );
  }

  const displayedAnime = filteredAnime.slice(0, 3); // Display only the first 3 items

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
            <AnimeList animeList={displayedAnime} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimeListPage;
