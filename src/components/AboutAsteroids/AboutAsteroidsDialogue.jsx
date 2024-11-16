// src/components/AboutAsteroids/AboutAsteroidsDialogue.jsx

import { useEffect, useState } from 'react';
import useTypingAnimation from '../../utils/hooks/useTypingAnimation';

/**
 * AboutAsteroidsDialogue component handles dialogue animation and interaction for the game.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.dialogue - The dialogue to display and animate.
 * @param {Function} props.onKeywordDrop - Callback for handling keyword entry into play area.
 * @returns {JSX.Element} The rendered dialogue component with animation.
 */
const AboutAsteroidsDialogue = ({ dialogue, onKeywordDrop }) => {
  const displayedText = useTypingAnimation(dialogue, 50); // Typing animation speed
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (displayedText === dialogue) {
      setIsCompleted(true);

      // Parse and emit keywords when dialogue completes
      const keywords = dialogue.match(/\b(skills|React|JavaScript|PixiJS)\b/gi) || [];
      onKeywordDrop(keywords);
    }
  }, [displayedText, dialogue, onKeywordDrop]);

  return <p style={{ color: 'white', fontFamily: 'monospace' }}>{displayedText}</p>;
};

export default AboutAsteroidsDialogue;
