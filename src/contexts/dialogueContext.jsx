// src/contexts/dialogueContext.jsx

// React imports
import { createContext, useContext, useState } from 'react';

const DialogueContext = createContext();

/**
 * Provides dialogue-related context and functions to its children.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - Child components.
 * @returns {JSX.Element} The provider component that wraps its children with dialogue context.
 */
export const DialogueProvider = ({ children }) => {
  const [dialogues, setDialogues] = useState({});

  /**
   * Updates the dialogue for a specific component ID.
   *
   * @param {string} componentId - Unique identifier for the component.
   * @param {string} newDialogue - New dialogue text.
   */
  const updateDialogue = (componentId, newDialogue) => {
    setDialogues((prevDialogues) => ({
      ...prevDialogues,
      [componentId]: newDialogue
    }));
  };

  /**
   * Retrieves the dialogue for a given component ID.
   *
   * @param {string} id - The ID of the component.
   * @returns {string} The dialogue text associated with the component ID.
   */
  const getDialogue = (id) => {
    return dialogues[id] || '';
  };

  return (
    <DialogueContext.Provider value={{ dialogues, updateDialogue, getDialogue }}>
      {children}
    </DialogueContext.Provider>
  );
};

/**
 * Hook to use the dialogue context.
 *
 * @returns {Object} The dialogue context.
 */
export const useDialogueContext = () => {
  return useContext(DialogueContext);
};
