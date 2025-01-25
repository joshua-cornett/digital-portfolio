// reducers/inputReducer.js

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        isDragging: true,
        startPosition: action.payload,
        currentPosition: action.payload
      };
    case 'UPDATE_DRAG':
      return {
        ...state,
        currentPosition: action.payload
      };
    case 'STOP_DRAG':
      return {
        ...state,
        isDragging: false,
        startPosition: null,
        currentPosition: null
      };
    case 'KEY_PRESS':
      return {
        ...state,
        activeKeys: new Set(state.activeKeys).add(action.payload.key)
      };
    case 'KEY_RELEASE':
      const updatedKeys = new Set(state.activeKeys);
      updatedKeys.delete(action.payload.key);
      return { ...state, activeKeys: updatedKeys };
    default:
      return state;
  }
};

export const initialInputState = {
  isDragging: false,
  startPosition: null,
  currentPosition: null,
  activeKeys: new Set()
};

export default inputReducer;
