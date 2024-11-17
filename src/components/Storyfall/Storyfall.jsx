// src/components/Storyfall/Storyfall.jsx
import React, { useState, useCallback } from 'react';
import { Stage, Container } from '@pixi/react';
import useGameLoop from '../../utils/hooks/useGameLoop';
import Player from './Player';

/**
 * Storyfall game component.
 * Sets up the main game loop and player positioning.
 *
 * @component
 * @returns {JSX.Element} The rendered Storyfall game component.
 */
const Storyfall = () => {
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Player state
  const [player, setPlayer] = useState({
    position: { x: canvasWidth / 2, y: canvasHeight - 50 },
    velocity: { x: 0, y: 0 }
  });

  // Update function for game loop
  const update = useCallback(() => {
    // Placeholder for now: Ensure the player remains in position
    setPlayer((prev) => ({
      ...prev,
      position: {
        x: Math.max(0, Math.min(canvasWidth, prev.position.x + prev.velocity.x)),
        y: prev.position.y
      }
    }));
  }, [canvasWidth]);

  // Initialize game loop
  useGameLoop(update);

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Container>
        <Player player={player} />
      </Container>
    </Stage>
  );
};

export default Storyfall;
