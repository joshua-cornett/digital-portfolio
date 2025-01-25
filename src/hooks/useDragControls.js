import { useReducer, useCallback, useRef } from 'react';
import inputReducer, { initialInputState } from '../reducers/inputReducer';

/**
 * Hook to manage drag interactions for any component.
 *
 * @param {number} dragSpeed - Speed multiplier for drag operations.
 * @returns {Object} Drag state, velocity, and control methods.
 */
const useDragControls = (dragSpeed = 1) => {
  const [dragState, dispatch] = useReducer(inputReducer, initialInputState);
  const velocityRef = useRef({ x: 0, y: 0 });

  // Start drag
  const startDrag = useCallback((position) => {
    dispatch({ type: 'START_DRAG', payload: position });
  }, []);

  // Update drag
  const updateDrag = useCallback(
    (position) => {
      if (!dragState.isDragging || !dragState.startPosition) return;

      const deltaX = (position.x - dragState.startPosition.x) * dragSpeed;
      const deltaY = (position.y - dragState.startPosition.y) * dragSpeed;

      velocityRef.current = { x: deltaY, y: deltaX };

      dispatch({ type: 'UPDATE_DRAG', payload: position });
    },
    [dragState.isDragging, dragState.startPosition, dragSpeed]
  );

  // Stop drag
  const stopDrag = useCallback(() => {
    dispatch({ type: 'STOP_DRAG' });
  }, []);

  return {
    dragState,
    velocity: velocityRef.current,
    startDrag,
    updateDrag,
    stopDrag
  };
};

export default useDragControls;
