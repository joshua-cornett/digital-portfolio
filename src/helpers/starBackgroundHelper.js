// src/helpers/starBackgroundHelper.js

/**
 * Generates star positions based on the given width, height, and density.
 *
 * @param {number} width - Width of the starfield area.
 * @param {number} height - Height of the starfield area.
 * @param {number} density - Number of stars per unit area.
 * @returns {number[]} Array of star positions in [x, y, z] format.
 */
export const generateStarPositions = (width, height, density = 0.0001) => {

  const numStars = Math.floor(width * height * density); // Calculate total stars

  const positions = [];
  for (let i = 0; i < numStars; i++) {
    positions.push(
      (Math.random() - 0.5) * width, // x position, centered around 0
      (Math.random() - 0.5) * height, // y position, centered around 0
      Math.random() * -50 // z position for depth (behind the camera)
    );
  }

  return positions; // Array of [x, y, z, x, y, z, ...]
};
