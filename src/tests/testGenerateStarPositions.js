// Import the function
import { generateStarPositions } from '../helpers/starBackgroundHelper.js';

// Test data
const width = 1920;
const height = 1080;
const density = 0.001;

// Run the function and log the output
const positions = generateStarPositions(width, height, density);

export default positions;
