import React, { useState, useEffect } from 'react';

function AnimeListPage() {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch anime data from backend or API
    // Example:
    // fetch('/api/anime')
    //   .then(response => response.json())
    //   .then(data => setAnimeList(data));
    // Mock data for now
    const mockAnimeData = [
      { id: 1, name: 'Anime 1', rating: 8 },
      { id: 2, name: 'Anime 2', rating: 9 },
      { id: 3, name: 'Anime 3', rating: 7 }
    ];
    setAnimeList(mockAnimeData);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAnime = animeList.filter(anime => anime.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h2>Anime List</h2>
      <input type="text" placeholder="Search Anime" value={searchTerm} onChange={handleSearch} />
      <ul>
        {filteredAnime.map(anime => (
          <li key={anime.id}>{anime.name} - Rating: {anime.rating}</li>
        ))}
      </ul>
    </div>
  );
}

export default AnimeListPage;
