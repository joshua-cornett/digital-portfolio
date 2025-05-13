import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStars, useSynchronizedRenderLoop } from '@hooks';

/**
 * OortCloud component for rendering a dynamic starfield background.
 * Stars are evenly distributed and move downward to create a parallax effect.
 *
 * @component
 * @returns {JSX.Element} The OortCloud component.
 */
const OortCloud = () => {
  const pointsRef = useRef();

  // Dynamically calculate star positions using a custom hook
  const width = window.innerWidth;
  const height = window.innerHeight;
  const density = 0.3; // Adjust density as needed for star density
  const positions = useStars(width, height, density);

  // Use the synchronized render loop with the OortCloud render function
  useSynchronizedRenderLoop(() => {
    pointsRef.current?.updateMatrixWorld();
  });

  // Animate stars with downward movement and reset them when off-screen
  useFrame(() => {
    if (!pointsRef.current) return;

    const positionsArray = pointsRef.current.geometry.attributes.position.array;

    for (let i = 1; i < positionsArray.length; i += 3) {
      positionsArray[i] -= 0.02; // Control downward movement speed
      if (positionsArray[i] < -height / 2) {
        positionsArray[i] = height / 2; // Reset to the top of the screen
      }
    }

    // Notify Three.js that positions have been updated
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[0, 0, -15]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(positions)}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial toneMapped={false} color="#0f0" size={0.1} sizeAttenuation={true} />
        {/**Consider removing 'transparent' and 'opacity' properties */}
      </points>
    </group>
  );
};

export default OortCloud;
