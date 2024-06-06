const db = require('../db');

// Controller function to get anime by ID
exports.getAnimeById = async (req, res) => {
    try {
        const animeId = req.params.animeId;

        const query = `
        SELECT Anime.Anime_ID, Anime.Name, Anime.Score, Anime.Aired, Anime.Duration, Anime.Episodes, Anime.Rating, Anime.Alternative, GROUP_CONCAT(Genres.GenreName) AS GenreNames, Studios.StudioName, Demographics.DemographicName
        FROM Anime
        LEFT JOIN Anime_Genres ON Anime.Anime_ID = Anime_Genres.Anime_ID
        LEFT JOIN Genres ON Anime_Genres.Genre_ID = Genres.Genre_ID
        LEFT JOIN Anime_Studios ON Anime.Anime_ID = Anime_Studios.Anime_ID
        LEFT JOIN Studios ON Anime_Studios.Studio_ID = Studios.Studio_ID
        LEFT JOIN Anime_Demographics ON Anime.Anime_ID = Anime_Demographics.Anime_ID
        LEFT JOIN Demographics ON Anime_Demographics.Demographic_ID = Demographics.Demographic_ID
        WHERE Anime.Anime_ID = ?
        GROUP BY Anime.Anime_ID, Anime.Name, Anime.Score, Anime.Aired, Anime.Duration, Anime.Episodes, Anime.Rating, Anime.Alternative, Studios.StudioName, Demographics.DemographicName;
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

            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching anime names:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
