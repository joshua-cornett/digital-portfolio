import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGalaGUI, useSynchronizedRenderLoop } from '@hooks';

/**
 * GalaGUI component creates a 3D radial selection UI with enhanced controls.
 *
 * @component
 * @returns {JSX.Element} The rendered GalaGUI component.
 */
const GalaGUI = () => {
  // Destructure values from the custom hook
  const { groupRef, handlePointerDown, applyFrameUpdates } = useGalaGUI(0.002, 0.03, 0.9);

  // Register GalaGUI's render function with the synchronized render loop
  useSynchronizedRenderLoop(() => {
    groupRef.current?.updateMatrixWorld();
  });

  // Animation loop for rotation, inertia, and damping
  useFrame(() => {
    applyFrameUpdates();
  });

  return <group ref={groupRef} position={[0, 0, 0]} onPointerDown={handlePointerDown} />;
};

export default GalaGUI;
