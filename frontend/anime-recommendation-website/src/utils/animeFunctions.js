// src/utils/animeFunctions.js
const handleSearch = (e, animeList, setSearchTerm, setSuggestedAnime) => {
  const searchTerm = e.target.value.toLowerCase();
  setSearchTerm(searchTerm);
  
  let filteredAnime = [];
  if (animeList) {
      filteredAnime = animeList.filter(anime =>
          anime.Name.toLowerCase().includes(searchTerm) ||
          (anime.Alternative && anime.Alternative.toLowerCase().includes(searchTerm))
      );

      // Sort the filtered anime based on how closely they match the search term
      filteredAnime.sort((a, b) => {
          const aIndex = a.Name.toLowerCase().indexOf(searchTerm);
          const bIndex = b.Name.toLowerCase().indexOf(searchTerm);

          // Check for exact matches
          if (a.Name.toLowerCase() === searchTerm && b.Name.toLowerCase() !== searchTerm) {
              return -1;
          } else if (b.Name.toLowerCase() === searchTerm && a.Name.toLowerCase() !== searchTerm) {
              return 1;
          }

          // Prioritize matches where the search term is at the beginning of the name
          if (aIndex === 0 && bIndex !== 0) {
              return -1;
          } else if (bIndex === 0 && aIndex !== 0) {
              return 1;
          } else {
              return aIndex - bIndex;
          }
      });
  }

  setSuggestedAnime(filteredAnime.slice(0, 8));
};

  
  const handleRecommendation = async (animeId, setLoading, setRecommendedAnime, setCurrentPage) => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.100.67:3001/api/recommendation/${animeId}`);
      const data = await response.json();
      setRecommendedAnime(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestionClick = (animeName, animeList, setSearchTerm, setSuggestedAnime, handleRecommendation, setLoading, setRecommendedAnime) => { // Add setRecommendedAnime here
    setSearchTerm(animeName);
    const selectedAnime = animeList.find((anime) => anime.Name === animeName);
    if (selectedAnime) {
      handleRecommendation(selectedAnime.Anime_ID, setLoading, setRecommendedAnime); 
      setLoading(true);
    }
    setSuggestedAnime([]);
  };
  
  const handleBlur = (setSuggestedAnime) => {
    setTimeout(() => {
      setSuggestedAnime([]);
    }, 200);
  };
  
  const paginate = (pageNumber, recommendedAnime, recommendationsPerPage, setCurrentPage) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(recommendedAnime.length / recommendationsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };
  
  export { handleSearch, handleRecommendation, handleSuggestionClick, handleBlur, paginate };
  