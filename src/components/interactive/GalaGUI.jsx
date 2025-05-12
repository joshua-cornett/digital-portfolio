import { useGalaGUI, useSynchronizedRenderLoop } from '@hooks';
import { a, useSprings } from '@react-spring/three';
import { Text } from '@react-three/drei';
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
  const textRefs = useRef([]);

  const options = useGalaGUIStore((state) => state.options);
  const hoveredItem = useGalaGUIStore((state) => state.hoveredItem);

  const [springs, api] = useSprings(options.length, (index) => ({
    scale: 1,
    intensity: 1,
    glowOpacity: 0,
    config: { mass: 0.25, tension: 1000, friction: 10 }
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

      const isHovered = hoveredItem?.id === options[index]?.id;
      return {
        scale: isHovered ? 2 : 1,
        intensity: isHovered ? 2 : 1,
        glowOpacity: isHovered ? 0.4 : 0.1
      };
    });
  }, [hoveredItem, options, api]);

  useSynchronizedRenderLoop(() => {
    groupRef.current?.updateMatrixWorld();
  });

  useFrame(() => {
    applyFrameUpdates();
    textRefs.current.forEach((ref, index) => {
      const mesh = meshRefs.current[index];
      if (ref && mesh) {
        // Get the parent group of the text (which should be the group we added)
        const textGroup = ref.parent;
        if (!textGroup) return;

        // Make the text group face the camera
        const worldPos = new THREE.Vector3();
        textGroup.getWorldPosition(worldPos);
        const camPos = camera.position.clone();
        camPos.y = worldPos.y; // Keep y-level consistent for upright text
        textGroup.lookAt(camPos);
      }
    });
  });

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      {springs.map((spring, index) => {
        const pos = new THREE.Vector3(...options[index].position);

        return (
          <React.Fragment key={options[index].id}>
            {/* Main interactive node */}
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
              {/* Node visual elements group */}
              <group>
                {/* Outer glow sphere */}
                <mesh scale={1}>
                  <sphereGeometry args={[0.15, 32, 32]} />
                  <meshBasicMaterial
                    color="#00ff00"
                    transparent
                    opacity={hoveredItem?.id === options[index].id ? 0.5 : 0.1}
                    toneMapped={false}
                  />
                </mesh>
                {/* Main sphere with hover effect */}
                <mesh>
                  <sphereGeometry args={[0.15, 32, 32]} />
                  <meshBasicMaterial
                    color="#00ff00"
                    transparent
                    opacity={hoveredItem?.id === options[index].id ? 0.5 : 0.1}
                    toneMapped={false}
                  />
                </mesh>
                {/* Inner core sphere */}
                <mesh scale={0.7}>
                  <sphereGeometry args={[0.15, 32, 32]} />
                  <meshBasicMaterial
                    color="#00ff00"
                    transparent
                    opacity={hoveredItem?.id === options[index].id ? 1 : 0.1}
                    toneMapped={false}
                  />
                </mesh>
              </group>
              {/* Text label group */}
              <group>
                {/* Text background plane */}
                <mesh position={[0, -0.25, -0.015]} scale={[1.6, 0.6, 1]}>
                  <planeGeometry args={[0.45, 0.2]} />
                  <meshBasicMaterial
                    color="#0a0"
                    toneMapped={false}
                    opacity={hoveredItem?.id === options[index].id ? 0.75 : 0}
                    transparent
                  />
                </mesh>
                {/* Text label */}
                <Text
                  position={[0, -0.25, 0]}
                  toneMapped={false}
                  fontSize={0.075}
                  color="#fff"
                  font="fonts/PressStart2P-Regular.ttf"
                  anchorX="center"
                  anchorY="middle"
                  ref={(ref) => (textRefs.current[index] = ref)}
                  transparent
                  opacity={hoveredItem?.id === options[index].id ? 1 : 0.33}
                >
                  {options[index].title}
                </Text>
              </group>
            </a.mesh>
            {/* Connection line to center */}
            <primitive
              object={
                new THREE.Line(
                  new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(...options[index].position)
                  ]),
                  new THREE.LineBasicMaterial({
                    color: 0x00ff00,
                    toneMapped: false,
                    opacity: hoveredItem?.id === options[index].id ? 1 : 0.15,
                    transparent: true
                  })
                )
              }
            />
          </React.Fragment>
        );
      })}
    </group>
  );
};

export default GalaGUI;
