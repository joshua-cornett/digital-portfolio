// src/components/SkillMatrix.jsx

// React imports
import { useEffect, useRef, useState } from 'react';

// Three.js imports
import * as THREE from 'three';

/**
 * SkillMatrix component creates a 3D radial selection UI for navigating skills and experiences.
 *
 * @component
 * @returns {JSX.Element} The rendered SkillMatrix component.
 */
const SkillMatrix = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const skillsGroupRef = useRef(null);
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const keysPressed = useRef(new Set());
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const previousTouchPosition = useRef({ x: 0, y: 0 });

  // Constants for keyboard and mouse/touch controls
  const keyboardRotationSpeed = 0.001;
  const keyboardDampingFactor = 0.98;
  const mouseTouchRotationSpeed = 0.0003;
  const mouseTouchDampingFactor = 0.95;
  const distance = 10;

  // Track current control mode
  const [controlMode, setControlMode] = useState('keyboard');

  useEffect(() => {
    if (!sceneRef.current) {
      // Initialize scene, camera, renderer, and skills
      sceneRef.current = new THREE.Scene();
      cameraGroupRef.current = new THREE.Group();
      sceneRef.current.add(cameraGroupRef.current);

      const camera = new THREE.PerspectiveCamera(
        95,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, distance);
      cameraGroupRef.current.add(camera);

      rendererRef.current = new THREE.WebGLRenderer();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(rendererRef.current.domElement);

      skillsGroupRef.current = new THREE.Group();
      sceneRef.current.add(skillsGroupRef.current);

      // Populate items in a spherical layout
      const radius = 5;
      const numItems = 12;
      for (let i = 0; i < numItems; i++) {
        const theta = Math.acos(1 - (2 * (i + 1)) / numItems);
        const phi = Math.sqrt(numItems * Math.PI) * theta;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);

        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const itemMesh = new THREE.Mesh(geometry, material);
        itemMesh.position.set(x, y, z);
        skillsGroupRef.current.add(itemMesh);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          itemMesh.position
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        skillsGroupRef.current.add(line);
      }
    }

    // Mouse control functions
    const handleMouseDown = (event) => {
      setControlMode('mouse');
      isDragging.current = true;
      previousMousePosition.current = { x: event.clientX, y: event.clientY };
      rendererRef.current.domElement.style.cursor = 'none'; // Hide cursor on drag
    };

    const handleMouseMove = (event) => {
      if (isDragging.current) {
        const deltaX = event.clientX - previousMousePosition.current.x;
        const deltaY = event.clientY - previousMousePosition.current.y;

        rotationVelocity.current.y += deltaX * mouseTouchRotationSpeed;
        rotationVelocity.current.x += deltaY * mouseTouchRotationSpeed;

        previousMousePosition.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      rendererRef.current.domElement.style.cursor = 'default'; // Show cursor after drag
    };

    // Touch control functions
    const handleTouchStart = (event) => {
      setControlMode('touch');
      if (event.touches.length === 1) {
        // Only track single-finger touches
        previousTouchPosition.current = { x: event.touches[0].pageX, y: event.touches[0].pageY };
        event.preventDefault(); // Prevents scroll behavior on touch devices
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length === 1) {
        const deltaX = (event.touches[0].pageX - previousTouchPosition.current.x) * -1;
        const deltaY = (event.touches[0].pageY - previousTouchPosition.current.y) * -1;

        rotationVelocity.current.y += deltaX * mouseTouchRotationSpeed;
        rotationVelocity.current.x += deltaY * mouseTouchRotationSpeed;

        previousTouchPosition.current = { x: event.touches[0].pageX, y: event.touches[0].pageY };
        event.preventDefault(); // Prevent scrolling during one-finger rotation
      } else if (event.touches.length === 2) {
        // Allow native scrolling and zooming for two-finger touches by not calling event.preventDefault()
      }
    };

    const handleTouchEnd = (event) => {
      // Momentum for touch
      rotationVelocity.current.x *= mouseTouchDampingFactor;
      rotationVelocity.current.y *= mouseTouchDampingFactor;
      if (event.touches.length === 0) {
        // No fingers left on screen
        isDragging.current = false;
      }
    };

    // Keyboard control functions
    const handleKeyDown = (event) => {
      setControlMode('keyboard');
      keysPressed.current.add(event.key.toLowerCase());
      event.preventDefault();
    };

    const handleKeyUp = (event) => {
      keysPressed.current.delete(event.key.toLowerCase());
    };

    const applyKeyboardRotations = () => {
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        rotationVelocity.current.x += keyboardRotationSpeed;
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        rotationVelocity.current.x -= keyboardRotationSpeed;
      }
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        rotationVelocity.current.y += keyboardRotationSpeed;
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        rotationVelocity.current.y -= keyboardRotationSpeed;
      }
    };

    // Animation loop
    const animate = () => {
      if (controlMode === 'keyboard') {
        applyKeyboardRotations();
      }

      const damping = controlMode === 'keyboard' ? keyboardDampingFactor : mouseTouchDampingFactor;

      cameraGroupRef.current.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotationVelocity.current.x);
      cameraGroupRef.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationVelocity.current.y);

      rotationVelocity.current.x *= damping;
      rotationVelocity.current.y *= damping;

      rendererRef.current.render(sceneRef.current, cameraGroupRef.current.children[0]);
      requestAnimationFrame(animate);
    };
    animate();

    // Attach event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    rendererRef.current.domElement.addEventListener('mousedown', handleMouseDown);
    rendererRef.current.domElement.addEventListener('mousemove', handleMouseMove);
    rendererRef.current.domElement.addEventListener('mouseup', handleMouseUp);
    rendererRef.current.domElement.addEventListener('touchstart', handleTouchStart, {
      passive: false
    });
    rendererRef.current.domElement.addEventListener('touchmove', handleTouchMove, {
      passive: false
    });
    rendererRef.current.domElement.addEventListener('touchend', handleTouchEnd);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      rendererRef.current.domElement.removeEventListener('mousedown', handleMouseDown);
      rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
      rendererRef.current.domElement.removeEventListener('mouseup', handleMouseUp);
      rendererRef.current.domElement.removeEventListener('touchstart', handleTouchStart);
      rendererRef.current.domElement.removeEventListener('touchmove', handleTouchMove);
      rendererRef.current.domElement.removeEventListener('touchend', handleTouchEnd);

      rendererRef.current.dispose();

      if (mountRef.current && rendererRef.current.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      sceneRef.current.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SkillMatrix;
