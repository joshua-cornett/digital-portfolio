// src/hooks/useTypingAnimation.js

// React imports
import { useState, useEffect } from 'react';

/**
 * Custom hook for typing animation.
 *
 * @param {string} text - The text to animate.
 * @param {number} speed - Typing speed in milliseconds (default: 50ms).
 * @returns {string} The current displayed text based on typing animation.
 */
const useTypingAnimation = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, index + 1));
      setIndex((prevIndex) => prevIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [text, index, speed]);

  useEffect(() => {
    setIndex(0); // Reset index when text changes
  }, [text]);

  return displayedText;
};

export default useTypingAnimation;
