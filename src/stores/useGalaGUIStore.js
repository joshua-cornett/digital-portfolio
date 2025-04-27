import { create } from 'zustand';

/**
 * Zustand store for managing GalaGUI-related global state.
 */
const useGalaGUIStore = create((set) => ({
  selectedItem: null,
  hoveredItem: null,
  options: [],
  selectedItemData: null, // Store the full data of the selected item
  hoveredItemData: null, // Store the full data of the hovered item

  setSelectedItem: (item) =>
    set({
      selectedItem: item,
      selectedItemData: item
        ? {
            ...item,
            timestamp: Date.now()
          }
        : null
    }),

  setHoveredItem: (item) =>
    set({
      hoveredItem: item,
      hoveredItemData: item
        ? {
            ...item,
            timestamp: Date.now()
          }
        : null
    }),

  setOptions: (options) => set({ options }),

  triggerAnimation: false,
  triggerHyperspeed: () => set((state) => ({ triggerAnimation: !state.triggerAnimation }))
}));

export default useGalaGUIStore;
