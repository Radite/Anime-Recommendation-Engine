// routes/anime.js

const express = require('express');
const router = express.Router();
const AnimeController = require('../controllers/AnimeController');

// Get all anime names
router.get('/names', AnimeController.getAllAnimeNames);

// Get anime by ID
router.get('/:animeId', AnimeController.getAnimeById);

module.exports = router;
