// SearchBar.js
import React from 'react';

function SearchBar({ searchTerm, handleSearch, handleBlur, suggestedAnime, handleSuggestionClick }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onBlur={handleBlur}
        placeholder="Search for anime..."
        className="search-input"
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
  );
}

export default SearchBar;
