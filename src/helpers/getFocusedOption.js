// helpers/getFocusedOption.js
import * as THREE from 'three';

/**
 * Determine the currently focused option based on proximity to the camera's forward direction.
 *
 * @param {Array<THREE.Object3D>} nodes - Array of selectable option nodes.
 * @param {THREE.Vector3} cameraDirection - The forward direction of the camera.
 * @returns {THREE.Object3D | null} - The currently focused option, or null if none.
 */
export const getFocusedOption = (nodes, cameraDirection) => {
  if (!nodes.length) return null;

  let closestNode = null;
  let maxAlignment = -Infinity;

  nodes.forEach((node) => {
    const nodeDirection = new THREE.Vector3();
    node.getWorldPosition(nodeDirection).normalize();

    const alignment = nodeDirection.dot(cameraDirection); // Dot product for alignment
    if (alignment > maxAlignment) {
      maxAlignment = alignment;
      closestNode = node;
    }
  });

  return closestNode;
};
