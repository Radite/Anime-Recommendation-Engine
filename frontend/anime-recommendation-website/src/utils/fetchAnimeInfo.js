// src/utils/fetchAnimeInfo.js
export const fetchAnimeInfo = async (id) => {
  try {
    const response = await fetch(`http://192.168.100.67:3001/anime/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch anime information');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching anime information:', error);
    throw error;
  }
};
