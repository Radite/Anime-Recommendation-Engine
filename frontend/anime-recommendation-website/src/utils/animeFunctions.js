// src/utils/animeFunctions.js
const handleSearch = (e, animeList, setSearchTerm, setSuggestedAnime) => {
    setSearchTerm(e.target.value);
    let filteredAnime = [];
    if (animeList) {
      filteredAnime = animeList.filter(
        (anime) =>
          anime.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          (anime.Alternative && anime.Alternative.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    }
    setSuggestedAnime(filteredAnime.slice(0, 5));
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
  