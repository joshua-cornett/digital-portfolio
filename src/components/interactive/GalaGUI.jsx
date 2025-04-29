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

      return {
        scale: hoveredItem?.id === options[index]?.id ? 2 : 1,
        intensity: hoveredItem?.id === options[index]?.id ? intensity * 2 : intensity
      };
    });
  }, [hoveredItem, options, camera, api]);

  useSynchronizedRenderLoop(() => {
    groupRef.current?.updateMatrixWorld();
  });

  useFrame(() => {
    applyFrameUpdates();
    textRefs.current.forEach((ref, index) => {
      const mesh = meshRefs.current[index];
      if (ref && mesh) {
        // Get node's world position
        const nodeWorldPos = new THREE.Vector3();
        mesh.getWorldPosition(nodeWorldPos);

        // Direction from node to camera in world space
        const nodeToCamera = camera.position.clone().sub(nodeWorldPos).normalize();

        // Convert this direction to the node's local space
        const nodeWorldQuat = mesh.getWorldQuaternion(new THREE.Quaternion());
        const invNodeWorldQuat = nodeWorldQuat.clone().invert();
        const localDir = nodeToCamera.clone().applyQuaternion(invNodeWorldQuat);

        // Set text's local position to be offset in that direction
        const offset = 0.5;
        ref.position.set(localDir.x * offset, localDir.y * offset, localDir.z * offset);

        // Upright billboard
        const worldPos = new THREE.Vector3();
        ref.getWorldPosition(worldPos);
        const camPos = camera.position.clone();
        camPos.y = worldPos.y;
        ref.lookAt(camPos);
      }
    });
  });

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      {springs.map((spring, index) => {
        const pos = new THREE.Vector3(...options[index].position);
        const offset = 0.5;
        const cameraPos = camera.position;
        const nodeToCamera = cameraPos.clone().sub(pos).normalize();
        const labelPos = pos.clone().add(nodeToCamera.multiplyScalar(offset));
        const otherMeshes = meshRefs.current.filter(
          (ref, i) => i !== index && ref && typeof ref === 'object' && ref.isObject3D
        );
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
              <sphereGeometry args={[0.15, 32, 32]} />
              <a.meshBasicMaterial
                color={spring.intensity.to((i) => `hsl(120, 100%, ${i * 50 + 20}%)`)}
                toneMapped={false}
              />
              <Text
                position={[0, 0, 0.5]}
                fontSize={0.05}
                color="#fff"
                font="/fonts/PressStart2P-Regular.ttf"
                anchorX="center"
                anchorY="middle"
                ref={(ref) => (textRefs.current[index] = ref)}
              >
                {options[index].title}
              </Text>
            </a.mesh>
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
                    linewidth: 1
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
