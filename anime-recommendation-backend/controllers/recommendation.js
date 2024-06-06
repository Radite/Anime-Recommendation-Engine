const { spawn } = require('child_process');

// Controller function for handling the '/recommendation' route
const getRecommendation = (req, res) => {
    const animeId = req.params.id;

    // Check if animeId is provided
    if (!animeId) {
        return res.status(400).json({ error: 'Anime ID is required' });
    }

    // Spawn a child process to execute the Python script
    const pythonProcess = spawn('python', ['recommendation.py', animeId, JSON.stringify(anime_df)]);

    // Capture data from stdout
    let data = '';
    pythonProcess.stdout.on('data', (chunk) => {
        data += chunk.toString();
    });

    // Handle Python script exit
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Parse the JSON result and send it in the response
        const recommendations = JSON.parse(data);
        res.json({ recommendations });
    });
};

module.exports = {
    getRecommendation
};
