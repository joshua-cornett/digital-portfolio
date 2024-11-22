import React, { useRef, useEffect } from 'react';
import { Container, Graphics } from '@pixi/react';

/**
 * Starfield component to render and animate a starry background with hyperspace effect.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {number} props.canvasWidth - Width of the canvas.
 * @param {number} props.canvasHeight - Height of the canvas.
 * @param {number} props.playAreaWidth - Width of the player's movement area.
 * @returns {JSX.Element} The rendered Starfield component.
 */
const Starfield = ({ canvasWidth, canvasHeight, playAreaWidth }) => {
  const starContainerRef = useRef([]);
  const starCount = 300;
  const baseSpeed = 5; // for the farthest stars
  const maxSpeed = 10; // for the nearest stars
  const marginWidth = (canvasWidth - playAreaWidth) / 2; // areas outside play area

  // Generate stars
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * canvasWidth; // span the entire canvas
      const y = Math.random() * canvasHeight;
      const size = Math.random() * 2; // maintain random, but smaller size

      // Calculate distance from the play area for parallax effect
      const distanceFromPlayArea = Math.abs(x - canvasWidth / 2) / (canvasWidth / 80);
      const speed = (maxSpeed - baseSpeed) / (distanceFromPlayArea / 20);
      const brightness = distanceFromPlayArea / 50;

      stars.push({ x, y, size, brightness, speed });
    }
    starContainerRef.current = stars;
  }, [canvasWidth, canvasHeight, marginWidth]);

  // Animate stars
  useEffect(() => {
    const animateStars = () => {
      starContainerRef.current = starContainerRef.current.map((star) => ({
        ...star,
        y: star.y + star.speed > canvasHeight ? 0 : star.y + star.speed // Loop stars to the top if they exit the bottom
      }));
      requestAnimationFrame(animateStars);
    };

    animateStars();

    return () => cancelAnimationFrame(animateStars); // Cleanup
  }, [canvasHeight]);

  return (
    <Container>
      {/** Star drawing */}
      {starContainerRef.current.map((star, index) => (
        <Graphics
          key={index}
          draw={(g) => {
            g.clear();
            g.beginFill(0x00ff00, star.brightness);
            g.drawCircle(star.x, star.y, star.size);
            g.endFill();
          }}
        />
      ))}
    </Container>
  );
};

export default Starfield;
