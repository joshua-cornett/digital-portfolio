import { useReducer, useEffect, useCallback } from 'react';
import { inputReducer, initialInputState } from '@reducers';

/**
 * Hook to manage input events and state for pointer, touch, and keyboard.
 *
 * @returns {Object} - Input state and dispatch actions.
 */
const useInputManager = () => {
  const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

  // Event handlers
  const handlePointerDown = useCallback((event) => {
    dispatch({
      type: 'START_DRAG',
      payload: { x: event.clientX, y: event.clientY }
    });
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      if (inputState.isDragging) {
        dispatch({
          type: 'UPDATE_DRAG',
          payload: { x: event.clientX, y: event.clientY }
        });
      }
    },
    [inputState.isDragging]
  );

  const handlePointerUp = useCallback(() => {
    dispatch({ type: 'STOP_DRAG' });
  }, []);

  const handleKeyDown = useCallback((event) => {
    dispatch({ type: 'KEY_PRESS', payload: { key: event.key } });
  }, []);

  const handleKeyUp = useCallback((event) => {
    dispatch({ type: 'KEY_RELEASE', payload: { key: event.key } });
  }, []);

  // Add and remove global event listeners
  useEffect(() => {
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handleKeyDown, handleKeyUp]);

  useEffect(() => {}, [inputState]);

  return {
    inputState,
    dispatch
  };
};

export default useInputManager;
