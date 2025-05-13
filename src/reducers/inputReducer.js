// galaGUIInputReducer.js

/**
 * Generic reducer for managing input state across multiple components.
 *
 * Handles keyboard input, dragging, clicking, and other types of user interaction.
 *
 * @param {Object} state - Current state of inputs.
 * @param {Object} action - Action to be handled.
 * @returns {Object} - New state after action is applied.
 */
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        isDragging: true,
        startPosition: { x: action.payload.x, y: action.payload.y }
      };
    case 'UPDATE_DRAG':
      return {
        ...state,
        currentPosition: {
          x: action.payload.x,
          y: action.payload.y
        }
      };
    case 'STOP_DRAG':
      return {
        ...state,
        isDragging: false,
        startPosition: null,
        currentPosition: null
      };
    default:
      return state;
  }
};

// Initial state for the input reducer
export const initialInputState = {
  isDragging: false,
  startPosition: null,
  currentPosition: null,
  activeKeys: new Set()
};

export default inputReducer;
