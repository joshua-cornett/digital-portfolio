import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStars } from '@hooks';

import styles from './Starfield.module.css';

/**
 * Starfield component to render a dynamic star background.
 */
const Starfield = () => {
  const starsRef = useRef();
  const width = 1920; // Static test values
  const height = 1080;
  const density = 0.001;

  const positions = useStars(width, height, density);

  console.log('Starfield positions:', positions);

  // Optional: Add animation or rotation
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.001; // Simple rotation
    }
  });

  return (
    <points ref={starsRef} className={styles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(positions)}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={0x00ff00} size={0.5} />
    </points>
  );
};

export default Starfield;
