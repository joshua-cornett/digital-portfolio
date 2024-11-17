// React imports
import { useState, useEffect } from 'react';
import { useDialogueContext } from '../../contexts';
import styles from './Dialogue.module.css'; // Import CSS module

/**
 * Dialogue component that displays typing animation text based on the provided dialogue.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.id - Unique identifier for the dialogue instance.
 * @param {string} props.dialogue - Text to display in the dialogue.
 * @returns {JSX.Element} The rendered dialogue component with typing animation.
 */
const Dialogue = ({ id, dialogue }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  const { updateDialogue } = useDialogueContext();

  useEffect(() => {
    updateDialogue(id, dialogue);
  }, [id, dialogue]);

  // Effect to handle typing animation
  useEffect(() => {
    setIndex(0); // Reset index when dialogue changes
  }, [dialogue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedText(dialogue.slice(0, index + 1));
      setIndex((prevIndex) => prevIndex + 1);
    }, 50); // Adjust typing speed here

    return () => clearTimeout(timer);
  }, [index, dialogue]);

  return (
    <div className={styles.dialogueBox}>
      <p className={styles.dialogueText}>{displayedText}</p>
    </div>
  );
};

export default Dialogue;
