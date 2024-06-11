const pool = require('../db');
const { User_Anime } = require('../models');
const axios = require('axios');

let scoreUpdates = []; // Array to accumulate score updates

// Function to determine if model retraining is needed
const shouldRetrainModel = async () => {
  try {
    // Check the number of score updates accumulated
    const numUpdates = scoreUpdates.length;

    // Check if a certain threshold of updates is reached
    const threshold = 100; // Adjust as needed
    if (numUpdates >= threshold) {
      return true;
    }

    // Alternatively, you can check if a certain time interval has passed since the last retraining
    const lastRetrainedTimestamp = await getLastRetrainedTimestamp(); // Implement this function to fetch the last retrained timestamp from the database
    const currentTime = Date.now();
    const retrainInterval = 24 * 60 * 60 * 1000; // 24 hours
    if (currentTime - lastRetrainedTimestamp >= retrainInterval) {
      return true;
    }

    // If none of the conditions are met, return false
    return false;
  } catch (error) {
    console.error("Error determining if model retraining is needed:", error);
    // Return true by default to ensure model retraining in case of error
    return true;
  }
};

// Update model function with logic to determine if retraining is needed
const updateModel = async () => {
  try {
    // Check if model retraining is needed
    const retrainNeeded = await shouldRetrainModel();
    if (!retrainNeeded) {
      console.log('Model retraining is not needed at this time.');
      return;
    }

    // Process all score updates
    for (const update of scoreUpdates) {
      const { userId, anime_id, rating } = update;

      // Check if the user has already rated the anime
      let userAnime = await User_Anime.findOne({
        where: { User_ID: userId, Anime_ID: anime_id }
      });

      if (userAnime) {
        // If the user has already rated the anime, update the rating
        await userAnime.update({ Rating: rating });
      } else {
        // If the user has not rated the anime before, create a new entry
        await User_Anime.create({
          User_ID: userId,
          Anime_ID: anime_id,
          Rating: rating
        });
      }
    }

    // Clear the score updates array
    scoreUpdates = [];

    // Trigger model retraining
    await axios.post('http://127.0.0.1:5000/retrain-model');
    console.log('Model retraining triggered.');
  } catch (error) {
    console.error("Error updating model:", error);
  }
};

// Controller function to add user anime score
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

    // Add score update to the array
    scoreUpdates.push({ userId, anime_id, rating });

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

// Controller function to get user anime scores
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

// Function to update the model directly with accumulated score updates
exports.updateModelWithScores = async (req, res) => {
  try {
    // Call the function to update the model here
    await updateModel();

    console.log('Model updated with scores...');
    res.status(200).json({ message: "Model updated successfully" });
  } catch (error) {
    console.error("Error updating model:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAnimeScore = async (req, res) => {
  try {
    const { userId, animeId } = req.params;

    // Check if the user has rated the anime
    const userAnime = await User_Anime.findOne({
      where: { User_ID: userId, Anime_ID: animeId }
    });

    if (!userAnime) {
      return res.status(404).json({ message: 'Anime score not found for this user and anime' });
    }

    // Delete the anime score
    await User_Anime.destroy({
      where: { User_ID: userId, Anime_ID: animeId }
    });

    res.status(200).json({ message: 'Anime score deleted successfully' });
  } catch (error) {
    console.error('Error deleting anime score:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};