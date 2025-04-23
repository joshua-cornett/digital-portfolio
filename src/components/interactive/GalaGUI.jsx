import { useGalaGUI, useSynchronizedRenderLoop } from '@hooks';
import { a, useSprings } from '@react-spring/three';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import useGalaGUIStore from '../../stores/useGalaGUIStore';

/**
 * GalaGUI component creates a 3D radial selection UI with enhanced controls.
 *
 * @component
 * @returns {JSX.Element} The rendered GalaGUI component.
 */
const GalaGUI = () => {
  const { camera } = useThree();
  const meshRefs = useRef([]);

  const options = useGalaGUIStore((state) => state.options);
  const hoveredItem = useGalaGUIStore((state) => state.hoveredItem);

  const [springs, api] = useSprings(options.length, (index) => ({
    scale: 1,
    intensity: 1,
    config: { mass: 1, tension: 170, friction: 12 }
  }));

  const { groupRef, handlePointerDown, applyFrameUpdates } = useGalaGUI({
    pointerRotationSpeed: 0.0003,
    keyboardRotationSpeed: 0.03,
    dampingFactor: 0.97,
    meshRefs
  });

  useEffect(() => {
    api.start((index) => {
      const mesh = meshRefs.current[index];
      if (!mesh) return;

      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);

      const distance = camera.position.distanceTo(worldPos);
      const intensity = THREE.MathUtils.clamp(5 / (distance * distance), 0.2, 1.0);
      console.log(index, '→', distance);

      return {
        scale: hoveredItem?.id === options[index]?.id ? 1.5 : 1,
        intensity: hoveredItem?.id === options[index]?.id ? intensity * 4 : intensity
      };
    });
  }, [hoveredItem, options, camera, api]);

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
              <a.meshBasicMaterial
                color={spring.intensity.to((i) => `hsl(120, 100%, ${i * 50 + 20}%)`)}
                toneMapped={false}
              />{' '}
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
