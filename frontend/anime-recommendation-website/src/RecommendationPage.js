import React from 'react';

function RecommendationPage() {
  const handleRecommendation = () => {
    // Add code to request recommendation from backend
    // Example:
    // fetch('/api/recommendation')
    //   .then(response => response.json())
    //   .then(data => console.log(data));
    // Mock recommendation for now
    console.log('Recommendation requested');
  };

  return (
    <div>
      <h2>Recommend Me an Anime</h2>
      <button onClick={handleRecommendation}>Recommend Me an Anime</button>
      <div>
        {/* Display recommended anime here */}
      </div>
    </div>
  );
}

export default RecommendationPage;
