const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/verifyToken');

// Route to get all users
router.get('/', UserController.getAllUsers);

router.get('/anime-scores', verifyToken, UserController.getUserAnimeScores);

// Assuming verifyToken is middleware
router.post('/user-anime-score', verifyToken, (req, res) => {
    UserController.addUserAnimeScore(req, res);
  });

// Route to update model with scores
router.post('/updateModelWithScores', UserController.updateModelWithScores);

// Route to delete anime score
router.delete('/user-anime-score/:userId/:animeId', verifyToken, UserController.deleteAnimeScore);

module.exports = router;
