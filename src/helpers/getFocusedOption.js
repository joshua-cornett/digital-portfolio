// helpers/getFocusedOption.js
import * as THREE from 'three';

/**
 * Determine the currently focused option based on proximity to the camera's forward direction.
 *
 * @param {Array<THREE.Object3D>} nodes - Array of selectable option nodes.
 * @param {THREE.Vector3} cameraDirection - The forward direction of the camera.
 * @returns {THREE.Object3D | null} - The currently focused option, or null if none.
 */
export const getFocusedOption = (nodes, camera, center = new THREE.Vector3(0, 0, 0)) => {
  let minAngle = Infinity;
  let focusedNode = null;

  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);
  cameraDirection.normalize();

  // Vector from origin to camera
  const cameraFromCenter = new THREE.Vector3().subVectors(camera.position, center).normalize();

  nodes.forEach((node) => {
    const worldPos = new THREE.Vector3();
    node.getWorldPosition(worldPos);

    const nodeFromCenter = worldPos.clone().sub(center).normalize();

    // Reject nodes on the "back side" of the sphere
    const alignment = cameraFromCenter.dot(nodeFromCenter);
    if (alignment < 0.1) return; // 0 = perfect hemisphere. >0 = tighter cone.

    // Measure alignment from camera direction
    const vectorToNode = new THREE.Vector3().subVectors(worldPos, camera.position).normalize();
    const angle = cameraDirection.angleTo(vectorToNode);

    if (angle < minAngle) {
      minAngle = angle;
      focusedNode = node;
    }
  });

  return focusedNode;
};

/*export const getFocusedOption = (nodes, cameraDirection) => {
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
};*/
