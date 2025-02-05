import React from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import useCardLoader from './hooks/useCardLoader';
import GameCanvas from './components/GameCanvas';

function App() {
  const { isLoading, loadedImages, totalImages } = useCardLoader();

  if (isLoading) {
    return <LoadingScreen loadedImages={loadedImages} totalImages={totalImages} />;
  }

  return (
    <div className="App">
      <GameCanvas />
    </div>
  );
}

export default App;
