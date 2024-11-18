// src/components/Storyfall/Storyfall.jsx

// React imports
import { useState, useEffect, useCallback, useRef } from 'react';
// Pixi imports
import { Stage, Container, Graphics } from '@pixi/react';
// Hook imports
import useGameLoop from '../../utils/hooks/useGameLoop';
import useInputHandler from '../../utils/hooks/useInputHandler';
// Component imports
import Player from './Player';
import Starfield from './Starfield';

/**
 * Storyfall game component.
 * Sets up the main game loop and player positioning.
 *
 * @component
 * @returns {JSX.Element} The rendered Storyfall game component.
 */
const Storyfall = () => {
  // State for rendering dimensions
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 400
  });

  // Ref for maintaining dimensions in logic
  const canvasDimensionsRef = useRef({ ...canvasSize });

  const playAreaWidth = useRef(canvasDimensionsRef.current.width / 3);

  // State to track border blink
  const [borderBlink, setBorderBlink] = useState({ left: false, right: false });

  const blinkTimerRef = useRef({ left: null, right: null }); // Timers for blinking

  // Player state
  const [player, setPlayer] = useState({
    position: {
      x: canvasDimensionsRef.current.width / 2,
      y: canvasDimensionsRef.current.height - 50
    },
    velocity: { x: 0, y: 0 }
  });

  const speed = 5;

  // Keyboard input
  const handleKeyDown = useCallback(
    (key) => {
      if (key === 'ArrowLeft') {
        setPlayer((prev) => ({
          ...prev,
          velocity: { x: -speed, y: 0 }
        }));
      } else if (key === 'ArrowRight') {
        setPlayer((prev) => ({
          ...prev,
          velocity: { x: speed, y: 0 }
        }));
      }
    },
    [speed]
  );

  const handleKeyUp = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      velocity: { x: 0, y: 0 }
    }));
  }, []);

  useInputHandler(handleKeyDown, handleKeyUp);

  // Border blinking
  const startBlinking = useCallback((side) => {
    if (blinkTimerRef.current[side]) return; // Prevent multiple timers
    setBorderBlink((prev) => ({ ...prev, [side]: true }));
    blinkTimerRef.current[side] = setInterval(() => {
      setBorderBlink((prev) => ({ ...prev, [side]: !prev[side] }));
    }, 100); // Blinking interval
  }, []);

  const stopBlinking = useCallback((side) => {
    clearInterval(blinkTimerRef.current[side]);
    blinkTimerRef.current[side] = null;
    setBorderBlink((prev) => ({ ...prev, [side]: false }));
  }, []);

  // game loop updates
  const update = useCallback(() => {
    const { width } = canvasDimensionsRef.current;
    const playAreaXStart = (width - playAreaWidth.current) / 2; // Start of the play area
    const playAreaXEnd = playAreaXStart + playAreaWidth.current; // End of the play area

    setPlayer((prev) => {
      const newPositionX = prev.position.x + prev.velocity.x;

      // border blink triggers
      if (newPositionX <= playAreaXStart + 20) {
        startBlinking('left');
      } else {
        stopBlinking('left');
      }

      if (newPositionX >= playAreaXEnd - 20) {
        startBlinking('right');
      } else {
        stopBlinking('right');
      }

      return {
        ...prev,
        position: {
          x: Math.max(playAreaXStart + 20, Math.min(playAreaXEnd - 20, newPositionX)),
          y: prev.position.y
        }
      };
    });
  }, [startBlinking, stopBlinking]);

  // Handle canvas resizing
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight - 400;

      setCanvasSize({ width: newWidth, height: newHeight });
      canvasDimensionsRef.current = { width: newWidth, height: newHeight };
      playAreaWidth.current = newWidth / 3; // Update play area
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize game loop
  useGameLoop(update);

  return (
    <Stage width={canvasSize.width} height={canvasSize.height}>
      <Starfield
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
        playAreaWidth={playAreaWidth.current}
      />
      <Container>
        {/* Draw play area borders */}
        <Graphics
          draw={(g) => {
            const playAreaXStart = (canvasDimensionsRef.current.width - playAreaWidth.current) / 2;
            const playAreaXEnd = playAreaXStart + playAreaWidth.current;

            g.clear();

            // Left border
            g.lineStyle(2, borderBlink.left ? 0x000000 : 0x00ff00); // Red if blinking, green otherwise
            g.moveTo(playAreaXStart, player.position.y + 40);
            g.lineTo(playAreaXStart, player.position.y - 45);

            // Right border
            g.lineStyle(2, borderBlink.right ? 0x000000 : 0x00ff00); // Red if blinking, green otherwise
            g.moveTo(playAreaXEnd, player.position.y + 40);
            g.lineTo(playAreaXEnd, player.position.y - 45);
          }}
        />
        <Player player={player} />
      </Container>
    </Stage>
  );
};

export default Storyfall;
