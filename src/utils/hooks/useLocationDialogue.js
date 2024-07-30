import { useEffect } from 'react';
import { useLocationContext, useDialogueContext } from '../../contexts/index';
import { getLocationDialogue } from '../DialogueHelper';

export const useLocationDialogue = (id) => {
  const { location } = useLocationContext();
  const { dialogues, updateDialogue } = useDialogueContext();

  useEffect(() => {
    const newDialogue = getLocationDialogue(location);
    updateDialogue(id, newDialogue);
  }, [location, id]);

  return dialogues[id];
};
