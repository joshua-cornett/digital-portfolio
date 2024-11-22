// src/helpers/dialogueHelper.js

// Cache to store dialogues by location
const dialogueCache = {};

/**
 * Retrieves dialogue text based on the current location.
 *
 * @param {string} location - The current location (route).
 * @returns {string} Dialogue text specific to the location.
 */
export const getLocationDialogue = (location) => {
  // Check if the dialogue is already in the cache
  if (dialogueCache[location]) {
    return dialogueCache[location];
  }

  let dialogue;
  switch (location) {
    case 'about':
      dialogue = 'Let me tell you a bit about myself...';
      break;
    case 'skills':
      dialogue = 'Check out my leet skills...';
      break;
    case 'experiences':
      dialogue = 'Hear about my various experiences';
      break;
    default:
      dialogue = 'Hello, welcome to my portfolio!';
  }

  // Store the dialogue in the cache
  dialogueCache[location] = dialogue;

  return dialogue;
};