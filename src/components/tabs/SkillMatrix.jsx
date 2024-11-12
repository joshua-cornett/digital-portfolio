// src/components/SkillMatrix.jsx

// React imports
import { useEffect, useRef } from 'react';

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
  // Reference to the canvas element
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // near clipping
      1000 // far clipping
    );
    camera.position.z = 10; // default view distance

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth motion
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;

    // Set the target of the camera's orbit to the origin
    controls.target.set(0, 0, 0);

    // Disable panning and enable right-click drag for orbiting
    controls.enablePan = false;
    controls.mouseButtons = {
      LEFT: null,
      RIGHT: THREE.MOUSE.ROTATE // Set right-click for orbiting
    };

    // Add a group for skill items
    const skillsGroup = new THREE.Group();
    scene.add(skillsGroup);

    // Position items on a sphere
    const radius = 5; // Radius of the sphere
    const numItems = 12; // Total number of items
    const items = []; // Array to store item meshes

    for (let i = 0; i < numItems; i++) {
      // Calculate spherical coordinates
      const theta = Math.acos(1 - (2 * (i + 1)) / numItems); // Polar angle
      const phi = Math.sqrt(numItems * Math.PI) * theta; // Azimuthal angle

      // Convert spherical coordinates to Cartesian (x, y, z)
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      // Create the item mesh
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const itemMesh = new THREE.Mesh(geometry, material);

      // Set the item's position and add to the group
      itemMesh.position.set(x, y, z);
      skillsGroup.add(itemMesh);
      items.push(itemMesh);
    }

    for (const item of items) {
      // Create geometry for the line
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0), // Start at center
        item.position // End at item position
      ]);

      // Create material and line mesh
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const line = new THREE.Line(lineGeometry, lineMaterial);

      // Add line to scene
      skillsGroup.add(line);
    }

    // Create an animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls each frame
      renderer.render(scene, camera); // Render the scene with the camera
    };
    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SkillMatrix;
