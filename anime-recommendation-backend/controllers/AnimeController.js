const db = require('../db');
const path = require('path');

exports.getAnimeById = async (req, res) => {
    try {
        const animeId = req.params.animeId;

        const query = `
        SELECT Anime.Anime_ID, Anime.Name, Anime.Score, Anime.Aired, Anime.Duration, Anime.Episodes, Anime.Rating, Anime.Alternative, Anime.Thumbnail, GROUP_CONCAT(Genres.GenreName) AS GenreNames, Studios.StudioName, Demographics.DemographicName
        FROM Anime
        LEFT JOIN Anime_Genres ON Anime.Anime_ID = Anime_Genres.Anime_ID
        LEFT JOIN Genres ON Anime_Genres.Genre_ID = Genres.Genre_ID
        LEFT JOIN Anime_Studios ON Anime.Anime_ID = Anime_Studios.Anime_ID
        LEFT JOIN Studios ON Anime_Studios.Studio_ID = Studios.Studio_ID
        LEFT JOIN Anime_Demographics ON Anime.Anime_ID = Anime_Demographics.Anime_ID
        LEFT JOIN Demographics ON Anime_Demographics.Demographic_ID = Demographics.Demographic_ID
        WHERE Anime.Anime_ID = ?
        GROUP BY Anime.Anime_ID, Anime.Name, Anime.Score, Anime.Aired, Anime.Duration, Anime.Episodes, Anime.Rating, Anime.Alternative, Anime.Thumbnail, Studios.StudioName, Demographics.DemographicName;
    `;

        db.query(query, [animeId], (error, results) => {
            if (error) {
                console.error('Error fetching anime:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Anime not found' });
            }

            const anime = results[0];
            // Encode the anime name for URL
            const encodedName = encodeURIComponent(anime.Name);
            // Replace "%3A" with a space in the encoded name
            const cleanedName = encodedName.replace(/%3A/g, '');
            const imageUrl = `/images/${cleanedName}.jpg`; // Adjust the path based on your image storage
            anime.imageUrl = imageUrl;
            res.status(200).json(anime);
        });
    } catch (error) {
        console.error('Error fetching anime:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller function to get all anime names
exports.getAllAnimeNames = async (req, res) => {
    try {
        const query = 'SELECT Name, Alternative, Anime_ID FROM Anime';

        db.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching anime names:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            // Replace "%3A" with a space in each anime name
            const updatedResults = results.map(anime => {
                // Encode the anime name for URL
                const encodedName = encodeURIComponent(anime.Name);
                // Replace "%3A" with a space in the encoded name
                const cleanedName = encodedName.replace(/%3A/g, '');
                const imageUrl = `/images/${cleanedName}.jpg`;
                anime.imageUrl = imageUrl;
                return anime;
            });

            res.status(200).json(updatedResults);
        });
    } catch (error) {
        console.error('Error fetching anime names:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
