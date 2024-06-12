import React from 'react';

function AnimeDetails({ animeInfo, handleRateAnime }) {
  const baseUrl = 'http://192.168.100.67:3001';
  const imageUrl = animeInfo.imageUrl ? `${baseUrl}${animeInfo.imageUrl}` : null;
  console.log(baseUrl); // Log the base URL to the console
  console.log(imageUrl); // Log the base URL to the console

  return (
    <div className="anime-info-content">
      <div className="card">
        <div className="flex-container">
          {imageUrl ? (
            <div className="image-container">
              <img src={imageUrl} alt={animeInfo.Name} onError={(e) => { e.target.onerror = null; e.target.src = `${baseUrl}/images/placeholder.png` }} />
            </div>
          ) : (
            <div className="image-container">
              <div>No image available</div>
            </div>
          )}
          <div className="info-container">
            <h2>{animeInfo.Name}</h2>
            <p>Score: {animeInfo.Score}</p>
            <p>Aired: {animeInfo.Aired}</p>
            <p>Duration: {animeInfo.Duration} minutes</p>
            <p>Episodes: {animeInfo.Episodes}</p>
            <p>Rating: {animeInfo.Rating}</p>
            {animeInfo.Alternative && <p>Alternative Title: {animeInfo.Alternative}</p>}
            <p>Genres: {animeInfo.GenreNames}</p>
            <p>Studio: {animeInfo.StudioName}</p>
            <p>Demographic: {animeInfo.DemographicName}</p>
            <button onClick={handleRateAnime}>Rate this anime</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetails;
