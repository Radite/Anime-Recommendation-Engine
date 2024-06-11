// src/components/AnimeCard2.js
import React from 'react';
import { Link } from 'react-router-dom';

function AnimeCard2({ anime }) {
  return (
    <div className="anime-card2">
      <Link to={`/anime/${anime.Anime_ID}`}>{anime.Name}</Link>
      {anime.Alternative && <p className="alternative-name">({anime.Alternative})</p>}
    </div>
  );
}

export default AnimeCard2;
