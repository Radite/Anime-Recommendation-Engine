// src/utils/fetchAnimeNames.js
const fetchAnimeNames = async () => {
  try {
    const response = await fetch('http://192.168.100.67:3001/anime/names');
    if (!response.ok) {
      throw new Error('Failed to fetch anime names');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching anime names:', error);
    throw error;
  }
};

export default fetchAnimeNames;
