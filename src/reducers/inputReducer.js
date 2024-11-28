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
        dragStartX: action.payload.x,
        dragStartY: action.payload.y
      };
    case 'STOP_DRAG':
      return {
        ...state,
        isDragging: false
      };
    case 'UPDATE_DRAG':
      return {
        ...state,
        deltaX: action.payload.deltaX,
        deltaY: action.payload.deltaY
      };
    case 'KEY_DOWN':
      return {
        ...state,
        activeKeys: new Set(state.activeKeys).add(action.payload.key)
      };
    case 'KEY_UP':
      const newActiveKeys = new Set(state.activeKeys);
      newActiveKeys.delete(action.payload.key);
      return {
        ...state,
        activeKeys: newActiveKeys
      };
    default:
      return state;
  }
};

// Initial state for the input reducer
export const initialInputState = {
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  deltaX: 0,
  deltaY: 0,
  activeKeys: new Set()
};

export default inputReducer;
