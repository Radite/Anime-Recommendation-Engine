const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/RecommendationController');

// Route to get anime recommendation
router.get('/:animeId', RecommendationController.getRecommendation);

module.exports = router;
