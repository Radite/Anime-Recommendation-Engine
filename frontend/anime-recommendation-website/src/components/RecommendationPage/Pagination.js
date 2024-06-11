// Pagination.js
import React from 'react';

function Pagination({ currentPage, recommendedAnime, recommendationsPerPage, paginate }) {
  const indexOfLastAnime = currentPage * recommendationsPerPage;
  const indexOfFirstAnime = indexOfLastAnime - recommendationsPerPage;
  const currentAnime = recommendedAnime.slice(indexOfFirstAnime, indexOfLastAnime);

  return (
    <div className="pagination">
      <div className="pagination-buttons">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous Page
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastAnime >= recommendedAnime.length}>
          Next Page
        </button>
      </div>
    </div>
  );
}

export default Pagination;
