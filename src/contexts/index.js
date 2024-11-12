// src/contexts/index.js

// Context imports
import { useLocationContext, LocationProvider } from './locationContext';
import { useDialogueContext, DialogueProvider } from './dialogueContext';
import ContextWrapper from './ContextWrapper';

// Context exports
export {
  useLocationContext,
  LocationProvider,
  useDialogueContext,
  DialogueProvider,
  ContextWrapper
};
