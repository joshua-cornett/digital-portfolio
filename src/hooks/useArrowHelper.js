import { useRef, useCallback } from 'react';
import * as THREE from 'three';

/**
 * Hook to manage a Three.js ArrowHelper for drag visualization.
 *
 * @param {THREE.Group} sceneGroup - The Three.js scene group where GalaGUI is rendered.
 * @returns {Object} - Methods to add, update, and remove the arrow.
 */
const useArrowHelper = (sceneGroup) => {
  const arrowRef = useRef(null);

  // Add arrow to the parent of the GalaGUI group
  const addArrow = useCallback(() => {
    if (!arrowRef.current && sceneGroup?.parent) {
      const arrowHelper = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0), // Initial direction
        new THREE.Vector3(0, 0, 0), // Initial position
        0.1, // Initial length
        0x00ff00 // Green color
      );

      // Customize the arrow material
      arrowHelper.cone.material = new THREE.MeshStandardMaterial({
        toneMapped: false,
        color: 0x00ff00,
        emissive: new THREE.Color(0x00ff00),
        emissiveIntensity: 1
      });

      // Hide the shaft (line)
      if (arrowHelper.line) {
        arrowHelper.line.visible = false;
      }

      // Attach the arrow to the parent of GalaGUI
      sceneGroup.parent.add(arrowHelper);
      arrowRef.current = arrowHelper;
    }
  }, [sceneGroup]);

  // Update the arrow's position and appearance
  const updateArrow = useCallback(({ startPosition, currentPosition }) => {
    if (!arrowRef.current || !startPosition || !currentPosition) return;

    const deltaX = currentPosition.x - startPosition.x;
    const deltaY = currentPosition.y - startPosition.y;

    // Calculate polar coordinates for radial placement
    const radius = 2.5; // Fixed radius
    const angle = Math.atan2(-deltaY, deltaX);

    const arrowX = Math.cos(angle) * radius;
    const arrowY = Math.sin(angle) * radius;

    // Convert arrow position to world space
    const globalPosition = new THREE.Vector3(arrowX, arrowY, 0);

    if (sceneGroup?.parent) {
      sceneGroup.parent.localToWorld(globalPosition); // Transform to world coordinates
      arrowRef.current.position.copy(globalPosition); // Set arrow's world position
    } else {
      arrowRef.current.position.set(arrowX, arrowY, 0); // Fallback for global space
    }

    // Update arrow direction
    const direction = new THREE.Vector3(deltaX, -deltaY, 0).normalize();
    arrowRef.current.setDirection(direction);

    // Calculate drag magnitude and dynamic appearance
    const magnitude = Math.sqrt(deltaX ** 2 + deltaY ** 2); // Drag magnitude
    const magnitudeFactor = magnitude > 20 ? magnitude - 20 : 0; // Offset small drags
    const normalizedFactor = Math.min(magnitudeFactor * 0.01, 1); // Normalize to [0, 1]

    // Dynamic length and thickness
    const length = Math.max(normalizedFactor * 1.5, 0.2); // Minimum length 0.2
    const width = Math.max(1 - normalizedFactor * 0.5, 0.2); // Thinner as length increases

    // Update arrow length and thickness
    arrowRef.current.setLength(length, length * width, length * width);

    // Dynamic glow
    const emissiveIntensity = Math.min(magnitudeFactor * 0.01, 1); // Cap glow intensity
    arrowRef.current.cone.material.emissiveIntensity = emissiveIntensity;

    console.log('[Arrow] Updated appearance:', {
      position: globalPosition,
      length,
      width,
      emissiveIntensity
    });
  }, []);

  // Remove the arrow from the scene
  const removeArrow = useCallback(() => {
    if (arrowRef.current && sceneGroup?.parent) {
      sceneGroup.parent.remove(arrowRef.current);
      arrowRef.current = null;
    }
  }, [sceneGroup]);

  return { addArrow, updateArrow, removeArrow };
};

export default useArrowHelper;
