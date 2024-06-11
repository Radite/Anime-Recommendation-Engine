// src/components/SearchBar.js
import React, { useEffect, useState } from 'react';

function SearchBar({ searchTerm, setSearchTerm, setDebouncedSearchTerm }) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, setDebouncedSearchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <input
      type="text"
      className="search-input"
      placeholder="Search Anime"
      value={searchTerm}
      onChange={handleSearch}
    />
  );
}

export default SearchBar;
