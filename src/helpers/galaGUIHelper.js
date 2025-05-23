import * as THREE from 'three';

/**
 * Populate items in a spherical layout around the origin.
 *
 * @param {THREE.Group} group - The group reference to add items to.
 * @param {number} numItems - Number of items to create.
 * @param {number} radius - Radius of the sphere.
 */
export const generateGalaGUI = (group, numItems, radius) => {
  for (let i = 0; i < numItems; i++) {
    const theta = Math.acos(1 - (2 * (i + 1)) / numItems);
    const phi = Math.sqrt(numItems * Math.PI) * theta;
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);

    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ toneMapped: false, color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      sphere.position
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ toneMapped: false, color: 0x00ff00 });
    const line = new THREE.Line(lineGeometry, lineMaterial);

    group.add(sphere);
    group.add(line);
  }
};

/**
 * Generate evenly distributed radial options around a sphere.
 *
 * @param {number} count - Number of items to generate
 * @param {number} radius - Radius of the sphere
 * @returns {Array<{ id: string, position: [number, number, number] }>}
 */
export const generateRadialOptions = (count, radius) => {
  return Array.from({ length: count }, (_, i) => {
    const theta = Math.acos(1 - (2 * (i + 1)) / count);
    const phi = Math.sqrt(count * Math.PI) * theta;
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    return {
      id: `Option-${i}`,
      position: [x, y, z],
      title: `Option ${i + 1}`,
      description: `Description for option ${i + 1}`,
      icon: '',
      color: 0x00ff00, // Fixed green color
      data: {
        // Add any additional data you want to associate with each node
        category: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C',
        value: Math.random() * 100,
        tags: ['tag1', 'tag2', 'tag3'].slice(0, (i % 3) + 1)
      }
    };
  });
};

/**
 * Apply rotation and damping to a given group.
 *
 * @param {THREE.Vector3} rotationVelocity - The velocity vector for rotation.
 * @param {THREE.Quaternion} quaternion - The quaternion to apply the rotation.
 * @param {THREE.Group} group - The group to be rotated.
 * @param {number} dampingFactor - The factor to apply for damping the rotation.
 */
export const applyRotationAndDamping = (rotationVelocity, quaternion, group, dampingFactor) => {
  if (!group) return;

  // Create a new Euler based on the rotation velocity
  quaternion.setFromEuler(
    new THREE.Euler(rotationVelocity.x, rotationVelocity.y, rotationVelocity.z)
  );

  // Apply the quaternion rotation to the group
  group.quaternion.multiplyQuaternions(quaternion, group.quaternion);

  // Apply damping to the rotation velocity
  rotationVelocity.multiplyScalar(dampingFactor);
};

// You can add more GalaGUI-specific helpers as needed...
