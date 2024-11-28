// src/stores/dragStore.js

import { create } from 'zustand';

/**
 * Zustand store to manage dragging state across the app.
 */
const useDragStore = create((set) => ({
  isDragging: false,
  activeDragComponent: null, // Keeps track of the component currently being dragged

  // Function to start dragging, with a component identifier
  startDrag: (componentId) => set({ isDragging: true, activeDragComponent: componentId }),

  // Function to stop dragging
  stopDrag: () => set({ isDragging: false, activeDragComponent: null }),

  // Check if the provided component ID is currently being dragged
  isComponentDragging: (componentId) => (state) => state.activeDragComponent === componentId
}));

export default useDragStore;
