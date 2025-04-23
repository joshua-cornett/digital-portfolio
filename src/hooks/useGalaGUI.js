// useGalaGUI.js

import { applyRotationAndDamping, generateGalaGUI, generateRadialOptions } from '@helpers';
import { getFocusedOption } from '@helpers/getFocusedOption';
import { useThree } from '@react-three/fiber';
import { initialInputState, inputReducer } from '@reducers';
import { useGalaGUIStore } from '@stores';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import * as THREE from 'three';

/**
 * Custom hook to manage the state and behavior for the GalaGUI component.
 *
 * @param {number} pointerRotationSpeed - Speed factor for pointer dragging.
 * @param {number} keyboardRotationSpeed - Speed factor for keyboard input.
 * @param {number} dampingFactor - Factor for smoothing out the momentum.
 * @returns {Object} - Contains the group reference and pointer event handlers.
 */
const useGalaGUI = ({ pointerRotationSpeed, keyboardRotationSpeed, dampingFactor, meshRefs }) => {
  const groupRef = useRef();
  const { camera } = useThree();
  const rotationVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const quaternion = useRef(new THREE.Quaternion());
  const dragMomentum = useRef(new THREE.Vector3(0, 0, 0));
  const isDraggingRef = useRef(false); // Ref for immediate drag state

  // Input state management using useReducer (generic inputReducer)
  const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

  // Zustand store actions and state
  const { setSelectedItem, setHoveredItem, triggerHyperspeed, setOptions } = useGalaGUIStore();

  // Arrow helper to visualize drag influence (rotating radially)
  const arrowRef = useRef(null);

  const handleOptionSelect = useCallback(() => {
    const focusedOption = useGalaGUIStore.getState().hoveredItem;
    if (!focusedOption) return;

    setSelectedItem(focusedOption);

    // Trigger depopulation of current options
    groupRef.current.clear();

    // Populate new options based on the selection
    const newOptions = generateNewOptions(focusedOption); // Define logic for new options
    generateGalaGUI(groupRef.current, newOptions, radius);
  }, []);

  // Pointer down event handler (start dragging)
  const handlePointerDown = useCallback((event) => {
    dispatch({ type: 'START_DRAG', payload: { x: event.clientX, y: event.clientY } });
    isDraggingRef.current = true;
    document.body.style.cursor = 'none';

    // Initialize arrowhead-only helper if it doesn't already exist
    if (!arrowRef.current && groupRef.current) {
      const arrowHelper = createArrowHeadOnly(); // Use custom function
      groupRef.current.parent.add(arrowHelper); // Add to scene, not GalaGUI
      arrowRef.current = arrowHelper;
    }
  }, []);

  // Pointer move event handler (dragging)
  const handlePointerMove = useCallback((event) => {
    if (isDraggingRef.current) {
      dispatch({
        type: 'UPDATE_DRAG',
        payload: { x: event.clientX, y: event.clientY }
      });
    }
  }, []);

  // Pointer up event handler (stop dragging)
  const handlePointerUp = useCallback(() => {
    dispatch({ type: 'STOP_DRAG' });
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';

    // Remove the arrow from the scene
    if (arrowRef.current && groupRef.current.parent) {
      groupRef.current.parent.remove(arrowRef.current);
      arrowRef.current = null;
    }
  }, []);

  // Update arrow position and appearance dynamically
  const updateArrow = useCallback(() => {
    if (!arrowRef.current || !groupRef.current) return;

    const { startPosition, currentPosition } = inputState;

    if (!startPosition || !currentPosition) return;

    // Calculate drag vector
    const deltaX = currentPosition.x - startPosition.x;
    const deltaY = currentPosition.y - startPosition.y;

    // Convert to polar coordinates for radial placement
    const radius = 2.5; // Radius around GalaGUI
    const angle = Math.atan2(-deltaY, deltaX);

    // Calculate arrow position
    const arrowX = Math.cos(angle) * radius;
    const arrowY = Math.sin(angle) * radius;

    // Update arrow position
    arrowRef.current.position.set(arrowX, arrowY, 0);

    // Update arrow direction (normalize the drag vector)
    const direction = new THREE.Vector3(deltaX, -deltaY, 0).normalize();
    arrowRef.current.setDirection(direction);

    // Calculate arrow length and width based on drag magnitude
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const magnitudeFactor = magnitude > 20 ? magnitude - 20 : 0;
    const length = Math.min(magnitudeFactor * 0.01, 1); // Scale length
    const width = Math.max(1 - length * 0.5, 0.2); // Scale width (thinner as length increases)
    const emissiveIntensity = Math.min(magnitudeFactor * 0.01, 1); // Scale glow intensity (max 1)

    // Update arrowhead proportions
    arrowRef.current.setLength(length, length * width, length * width); // Adjust based on length and width

    // Update arrowhead color and glow
    arrowRef.current.cone.material.color.set(0x00ff00); // Fixed green color
    arrowRef.current.cone.material.emissive = new THREE.Color(0x00ff00).multiplyScalar(
      emissiveIntensity
    ); // Dynamic glow
  }, [inputState]);

  // Create an arrowhead-only helper
  const createArrowHeadOnly = () => {
    const arrowDirection = new THREE.Vector3(1, 0, 0); // Initial direction
    const arrowOrigin = new THREE.Vector3(0, 0, 0); // Center of GalaGUI
    const arrowLength = 0.1;
    const arrowColor = 0x00ff00;

    const arrowHelper = new THREE.ArrowHelper(arrowDirection, arrowOrigin, arrowLength, arrowColor);

    // Remove the line (shaft) of the arrow
    if (arrowHelper.line) {
      arrowHelper.line.visible = false; // Hide the line
    }

    // Customize the material of the cone for dynamic appearance
    arrowHelper.cone.material = new THREE.MeshStandardMaterial({
      toneMapped: false,
      color: arrowColor,
      emissive: new THREE.Color(0x00ff00), // Add slight glow
      emissiveIntensity: 1
    });

    return arrowHelper;
  };

  // Touch start event handler (begin dragging)
  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0]; // Get the first touch point
    dispatch({ type: 'START_DRAG', payload: { x: touch.clientX, y: touch.clientY } });
    isDraggingRef.current = true;

    // Initialize arrowhead-only helper if it doesn't already exist
    if (!arrowRef.current && groupRef.current) {
      const arrowHelper = createArrowHeadOnly(); // Use custom function
      groupRef.current.parent.add(arrowHelper); // Add to scene, not GalaGUI
      arrowRef.current = arrowHelper;
    }
  }, []);

  // Touch move event handler (update drag position)
  const handleTouchMove = useCallback((event) => {
    if (isDraggingRef.current) {
      const touch = event.touches[0]; // Get the first touch point
      dispatch({
        type: 'UPDATE_DRAG',
        payload: { x: touch.clientX, y: touch.clientY }
      });
    }
  }, []);

  // Touch end event handler (stop dragging)
  const handleTouchEnd = useCallback(() => {
    dispatch({ type: 'STOP_DRAG' });
    isDraggingRef.current = false;

    // Remove the arrow from the scene
    if (arrowRef.current && groupRef.current.parent) {
      groupRef.current.parent.remove(arrowRef.current);
      arrowRef.current = null;
    }
  }, []);

  // Manage event listeners for dragging and touch interactions
  useEffect(() => {
    if (isDraggingRef.current) {
      // Add mouse and touch listeners
      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('mouseup', handlePointerUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      // Remove mouse and touch listeners
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDraggingRef.current, handlePointerMove, handlePointerUp, handleTouchMove, handleTouchEnd]);

  // Handle item selection (using Zustand to set global state)
  /*const handleItemClick = useCallback(
    (item) => {
      setSelectedItem(item); // Update the selected item globally
      /** @TODO - Implement hyperspeed animation
      triggerHyperspeed();
    },
    [setSelectedItem, triggerHyperspeed]
  );*/

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
    const radius = 2;
    const numItems = 12;
    const options = generateRadialOptions(numItems, radius);
    setOptions(options);
  }, []);

  // Apply rotation and damping in the animation frame loop
  const applyFrameUpdates = () => {
    if (!groupRef.current) return;

    // Update arrow for drag visualization
    updateArrow();

    // Handle drag influence on rotation
    if (inputState.isDragging && inputState.startPosition && inputState.currentPosition) {
      const deltaX = inputState.currentPosition.x - inputState.startPosition.x;
      const deltaY = inputState.currentPosition.y - inputState.startPosition.y;

      // Set rotation velocity based on drag input
      rotationVelocity.current.set(deltaY * pointerRotationSpeed, deltaX * pointerRotationSpeed, 0);
    } else {
      // Apply damping when not dragging
      rotationVelocity.current.multiplyScalar(dampingFactor);
    }

    // Apply the rotation and damping to the GalaGUI group
    applyRotationAndDamping(
      rotationVelocity.current,
      quaternion.current, // Quaternion for smooth rotations
      groupRef.current,
      dampingFactor // Damping factor for momentum
    );
    console.log('🧭 group quaternion:', groupRef.current.quaternion.toArray());

    // Detect the currently focused option

    const nodes = meshRefs.current.filter(Boolean);
    const focusedOption = getFocusedOption(nodes, camera);

    // update Zustand
    if (focusedOption) {
      setHoveredItem(focusedOption.userData.option);
    }
  };

  return {
    groupRef,
    handlePointerDown,
    applyFrameUpdates,
    handlePointerMove,
    handlePointerUp,
    handleTouchStart,
    handleItemClick: setSelectedItem,
    handleItemHover: setHoveredItem
  };
};

export default useGalaGUI;
