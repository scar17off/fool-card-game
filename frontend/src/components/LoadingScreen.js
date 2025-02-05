import React from 'react';

function LoadingScreen({ loadedImages, totalImages }) {
  return (
    <div className="loading-screen">
      <h2>Loading Game Assets...</h2>
      <div className="loading-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(loadedImages / totalImages) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {Math.round((loadedImages / totalImages) * 100)}%
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen; 