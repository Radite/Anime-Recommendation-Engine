// components/AnimeList.js

import React, { useState, useEffect } from 'react';

function AnimeList() {
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        // Fetch anime data from backend when component mounts
        fetch('/api/anime')
            .then(response => response.json())
            .then(data => setAnimeList(data))
            .catch(error => console.error("Error fetching anime list:", error));
    }, []);

    return (
        <div>
            <h2>Anime List</h2>
            <ul>
                {animeList.map(anime => (
                    <li key={anime.id}>
                        {anime.title} - {anime.genre} {/* Adjust fields as per your Anime model */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AnimeList;
