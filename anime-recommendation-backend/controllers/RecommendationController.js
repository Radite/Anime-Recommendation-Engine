const db = require('../db'); // Import the MySQL connection pool from db.js
const axios = require('axios');

// Controller function to get anime recommendations
exports.getRecommendation = async (req, res, next) => {
  const animeId = req.params.animeId; // Extract animeId from URL parameters
  console.log('Anime ID:', animeId); // Log anime ID for debugging

  try {
    // Query to get top 45 anime based on similarity scores for the given anime ID
    const query = `
      SELECT AnimeREF AS animeId, CEIL(SIMILARITYSCORE) AS computedScore
      FROM similarityscores
      WHERE ANIME_ID = ?
      ORDER BY SIMILARITYSCORE DESC
      LIMIT 45
    `;
    
    db.query(query, [animeId], async (error, results) => {
      if (error) {
        console.error('Error fetching similarity scores:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No recommendations found' });
      }

      // Fetch additional anime data for each recommended anime ID
      const animePromises = results.map(row => {
        return axios.get(`http://192.168.100.67:3001/anime/${row.animeId}`);
      });

      try {
        // Wait for all anime data requests to complete
        const animeResponses = await Promise.all(animePromises);

        // Extract anime data from responses
        const animeData = animeResponses.map(response => response.data);

        // Combine recommendation scores with anime data
        const combinedData = results.map((row, index) => {
          return { ...row, ...animeData[index] };
        });

        // Send combined data as JSON response
        res.status(200).json(combinedData);
      } catch (fetchError) {
        console.error('Error fetching anime data:', fetchError);
        return res.status(500).json({ message: 'Error fetching anime data' });
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
