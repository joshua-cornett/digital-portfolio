// src/components/AboutAsteroids.jsx

import { useState, useEffect, useRef } from 'react';
import Ship from './Ship';
import { Stage, Container } from '@pixi/react';

/**
 * AboutAsteroids component renders an Asteroids-like game interface.
 * Includes a controllable ship that moves and rotates based on user input.
 *
 * @component
 * @returns {JSX.Element} The rendered AboutAsteroids game component.
 */
const AboutAsteroids = () => {
  /**
   * State to manage the ship's position, rotation, and velocity.
   * @typedef {Object} ShipState
   * @property {Object} position - The current position of the ship.
   * @property {number} position.x - X-coordinate of the ship's position.
   * @property {number} position.y - Y-coordinate of the ship's position.
   * @property {number} rotation - The current rotation of the ship in radians.
   * @property {Object} velocity - The current velocity of the ship.
   * @property {number} velocity.x - X-component of the ship's velocity.
   * @property {number} velocity.y - Y-component of the ship's velocity.
   */
  const [shipState, setShipState] = useState({
    position: { x: 400, y: 300 },
    rotation: 0,
    velocity: { x: 0, y: 0 }
  });

  // Ref to track currently active keys
  const activeKeys = useRef(new Set());

  /**
   * Updates the ship's state based on active input, velocity, and friction.
   * @param {number} delta - Time difference normalized to ~60 FPS.
   */
  const updateShipState = (delta) => {
    setShipState((prev) => {
      const { position, rotation, velocity } = prev;

      // Constants for ship physics
      const thrust = 0.1;
      const rotationSpeed = 0.05;
      const friction = 0.99;

      let newRotation = rotation;
      let newVelocity = { ...velocity };

      // Process active keys for movement and rotation
      if (activeKeys.current.has('ArrowUp')) {
        newVelocity.x += Math.cos(rotation) * thrust;
        newVelocity.y += Math.sin(rotation) * thrust;
      }
      if (activeKeys.current.has('ArrowLeft')) {
        newRotation -= rotationSpeed;
      }
      if (activeKeys.current.has('ArrowRight')) {
        newRotation += rotationSpeed;
      }

      // Apply velocity to position
      const newPosition = {
        x: position.x + newVelocity.x * delta,
        y: position.y + newVelocity.y * delta
      };

      // Apply screen wrapping
      newPosition.x = (newPosition.x + 800) % 800; // Canvas width: 800
      newPosition.y = (newPosition.y + 600) % 600; // Canvas height: 600

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

  /**
   * Main game loop for continuous updates.
   */
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 16.67; // Normalize to ~60 FPS
      lastTime = now;

      updateShipState(delta);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => cancelAnimationFrame(gameLoop);
  }, []);

  /**
   * Handles keydown and keyup events to track active keys.
   */
  useEffect(() => {
    const handleKeyDown = (e) => activeKeys.current.add(e.key);
    const handleKeyUp = (e) => activeKeys.current.delete(e.key);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Stage width={800} height={600}>
      <Container position={[0, 0]}>
        <Ship position={shipState.position} rotation={shipState.rotation} />
      </Container>
    </Stage>
  );
};

export default AboutAsteroids;
