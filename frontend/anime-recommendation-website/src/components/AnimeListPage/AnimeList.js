// src/components/AnimeList.js
import React from 'react';
import AnimeCard2 from './AnimeCard2';

function AnimeList({ animeList }) {
  return (
    <ul className="anime-list">
      {animeList.map((anime) => (
        <li key={anime.Anime_ID} className="anime-list-item">
          <AnimeCard2 anime={anime} />
        </li>
      ))}
    </ul>
  );
}

export default AnimeList;
