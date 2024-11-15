// React imports
import { useState } from 'react';
// AboutAsteroids imports
import Ship from './Ship';
// Pixi imports
import { Stage, Container } from '@pixi/react';

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

  /**
   * Updates the ship's position, rotation, and velocity based on user actions.
   * Handles thrust, rotation, and friction effects.
   *
   * @param {string} action - The action to perform ('thrust', 'rotateLeft', 'rotateRight').
   */
  const updateShipState = (action) => {
    setShipState((prev) => {
      const { position, rotation, velocity } = prev;

      // Game physics constants
      const thrust = 0.1; // Thrust strength
      const rotationSpeed = 0.1; // Rotation speed in radians
      const friction = 0.98; // Friction factor to simulate inertia

      let newRotation = rotation;
      let newVelocity = { ...velocity };
      let newPosition = { ...position };

      switch (action) {
        case 'thrust':
          console.log('Thrusting forward');
          newVelocity = {
            x: velocity.x + Math.cos(rotation) * thrust,
            y: velocity.y + Math.sin(rotation) * thrust
          };
          break;
        case 'rotateLeft':
          console.log('Rotating left');
          newRotation -= rotationSpeed;
          break;
        case 'rotateRight':
          console.log('Rotating right');
          newRotation += rotationSpeed;
          break;
        default:
          console.log('Unknown action:', action);
          break;
      }

      // Apply movement and wrapping logic
      newPosition = {
        x: (newPosition.x + newVelocity.x + 800) % 800, // Wrap horizontally
        y: (newPosition.y + newVelocity.y + 600) % 600 // Wrap vertically
      };

      // Apply friction to velocity
      newVelocity.x *= friction;
      newVelocity.y *= friction;

      return {
        position: newPosition,
        rotation: newRotation,
        velocity: newVelocity
      };
    });
  };

  return (
    <Stage width={800} height={600} interactive={'auto'}>
      <Container>
        <Ship
          position={shipState.position}
          rotation={shipState.rotation}
          onUpdate={updateShipState}
        />
      </Container>
    </Stage>
  );
};

export default AboutAsteroids;
