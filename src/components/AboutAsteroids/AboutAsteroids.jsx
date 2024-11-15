// React imports
import { useState, useEffect, useRef } from 'react';
// AboutAsteroids imports
import Ship from './Ship';
// Pixi imports
import { Stage } from '@pixi/react';

/**
 * AboutAsteroids component renders an Asteroids-like game interface.
 * Includes a controllable ship that moves and rotates based on user input.
 *
 * @component
 * @returns {JSX.Element} The rendered AboutAsteroids game component.
 */
const AboutAsteroids = () => {
  // State to manage the ship's position, rotation, and velocity
  const [shipState, setShipState] = useState({
    position: { x: 400, y: 300 }, // Initial position
    rotation: 0, // Initial rotation in radians
    velocity: { x: 0, y: 0 } // Initial velocity
  });

  const gameLoopRef = useRef();

  const thrust = 0.1; // Thrust strength
  const rotationSpeed = 0.1; // Rotation speed
  const friction = 0.99; // Friction factor for inertia
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Helper function to calculate the new state
  const calculateNewState = ({ position, velocity, rotation }, action) => {
    let newRotation = rotation;
    let newVelocity = { ...velocity };
    let newPosition = { ...position };

    // Apply action-based updates
    switch (action) {
      case 'thrust':
        newVelocity.x += Math.cos(rotation) * thrust;
        newVelocity.y += Math.sin(rotation) * thrust;
        break;
      case 'rotateLeft':
        newRotation -= rotationSpeed;
        break;
      case 'rotateRight':
        newRotation += rotationSpeed;
        break;
      default:
        break;
    }

    // Update position based on velocity
    newPosition = {
      x: (newPosition.x + newVelocity.x + canvasWidth) % canvasWidth,
      y: (newPosition.y + newVelocity.y + canvasHeight) % canvasHeight
    };

    // Apply friction to velocity
    newVelocity = {
      x: newVelocity.x * friction,
      y: newVelocity.y * friction
    };

    return { position: newPosition, rotation: newRotation, velocity: newVelocity };
  };

  // Callback to handle input and update the ship's state
  const handleInput = (action) => {
    setShipState((prev) => calculateNewState(prev, action));
  };

  /**
   * Game loop for continuous updates
   */
  const update = () => {
    setShipState((prev) => calculateNewState(prev, null)); // Apply inertia and movement
    gameLoopRef.current = requestAnimationFrame(update); // Schedule the next frame
  };

  useEffect(() => {
    // Start the game loop
    gameLoopRef.current = requestAnimationFrame(update);

    // Cleanup the game loop on unmount
    return () => {
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Ship position={shipState.position} rotation={shipState.rotation} onUpdate={handleInput} />
    </Stage>
  );
};

export default AboutAsteroids;
