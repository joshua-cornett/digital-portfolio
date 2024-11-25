import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSynchronizedRenderLoop } from '@hooks';
import useInputHandler from '@hooks/useInputHandler';

/**
 * GalaGUI component creates a 3D radial selection UI with enhanced controls.
 *
 * @component
 * @returns {JSX.Element} The rendered GalaGUI component.
 */
const GalaGUI = () => {
  const groupRef = useRef();
  const rotationVelocity = useRef(new THREE.Vector3(0, 0, 0)); // Velocity for rotations
  const quaternion = useRef(new THREE.Quaternion()); // Maintain consistent rotation using quaternions
  const dragMomentum = useRef(new THREE.Vector3(0, 0, 0)); // Momentum for smooth drag transitions
  const isDragging = useRef(false); // Whether dragging is active
  const initialPointerLock = useRef(false); // Track initial pointer lock

  // Constants for controls
  const keyboardRotationSpeed = 0.03; // Strength for keyboard input
  const pointerRotationSpeed = 0.002; // Strength for drag
  const dampingFactor = 0.9; // Smooth momentum decay

  // Handle simultaneous key presses
  const activeKeys = useInputHandler(
    (key) => {}, // No specific action needed on key down
    (key) => {} // No specific action needed on key up
  );

  // Populate items in a spherical layout
  useEffect(() => {
    if (!groupRef.current) return;

    const radius = 2.5;
    const numItems = 12;

    for (let i = 0; i < numItems; i++) {
      const theta = Math.acos(1 - (2 * (i + 1)) / numItems);
      const phi = Math.sqrt(numItems * Math.PI) * theta;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        sphere.position
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const line = new THREE.Line(lineGeometry, lineMaterial);

      groupRef.current.add(sphere);
      groupRef.current.add(line);
    }
  }, []);

  // Handle pointer down (start drag)
  const handlePointerDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'none';
    initialPointerLock.current = true;

    // Lock the pointer for the drag
    document.addEventListener('mousemove', handlePointerMove, { passive: false });
    document.addEventListener('mouseup', handlePointerUp, { passive: false });
  };

  // Handle pointer move (dragging)
  const handlePointerMove = (event) => {
    if (isDragging.current) {
      const deltaX = event.movementX || 0; // Relative movement from pointer lock
      const deltaY = event.movementY || 0;

      rotationVelocity.current.y += deltaX * pointerRotationSpeed;
      rotationVelocity.current.x += deltaY * pointerRotationSpeed;

      dragMomentum.current.set(
        deltaY * pointerRotationSpeed,
        deltaX * pointerRotationSpeed,
        0 // No Z-axis drag rotation
      );

      event.preventDefault();
    }
  };

  // Handle pointer up (end drag)
  const handlePointerUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'default';

    // Unlock the pointer and remove event listeners
    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('mouseup', handlePointerUp);
  };

  // Register GalaGUI's render function with the synchronized render loop
  useSynchronizedRenderLoop(() => {
    groupRef.current?.updateMatrixWorld();
  });

  // Animation loop for rotation, inertia, and damping
  useFrame(() => {
    if (!groupRef.current) return;

    // Apply key presses to rotation velocity
    if (activeKeys.has('w') || activeKeys.has('arrowup')) {
      rotationVelocity.current.x -= keyboardRotationSpeed;
    }
    if (activeKeys.has('s') || activeKeys.has('arrowdown')) {
      rotationVelocity.current.x += keyboardRotationSpeed;
    }
    if (activeKeys.has('a') || activeKeys.has('arrowleft')) {
      rotationVelocity.current.y -= keyboardRotationSpeed;
    }
    if (activeKeys.has('d') || activeKeys.has('arrowright')) {
      rotationVelocity.current.y += keyboardRotationSpeed;
    }
    if (activeKeys.has('q')) {
      rotationVelocity.current.z -= keyboardRotationSpeed;
    }
    if (activeKeys.has('e')) {
      rotationVelocity.current.z += keyboardRotationSpeed;
    }

    // Apply drag momentum and keyboard velocities
    quaternion.current.setFromEuler(
      new THREE.Euler(
        rotationVelocity.current.x,
        rotationVelocity.current.y,
        rotationVelocity.current.z
      )
    );
    groupRef.current.quaternion.multiplyQuaternions(
      quaternion.current,
      groupRef.current.quaternion
    );

    // Decay rotation velocity smoothly
    rotationVelocity.current.multiplyScalar(dampingFactor);

    // Apply drag momentum
    if (!isDragging.current) {
      dragMomentum.current.multiplyScalar(dampingFactor);
    }
  });

  return <group ref={groupRef} position={[0, 0, 0]} onPointerDown={handlePointerDown} />;
};

export default GalaGUI;
