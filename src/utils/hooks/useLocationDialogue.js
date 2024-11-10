// src/utils/hooks/useLocationDialogue.js

// React imports
import { useEffect } from 'react';
// Context imports
import { useLocationContext, useDialogueContext } from '../../contexts/index';
import { getLocationDialogue } from '../DialogueHelper';

/**
 * Custom hook to retrieve dialogue based on the current location.
 *
 * @param {string} id - Unique identifier for the dialogue.
 * @returns {string} The dialogue text associated with the current location.
 */
export const useLocationDialogue = (id) => {
  const { location } = useLocationContext();
  const { dialogues, updateDialogue } = useDialogueContext();

  useEffect(() => {
    const newDialogue = getLocationDialogue(location);
    updateDialogue(id, newDialogue);
  }, [location, id]);

  return dialogues[id];
};
