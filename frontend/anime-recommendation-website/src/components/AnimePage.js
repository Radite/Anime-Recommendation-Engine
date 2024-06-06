import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/AnimePage.css'; // Import CSS file for styling
import Header from './Header'; // Import the Header component

function AnimePage() {
  const [animeInfo, setAnimeInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // Success or error message type
  const { id } = useParams();

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      try {
        const response = await fetch(`http://192.168.100.67:3001/anime/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch anime information');
        }
        const data = await response.json();
        setAnimeInfo(data);
      } catch (error) {
        console.error('Error fetching anime information:', error);
      }
    };

    const fetchUserRating = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
        const response = await fetch(`http://192.168.100.67:3001/user/anime/rating/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRating(data.rating);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };

    fetchAnimeInfo();
    fetchUserRating();
  }, [id]);

  if (!animeInfo) {
    return <div>Loading...</div>;
  }

  const handleRateAnime = () => {
    setShowPopup(true);
  };

  const handleSaveRating = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
      const response = await fetch(`http://192.168.100.67:3001/users/user-anime-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ anime_id: id, rating }) // Sending anime_id and rating in the request body
      });
      if (response.ok) {
        if (response.status === 201) {
          // New rating added successfully
          setMessage('Rating added successfully!');
          setMessageType('success');
          setShowPopup(false);
        } else if (response.status === 200) {
          // Rating updated successfully
          setMessage('Rating updated successfully!');
          setMessageType('success');
          setShowPopup(false);
        }
      } else {
        // Handle other status codes (e.g., 404, 500)
        setMessage('Failed to save rating');
        setMessageType('error');
        console.error('Failed to save rating:', response.statusText);
      }
    } catch (error) {
      setMessage('Error saving user rating');
      setMessageType('error');
      console.error('Error saving user rating:', error);
    }
  };
  

  return (
    <div>
      <Header /> {/* Include the Header component here */}
      <div className="anime-info-container">
        <div className="overlay"></div> {/* Include overlay */}
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
            <button onClick={handleRateAnime}>Rate this anime</button> {/* Button to rate the anime */}
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <button className="close-btn" onClick={() => setShowPopup(false)}>X</button> {/* Close button */}
                  <h3>Rate {animeInfo.Name}</h3>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Enter rating (1-10)"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <button onClick={handleSaveRating}>Save</button>
                </div>
              </div>
            )}
          </div>
          {message && (
            <p className={messageType}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimePage;
