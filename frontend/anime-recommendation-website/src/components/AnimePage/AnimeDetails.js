// src/components/AnimeDetails.js
import React from 'react';

function AnimeDetails({ animeInfo, handleRateAnime }) {
  return (
    <div className="anime-info-content">
      <div className="card">
        <h2>{animeInfo.Name}</h2>
        <p>Score: {animeInfo.Score}</p>
        <p>Aired: {animeInfo.Aired}</p>
        <p>Duration: {animeInfo.Duration} minutes</p>
        <p>Episodes: {animeInfo.Episodes}</p>
        <p>Rating: {animeInfo.Rating}</p>
        <p>Alternative: {animeInfo.Alternative}</p>
        <p>Genres: {animeInfo.GenreNames}</p>
        <p>Studio: {animeInfo.StudioName}</p>
        <p>Demographic: {animeInfo.DemographicName}</p>
        <button onClick={handleRateAnime}>Rate this anime</button>
      </div>
    </div>
  );
}

export default AnimeDetails;
