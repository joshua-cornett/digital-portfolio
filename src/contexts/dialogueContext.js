// DialogueContext.js
import { createContext, useContext, useState } from 'react';

const DialogueContext = createContext();

export const DialogueProvider = ({ children }) => {
  const [dialogues, setDialogues] = useState({});

  const updateDialogue = (componentId, newDialogue) => {
    setDialogues((prevDialogues) => ({
      ...prevDialogues,
      [componentId]: newDialogue
    }));
  };

  const getDialogue = (id) => {
    return dialogues[id] || '';
  };

  return (
    <DialogueContext.Provider value={{ dialogues, updateDialogue, getDialogue }}>
      {children}
    </DialogueContext.Provider>
  );
};

export const useDialogueContext = () => {
  return useContext(DialogueContext);
};
