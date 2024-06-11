// utils/fetchAnimeScores.js
import axios from 'axios';

export const fetchAnimeScores = async () => {
  try {
    const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
    const response = await axios.get('http://192.168.100.67:3001/users/anime-scores', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch anime scores');
  }
};
