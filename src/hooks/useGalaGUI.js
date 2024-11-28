// useGalaGUI.js

import { useRef, useEffect, useReducer, useCallback } from 'react';
import * as THREE from 'three';
import { inputReducer, initialInputState } from '@reducers';
import { applyRotationAndDamping, generateGalaGUI } from '@helpers';
import { useGalaGUIStore, useDragStore } from '@stores';

/**
 * Custom hook to manage the state and behavior for the GalaGUI component.
 *
 * @param {number} pointerRotationSpeed - Speed factor for pointer dragging.
 * @param {number} keyboardRotationSpeed - Speed factor for keyboard input.
 * @param {number} dampingFactor - Factor for smoothing out the momentum.
 * @returns {Object} - Contains the group reference and pointer event handlers.
 */
const useGalaGUI = (pointerRotationSpeed, keyboardRotationSpeed, dampingFactor) => {
  const groupRef = useRef();
  const rotationVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const quaternion = useRef(new THREE.Quaternion());
  const dragMomentum = useRef(new THREE.Vector3(0, 0, 0));
  const isDraggingRef = useRef(false); // Ref for immediate drag state

  // Input state management using useReducer (generic inputReducer)
  const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

  // Zustand store actions and state
  const { setSelectedItem, setHoveredItem, triggerHyperspeed } = useGalaGUIStore();
  const { startDrag, stopDrag, isComponentDragging } = useDragStore();

  // Pointer down event handler (start dragging)
  const handlePointerDown = useCallback(
    (event) => {
      dispatch({ type: 'START_DRAG', payload: { x: event.clientX, y: event.clientY } });
      isDraggingRef.current = true;
      startDrag('GalaGUI'); // Mark the GalaGUI as the active drag component globally
      document.body.style.cursor = 'none';
    },
    [startDrag]
  );

  // Pointer move event handler (dragging)
  const handlePointerMove = useCallback((event) => {
    if (isDraggingRef.current) {
      dispatch({
        type: 'UPDATE_DRAG',
        payload: {
          deltaX: event.movementX || 0,
          deltaY: event.movementY || 0
        }
      });
    }
  }, []);

  // Pointer up event handler (stop dragging)
  const handlePointerUp = useCallback(() => {
    dispatch({ type: 'STOP_DRAG' });
    isDraggingRef.current = false;
    stopDrag(); // Stop dragging in the global state
    document.body.style.cursor = 'default';
  }, [stopDrag]);

  // Manage event listeners for dragging
  useEffect(() => {
    if (isDraggingRef.current) {
      // Add mousemove and mouseup listeners for dragging
      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('mouseup', handlePointerUp);
    } else {
      // Remove listeners when not dragging
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isDraggingRef.current, handlePointerMove, handlePointerUp]);

  // Handle item selection (using Zustand to set global state)
  const handleItemClick = useCallback(
    (item) => {
      setSelectedItem(item); // Update the selected item globally
      /** @TODO - Implement hyperspeed animation */
      triggerHyperspeed();
    },
    [setSelectedItem, triggerHyperspeed]
  );

  // Handle hover state (using Zustand)
  const handleItemHover = useCallback(
    (item) => {
      /** @TODO - Implement and trigger hover effect */
      setHoveredItem(item);
    },
    [setHoveredItem]
  );

  // Populate items in a spherical layout
  useEffect(() => {
    if (!groupRef.current) return;

    const radius = 2;
    const numItems = 12;

    generateGalaGUI(groupRef.current, numItems, radius);
  }, []);

  // Apply rotation and damping in the animation frame loop
  const applyFrameUpdates = () => {
    if (!groupRef.current) return;

    // Apply key presses to rotation velocity
    if (inputState.activeKeys.has('w') || inputState.activeKeys.has('arrowup')) {
      rotationVelocity.current.x -= keyboardRotationSpeed;
    }
    if (inputState.activeKeys.has('s') || inputState.activeKeys.has('arrowdown')) {
      rotationVelocity.current.x += keyboardRotationSpeed;
    }
    if (inputState.activeKeys.has('a') || inputState.activeKeys.has('arrowleft')) {
      rotationVelocity.current.y -= keyboardRotationSpeed;
    }
    if (inputState.activeKeys.has('d') || inputState.activeKeys.has('arrowright')) {
      rotationVelocity.current.y += keyboardRotationSpeed;
    }

    // Apply pointer dragging to rotation velocity if dragging is active
    if (isDraggingRef.current) {
      rotationVelocity.current.y += inputState.deltaX * pointerRotationSpeed;
      rotationVelocity.current.x += inputState.deltaY * pointerRotationSpeed;

      dragMomentum.current.set(
        inputState.deltaY * pointerRotationSpeed,
        inputState.deltaX * pointerRotationSpeed,
        0
      );
    }

    // Apply rotation and damping to the group
    applyRotationAndDamping(
      rotationVelocity.current,
      quaternion.current,
      groupRef.current,
      dampingFactor
    );

    // Apply drag momentum (if any)
    if (!isDraggingRef.current && dragMomentum.current.length() > 0) {
      dragMomentum.current.multiplyScalar(dampingFactor);
    }
  };

  return {
    groupRef,
    handlePointerDown,
    applyFrameUpdates,
    handleItemClick,
    handleItemHover
  };
};

export default useGalaGUI;
