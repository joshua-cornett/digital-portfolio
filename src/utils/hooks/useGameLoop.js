import { useEffect } from 'react';

/**
 * Custom hook for running a game loop.
 *
 * @param {Function} updateGameState - Function to call on each game frame.
 */
const useGameLoop = (updateGameState) => {
  useEffect(() => {
    const loop = () => {
      updateGameState();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loop);
  }, [updateGameState]);
};

export default useGameLoop;
