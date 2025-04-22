import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useGalaGUIStore from '../../stores/useGalaGUIStore';
import { useGalaGUI, useSynchronizedRenderLoop } from '@hooks';
import { useSprings, a } from '@react-spring/three';
import * as THREE from 'three';

/**
 * GalaGUI component creates a 3D radial selection UI with enhanced controls.
 *
 * @component
 * @returns {JSX.Element} The rendered GalaGUI component.
 */
const GalaGUI = () => {
  const meshRefs = useRef([]);

  const options = useGalaGUIStore((state) => state.options);
  const hoveredItem = useGalaGUIStore((state) => state.hoveredItem);

  const [springs, api] = useSprings(options.length, (index) => ({
    scale: 1,
    config: { mass: 1, tension: 170, friction: 12 }
  }));

  const { groupRef, handlePointerDown, applyFrameUpdates } = useGalaGUI({
    pointerRotationSpeed: 0.0003,
    keyboardRotationSpeed: 0.03,
    dampingFactor: 0.97,
    meshRefs
  });

  useEffect(() => {
    api.start((index) => ({
      scale: hoveredItem?.id === options[index]?.id ? 1.5 : 1
    }));
  }, [hoveredItem, options, api]);

  useSynchronizedRenderLoop(() => {
    groupRef.current?.updateMatrixWorld();
  });

  useFrame(() => {
    console.log('🌀 frame tick');
    applyFrameUpdates();
  });

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      <axesHelper args={[3]} />

      {springs.map((spring, index) => {
        const pos = new THREE.Vector3(...options[index].position);
        return (
          <React.Fragment key={options[index].id}>
            <a.mesh
              position={pos}
              scale={spring.scale}
              userData={{ option: options[index] }}
              ref={(ref) => {
                if (ref) {
                  ref.userData.option = options[index];
                  meshRefs.current[index] = ref;
                }
              }}
            >
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshBasicMaterial color="lime" toneMapped={false} />
            </a.mesh>
            <line>
              <bufferGeometry attach="geometry" setFromPoints={[new THREE.Vector3(0, 0, 0), pos]} />
              <lineBasicMaterial color="lime" toneMapped={false} />
            </line>
          </React.Fragment>
        );
      })}
    </group>
  );
};

export default GalaGUI;
