import { useRef, useCallback } from 'react';

/**
 * Custom hook to handle generic drag controls for 2D or 3D elements.
 *
 * @returns {Object} Contains drag state and pointer event handlers.
 */
const useDragControls = () => {
  const isDragging = useRef(false);
  const dragDelta = useRef({ deltaX: 0, deltaY: 0 }); // Track movement deltas

  // Handle pointer down (start drag)
  const handlePointerDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'none';

    // Add mousemove and mouseup listeners to track dragging
    document.addEventListener('mousemove', handlePointerMove, { passive: false });
    document.addEventListener('mouseup', handlePointerUp, { passive: false });
  }, []);

  // Handle pointer move (dragging)
  const handlePointerMove = useCallback((event) => {
    if (isDragging.current) {
      dragDelta.current.deltaX = event.movementX || 0;
      dragDelta.current.deltaY = event.movementY || 0;

      event.preventDefault();
    }
  }, []);

  // Handle pointer up (end drag)
  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = 'default';

    // Remove listeners to stop tracking drag movements
    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('mouseup', handlePointerUp);
  }, [handlePointerMove]);

  return {
    handlePointerDown,
    isDragging,
    dragDelta
  };
};

export default useDragControls;
