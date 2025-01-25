import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useInputManager, useDragControls, useKeyControls, useArrowHelper } from '@hooks';
import { applyRotationAndDamping, generateGalaGUI } from '@helpers';
import { useGalaGUIStore } from '@stores';

const useGalaGUI = ({ pointerRotationSpeed, keyboardRotationSpeed, dampingFactor }) => {
  const groupRef = useRef(); // Reference to the GalaGUI group
  const rotationVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const quaternion = useRef(new THREE.Quaternion());

  // Input management
  const { inputState } = useInputManager();

  // Drag controls
  const { dragState, velocity, startDrag, updateDrag, stopDrag } =
    useDragControls(pointerRotationSpeed);

  const { calculateVelocity: calculateKeyVelocity } = useKeyControls(keyboardRotationSpeed);

  // Arrow helper
  const { addArrow, updateArrow, removeArrow } = useArrowHelper(groupRef.current);

  // Zustand store actions and state
  const { setSelectedItem, setHoveredItem } = useGalaGUIStore();

  // Initialize GalaGUI content
  useEffect(() => {
    if (groupRef.current) {
      generateGalaGUI(groupRef.current, 12, 2); // 12 items in a radius of 2 units
    }
  }, []);

  // Handle pointer events
  const handlePointerDown = useCallback(
    (event) => {
      startDrag({ x: event.clientX, y: event.clientY });
      addArrow();
    },
    [startDrag, addArrow]
  );

  const handlePointerMove = useCallback(
    (event) => {
      updateDrag({ x: event.clientX, y: event.clientY });
      updateArrow({
        startPosition: dragState.startPosition,
        currentPosition: dragState.currentPosition
      });
    },
    [updateDrag, updateArrow, dragState]
  );

  const handlePointerUp = useCallback(() => {
    stopDrag();
    removeArrow();
  }, [stopDrag, removeArrow]);

  // Frame update logic
  const applyFrameUpdates = useCallback(() => {
    if (!groupRef.current) return;

    // Update rotation based on input
    if (dragState.isDragging) {
      rotationVelocity.current.set(velocity.x, velocity.y, 0);
    } else {
      // Apply damping when not dragging
      rotationVelocity.current.multiplyScalar(dampingFactor);
    }

    // Apply rotation to the GalaGUI group
    applyRotationAndDamping(
      rotationVelocity.current,
      quaternion.current,
      groupRef.current,
      dampingFactor
    );
  }, [dragState.isDragging, velocity, dampingFactor]);

  return {
    groupRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    applyFrameUpdates
  };
};

export default useGalaGUI;
