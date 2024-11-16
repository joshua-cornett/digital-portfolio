// React imports
import { useState, useEffect, useRef } from 'react';
// Pixi imports
import { Sprite, Stage, Container } from '@pixi/react';
// Component imports
import Ship from './Ship';

/**
 * AboutAsteroids component renders an Asteroids-like game interface.
 * Includes a controllable ship that moves, rotates, and fires bullets based on user input.
 *
 * @component
 * @returns {JSX.Element} The rendered AboutAsteroids game component.
 */
const AboutAsteroids = () => {
  const [shipState, setShipState] = useState({
    position: { x: 400, y: 300 },
    rotation: 0,
    velocity: { x: 0, y: 0 }
  });

  // bullet constants
  /** @TODO - consider abstracting away bullets as their own components like ship */
  const [bullets, setBullets] = useState([]);
  const activeKeys = useRef(new Set());
  const lastFireTime = useRef(0); // Track the last fire time
  const bulletSpeed = 4;
  const bulletLifespan = 90; // Lifespan in frames (~2 seconds at 60 FPS)
  const fireRate = 150; // Minimum time between bullets in milliseconds (e.g., 300ms)

  //ship constants
  const thrust = 0.05; // Thrust strength
  const rotationSpeed = 0.05; // Rotation speed
  const friction = 0.99; // Friction factor for inertia
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Helper function to calculate the new state
  const calculateNewState = ({ position, velocity, rotation }, action) => {
    let newRotation = rotation;
    let newVelocity = { ...velocity };

    // Process active keys
    if (action === 'thrust' || activeKeys.current.has('ArrowUp')) {
      newVelocity.x += Math.cos(rotation) * thrust;
      newVelocity.y += Math.sin(rotation) * thrust;
    }
    if (action === 'rotateLeft' || activeKeys.current.has('ArrowLeft')) {
      newRotation -= rotationSpeed;
    }
    if (action === 'rotateRight' || activeKeys.current.has('ArrowRight')) {
      newRotation += rotationSpeed;
    }

    // Apply velocity to position
    const newPosition = {
      x: (position.x + newVelocity.x + canvasWidth) % canvasWidth,
      y: (position.y + newVelocity.y + canvasHeight) % canvasHeight
    };

    // Apply friction
    newVelocity.x *= friction;
    newVelocity.y *= friction;

    return {
      position: newPosition,
      rotation: newRotation,
      velocity: newVelocity
    };
  };

  // Function to handle bullet firing
  const shootBullet = (currentShipState) => {
    const now = performance.now();
    if (now - lastFireTime.current < fireRate) {
      // Skip if firing too soon
      return;
    }

    lastFireTime.current = now; // Update last fire time
    setBullets((prevBullets) => {
      const { position, rotation } = currentShipState;

      console.log('Firing bullet with:');
      console.log('Ship position:', position);
      console.log('Ship rotation:', rotation);

      const newBullet = {
        position: { x: position.x, y: position.y },
        velocity: {
          x: Math.cos(rotation) * bulletSpeed,
          y: Math.sin(rotation) * bulletSpeed
        },
        rotation,
        lifespan: bulletLifespan // Initialize lifespan
      };

      console.log('New bullet:', newBullet);

      return [...prevBullets, newBullet];
    });
  };

  // Game loop for continuous updates
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 16.67; // Normalize to ~60 FPS
      lastTime = now;

      console.log('Game loop delta:', delta);

      setShipState((prev) => calculateNewState(prev, null));

      // Update bullets
      setBullets((prevBullets) => {
        const updatedBullets = prevBullets
          .map((bullet) => {
            const newPosition = {
              x: (bullet.position.x + bullet.velocity.x + canvasWidth) % canvasWidth,
              y: (bullet.position.y + bullet.velocity.y + canvasHeight) % canvasHeight
            };
            return {
              ...bullet,
              position: newPosition,
              lifespan: bullet.lifespan - 1 // Reduce lifespan each frame
            };
          })
          .filter((bullet) => bullet.lifespan > 0);
        console.log('Updated Bullets:', updatedBullets);
        return updatedBullets;
      });

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => cancelAnimationFrame(gameLoop);
  }, []);

  // Handle keydown and keyup events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        shootBullet(shipState);
      } else {
        activeKeys.current.add(e.key);
      }
    };

    const handleKeyUp = (e) => {
      activeKeys.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shipState]);

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Container position={[0, 0]}>
        <Ship position={shipState.position} rotation={shipState.rotation} />
        {bullets.map((bullet, index) => (
          <Sprite
            key={index}
            x={bullet.position.x}
            y={bullet.position.y}
            image="./AboutAsteroids/bullet.png"
            rotation={bullet.rotation}
          />
        ))}
      </Container>
    </Stage>
  );
};

export default AboutAsteroids;
