import { useState, useEffect } from 'react';
import { useDialogueContext } from '../../contexts';

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

  return <p>{displayedText}</p>;
};

export default Dialogue;
