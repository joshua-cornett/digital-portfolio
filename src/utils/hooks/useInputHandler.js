// src/utils/hooks/useInputHandler.js

import { useEffect, useRef } from 'react';

/**
 * Hook to handle keyboard inputs.
 *
 * @param {Function} onKeyDown - Callback for key down events.
 * @param {Function} onKeyUp - Callback for key up events.
 */
const useInputHandler = (onKeyDown, onKeyUp) => {
  const activeKeys = useRef(new Set());

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeKeys.current.has(e.key)) {
        activeKeys.current.add(e.key);
        onKeyDown(e.key);
      }
    };

    const handleKeyUp = (e) => {
      activeKeys.current.delete(e.key);
      onKeyUp(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return activeKeys.current;
};

export default useInputHandler;
