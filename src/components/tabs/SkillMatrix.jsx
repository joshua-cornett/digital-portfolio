// src/components/SkillMatrix.jsx

// React imports
import { useEffect, useRef, useState } from 'react';

// Three.js imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * SkillMatrix component creates a 3D radial selection UI for navigating skills and experiences.
 *
 * @component
 * @returns {JSX.Element} The rendered SkillMatrix component.
 */
const SkillMatrix = () => {
  const mountRef = useRef(null);

  // Constants
  const rotationSpeed = 0.0005;
  const dampingFactor = 0.98;
  const distance = 10;

  // State to toggle between keyboard and mouse control modes
  const [controlMode, setControlMode] = useState('keyboard'); // 'keyboard' or 'mouse'

  useEffect(() => {
    const scene = new THREE.Scene();

    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    // Create a perspective camera
    const camera = new THREE.PerspectiveCamera(
      95,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    cameraGroup.add(camera);

    // Initialization
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create a group to contain the skill nodes and connecting lines
    const skillsGroup = new THREE.Group();
    scene.add(skillsGroup);

    // Configure the spherical layout for skill nodes
    const radius = 5;
    const numItems = 12;
    const items = [];

    // Position skill items on a spherical surface
    for (let i = 0; i < numItems; i++) {
      const theta = Math.acos(1 - (2 * (i + 1)) / numItems); // Calculate polar angle
      const phi = Math.sqrt(numItems * Math.PI) * theta; // Calculate azimuthal angle

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      // Create a small sphere to represent each skill item
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const itemMesh = new THREE.Mesh(geometry, material);

      itemMesh.position.set(x, y, z);
      skillsGroup.add(itemMesh);
      items.push(itemMesh);
    }

    // Draw lines connecting each item to the center
    for (const item of items) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        item.position
      ]);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const line = new THREE.Line(lineGeometry, lineMaterial);

      skillsGroup.add(line);
    }

    // State and velocity for keyboard rotation control
    const keysPressed = new Set();
    const rotationVelocity = { x: 0, y: 0 };

    // Handle keydown and keyup events to track keyboard inputs
    const handleKeyDown = (event) => {
      keysPressed.add(event.key.toLowerCase());
    };

    const handleKeyUp = (event) => {
      keysPressed.delete(event.key.toLowerCase());
    };

    // Function: Apply keyboard rotations with momentum
    const applyKeyboardRotations = () => {
      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        rotationVelocity.x += rotationSpeed;
      }
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        rotationVelocity.x -= rotationSpeed;
      }
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        rotationVelocity.y += rotationSpeed;
      }
      if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        rotationVelocity.y -= rotationSpeed;
      }

      // Apply the rotation to the camera group
      cameraGroup.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotationVelocity.x);
      cameraGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationVelocity.y);

      // Apply damping to gradually reduce velocity
      rotationVelocity.x *= dampingFactor;
      rotationVelocity.y *= dampingFactor;
    };

    // Configure mouse controls (OrbitControls) if in mouse control mode
    let orbitControls;
    if (controlMode === 'mouse') {
      orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.enableDamping = true; // Smooth dragging
      orbitControls.dampingFactor = 0.01;
      orbitControls.rotateSpeed = 1; // Set rotate speed for smoother control
      orbitControls.enableZoom = false;
      orbitControls.enablePan = false;
    }

    // Event listeners for keyboard controls
    if (controlMode === 'keyboard') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    // Animation loop
    const animate = () => {
      if (controlMode === 'keyboard') {
        applyKeyboardRotations();
      } else if (orbitControls) {
        orbitControls.update();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      if (orbitControls) orbitControls.dispose();
      renderer.dispose();

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, [controlMode]);

  return (
    <div>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      {/* Controls toggle */}
      <button
        onClick={() => setControlMode(controlMode === 'keyboard' ? 'mouse' : 'keyboard')}
        style={{
          position: 'absolute',
          top: '300px',
          left: '10px',
          padding: '10px',
          background: '#00ff00',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Switch to {controlMode === 'keyboard' ? 'Mouse' : 'Keyboard'} Controls
      </button>
    </div>
  );
};

export default SkillMatrix;
