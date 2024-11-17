// src/components/Storyfall/Player.jsx

// React imports
import React from 'react';
// Pixi imports
import { Sprite } from '@pixi/react';
// Asset imports
import playerImage from '../../assets/Storyfall/ship.png';

/**
 * Player component representing the player's ship in the game.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.player - Player state including position and velocity.
 * @returns {JSX.Element} The rendered Player component.
 */
const Player = ({ player }) => {
  return <Sprite x={player.position.x} y={player.position.y} image={playerImage} anchor={0.5} />;
};

export default Player;
