// React imports
import { useRef, useEffect } from 'react';

// Pixi imports
import { useApp, Sprite } from '@pixi/react';

/**
 * Ship component renders the player's spaceship and handles keyboard controls.
 * The ship's state is updated via a callback function provided by the parent.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.position - The current position of the ship ({x, y}).
 * @param {number} props.rotation - The current rotation of the ship (in radians).
 * @param {Function} props.onUpdate - Callback to update the ship's position and rotation.
 * @returns {JSX.Element} The rendered Ship component.
 */
const Ship = ({ position, rotation, onUpdate }) => {
  const shipRef = useRef();

  useEffect(() => {
    // Handle keypress events for controlling the ship
    const handleKeyDown = (event) => {
      if (!shipRef.current) {
        console.log('!shipRef.current');
        return;
      }

      switch (event.key) {
        case 'ArrowUp': // Thrust forward
          console.log('thrust');
          onUpdate('thrust');
          break;
        case 'ArrowLeft': // Rotate left
          console.log('rotateLeft');
          onUpdate('rotateLeft');
          break;
        case 'ArrowRight': // Rotate right
          console.log('rotateRight');
          onUpdate('rotateRight');
          break;
        default:
          console.log('Unmapped key:', event.key);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUpdate]);

  return (
    <Sprite
      anchor={0.5}
      x={position.x} // Horizontal position
      y={position.y} // Vertical position
      rotation={rotation} // Rotation in radians
      image="./AboutAsteroids/ship.png" // Ensure the path to the image is correct
      ref={shipRef}
    />
  );
};

export default Ship;
