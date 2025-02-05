import { useState, useEffect } from 'react';

function useCardLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const totalImages = 52;

  useEffect(() => {
    const loadCardImages = () => {
      const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
      const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      let loaded = 0;

      suits.forEach(suit => {
        values.forEach(value => {
          const img = new Image();
          img.src = `/cards/${value}_of_${suit}.png`;
          img.onload = () => {
            loaded++;
            setLoadedImages(loaded);
            console.log(`Loaded: ${value}_of_${suit}.png`);
            if (loaded === totalImages) {
              setIsLoading(false);
            }
          };
          img.onerror = () => {
            loaded++;
            setLoadedImages(loaded);
            console.error(`Failed to load: ${value}_of_${suit}.png`);
          };
        });
      });
    };

    loadCardImages();
  }, []);

  return { isLoading, loadedImages, totalImages };
}

export default useCardLoader; 