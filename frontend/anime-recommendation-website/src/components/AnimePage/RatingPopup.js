import React from 'react';

function RatingPopup({ showPopup, setShowPopup, animeInfo, rating, setRating, handleSaveRating }) {
  return (
    showPopup && (
      <div className="popup">
        <div className="popup-content">
          <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
          <h3>Rate {animeInfo.Name}</h3>
          <input
            type="number"
            min="1"
            max="10"
            placeholder="Enter rating (1-10)"
            value={rating}
            onChange={(e) => {
              // Ensure the entered value is within the range 1-10
              const value = Math.min(Math.max(1, e.target.value), 10);
              setRating(value);
            }}
          />
          <button onClick={handleSaveRating}>Save</button>
        </div>
      </div>
    )
  );
}

export default RatingPopup;
