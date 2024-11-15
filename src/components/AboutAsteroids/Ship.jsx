// src/components/AboutAsteroids/Ship.jsx
import React from 'react';
import { Sprite } from '@pixi/react';

/**
 * Ship component for rendering the player's spaceship.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.position - The current position of the ship.
 * @param {number} props.rotation - The current rotation of the ship (in radians).
 * @returns {JSX.Element} The rendered Ship component.
 */
const Ship = ({ position, rotation }) => {
  return (
    <Sprite
      anchor={0.5}
      x={position.x}
      y={position.y}
      rotation={rotation}
      image="./AboutAsteroids/ship.png"
    />
  );
};

export default Ship;
