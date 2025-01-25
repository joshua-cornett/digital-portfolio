import { useEffect, useRef } from 'react';

/**
 * Hook to manage keyboard-based controls for rotation or interaction.
 *
 * @param {number} rotationSpeed - The speed multiplier for rotational changes.
 * @returns {Object} - Active keys and a method to calculate rotation velocity.
 */
const useKeyControls = (rotationSpeed = 1) => {
  const activeKeys = useRef(new Set());

  // Handle keydown events
  const handleKeyDown = (event) => {
    activeKeys.current.add(event.key);
    console.log(`[KeyControls] Key pressed: ${event.key}`);
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    activeKeys.current.delete(event.key);
    console.log(`[KeyControls] Key released: ${event.key}`);
  };

  // Calculate rotational velocity based on active keys
  const calculateVelocity = () => {
    let velocityX = 0;
    let velocityY = 0;

    if (activeKeys.current.has('ArrowUp') || activeKeys.current.has('w')) {
      velocityX -= rotationSpeed; // Rotate up
    }
    if (activeKeys.current.has('ArrowDown') || activeKeys.current.has('s')) {
      velocityX += rotationSpeed; // Rotate down
    }
    if (activeKeys.current.has('ArrowLeft') || activeKeys.current.has('a')) {
      velocityY -= rotationSpeed; // Rotate left
    }
    if (activeKeys.current.has('ArrowRight') || activeKeys.current.has('d')) {
      velocityY += rotationSpeed; // Rotate right
    }

    return { x: velocityX, y: velocityY };
  };

  // Add global event listeners for keyboard events
  useEffect(() => {
    console.log('[KeyControls] Adding keyboard event listeners.');
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      console.log('[KeyControls] Removing keyboard event listeners.');
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return {
    calculateVelocity
  };
};

export default useKeyControls;
