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
  const { groupRef, handlePointerDown, applyFrameUpdates } = useGalaGUI({
    pointerRotationSpeed: 0.0003,
    keyboardRotationSpeed: 0.03,
    dampingFactor: 0.97
  });

  // Register GalaGUI's render function with the synchronized render loop
  useSynchronizedRenderLoop(() => {
    groupRef.current?.updateMatrixWorld();
  });

  // Animation loop
  useFrame(() => {
    applyFrameUpdates();
  });

  return <group ref={groupRef} position={[0, 0, 0]} onPointerDown={handlePointerDown} />;
};

export default GalaGUI;
