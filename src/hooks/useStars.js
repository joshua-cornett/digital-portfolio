// src/hooks/useStars.js

// React imports
import { useMemo } from 'react';
// Helper imports
import { generateStarPositions } from '@helpers';

/**
 * Custom hook for generating star positions dynamically using memoization.
 *
 * @param {number} width - Width of the viewport or play area.
 * @param {number} height - Height of the viewport or play area.
 * @param {number} density - Number of stars per unit area.
 * @returns {number[]} Array of star positions in [x, y, z] format.
 */

const useStars = (width = 1920, height = 1080, density = 0.001) => {
  console.log('useStars called with:', { width, height, density });

  return useMemo(() => {
    console.log('Calculating star positions...');
    const positions = generateStarPositions(width, height, density);
    console.log('Memoized positions:', positions);
    return positions;
  }, [width, height, density]); // Recalculates when dependencies change
};

export default useStars;
