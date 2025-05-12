// React imports
import { useEffect, useState } from 'react';
// Context imports
import { useDialogueContext } from '@contexts';
// Style imports
import styles from './Dialogue.module.scss';

/**
 * Dialogue component that displays text with a typing animation.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.id - Unique identifier for the dialogue instance.
 * @param {string} props.dialogue - Text to display in the dialogue.
 * @returns {JSX.Element} The rendered dialogue component.
 */
const Dialogue = ({ id, dialogue }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  // Dialogue context for optional updates
  const { updateDialogue } = useDialogueContext();

  // Add dialogue to the global context if available
  useEffect(() => {
    if (updateDialogue) {
      updateDialogue(id, dialogue);
    }
  }, [id, dialogue]);

  // Reset displayed text and index when the dialogue changes
  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [dialogue]);

  // Typing animation effect
  useEffect(() => {
    if (index < dialogue.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + dialogue[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, 50); // Typing speed in milliseconds

      return () => clearTimeout(timer);
    }
  }, [index, dialogue]);

  return (
    <div className={styles.dialogue}>
      <p className={styles.dialogueText} dangerouslySetInnerHTML={{ __html: displayedText }} />
    </div>
  );
};

export default Dialogue;
