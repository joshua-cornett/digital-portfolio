// DialogueHelper.js

// Cache to store dialogues by location
const dialogueCache = {};

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
    case 'projects':
      dialogue = "Here's a look at some of my work...";
      break;
    case 'contact':
      dialogue = 'Feel free to reach out and connect!';
      break;
    default:
      dialogue = 'Hello, welcome to my portfolio!';
  }

  // Store the dialogue in the cache
  dialogueCache[location] = dialogue;

  return dialogue;
};
