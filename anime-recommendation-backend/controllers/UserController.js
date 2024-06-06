const pool = require('../db');
const { User_Anime } = require('../models');

exports.addUserAnimeScore = async (req, res) => {
  try {
    const { userId } = req;
    const { anime_id, rating } = req.body;

    // Check if the user has already rated the anime
    let userAnime = await User_Anime.findOne({
      where: { User_ID: userId, Anime_ID: anime_id }
    });

    if (userAnime) {
      // If the user has already rated the anime, update the rating
      await userAnime.update({ Rating: rating });
      res.status(200).json({ message: "Anime rating updated successfully" });
    } else {
      // If the user has not rated the anime before, create a new entry
      await User_Anime.create({
        User_ID: userId,
        Anime_ID: anime_id,
        Rating: rating
      });
      res.status(201).json({ message: "Anime rating added successfully" });
    }
  } catch (error) {
    console.error("Error adding anime rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get all users
exports.getAllUsers = (req, res, next) => {
  // Query to select all users
  const sql = 'SELECT * FROM user';

  // Execute the query using the connection pool
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      next(err);
      return;
    }
    // Send the users as a JSON response
    res.json(results);
  });
};

exports.getUserAnimeScores = async (req, res) => {
  try {
    const userId = req.userId;

    // SQL query to fetch anime scores along with anime names for the given user
    const query = `
      SELECT ua.Anime_ID, ua.Rating, a.Name, a.Alternative
      FROM user_anime ua
      JOIN Anime a ON ua.Anime_ID = a.Anime_ID
      WHERE ua.User_ID = ?
    
    `;

    // Execute the query
    pool.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching user anime scores:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No anime scores found for this user' });
      }

      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error fetching user anime scores:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};