const mysql = require('mysql');
const { PythonShell } = require('python-shell');
const path = require('path');

// Function to connect to the database
function connectToDatabase() {
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'aaaa',
        database: 'anime_database'
    });

    connection.connect();
    return connection;
}

// Function to load model from file
function loadModel(modelPath) {
    return new Promise((resolve, reject) => {
        const options = {
            mode: 'json',
            pythonPath: 'python', // Adjust this path to point to your Python executable
            scriptPath: path.join(__dirname, './') // Path to the directory containing your Python scripts
        };

        PythonShell.run('A.py', options, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Function to generate top recommendations
async function generateTopRecommendations(userId, n = 10) {
    const connection = connectToDatabase();
    const userRatings = await fetchUserRatings(userId, connection);
    const svdpp = await loadModel('svdpp_model.pkl');

    const predictedRatings = [];
    const cursor = connection.query("SELECT Anime_ID, Name, Alternative FROM Anime");
    
    cursor.on('result', row => {
        if (!(row.Anime_ID in userRatings)) {
            const svdppPred = svdpp.predict(userId, row.Anime_ID).est;
            predictedRatings.push([row.Name, svdppPred]);
        }
    });

    cursor.on('end', () => {
        connection.end();
    });

    return predictedRatings.sort((a, b) => b[1] - a[1]).slice(0, n);
}

// Function to fetch user ratings from the database
function fetchUserRatings(userId, connection) {
    return new Promise((resolve, reject) => {
        const ratings = {};
        connection.query("SELECT Anime_ID, Rating FROM User_Anime WHERE User_ID = ?", [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                results.forEach(row => {
                    ratings[row.Anime_ID] = row.Rating;
                });
                resolve(ratings);
            }
        });
    });
}

// Example usage
const userId = 3;  // Replace with the desired user ID
generateTopRecommendations(userId, 10)
    .then(topRecommendations => {
        console.log("Top Recommendations:");
        topRecommendations.forEach(([anime, rating]) => {
            console.log(`${anime}: ${rating}`);
        });
    })
    .catch(error => {
        console.error("Error generating top recommendations:", error);
    });
