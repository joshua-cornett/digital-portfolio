import { useRef, useCallback } from 'react';

/**
 * Custom hook to handle touch controls for 2D or 3D elements.
 *
 * @returns {Object} Contains touch state and event handlers.
 */
const useTouchControls = () => {
  const isTouching = useRef(false);
  const touchDelta = useRef({ deltaX: 0, deltaY: 0 }); // Track movement deltas
  const lastTouchPosition = useRef({ x: 0, y: 0 }); // Last recorded touch position

  // Handle touch start
  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0]; // Get the first touch point
    lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };
    isTouching.current = true;

    // Add touchmove and touchend listeners
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((event) => {
    if (isTouching.current) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastTouchPosition.current.x;
      const deltaY = touch.clientY - lastTouchPosition.current.y;

      touchDelta.current.deltaX = deltaX;
      touchDelta.current.deltaY = deltaY;

      lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };

      event.preventDefault(); // Prevent default touch behaviors like scrolling
    }
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    isTouching.current = false;

    // Remove listeners to stop tracking touch movements
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  return {
    handleTouchStart,
    isTouching,
    touchDelta
  };
};

export default useTouchControls;
