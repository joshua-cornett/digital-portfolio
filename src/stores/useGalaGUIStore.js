import { create } from 'zustand';

/**
 * Zustand store for managing GalaGUI-related global state.
 */
const useGalaGUIStore = create((set) => ({
  selectedItem: null, // Currently selected item in GalaGUI
  hoveredItem: null, // Currently hovered item
  triggerAnimation: false, // Trigger parallax animation flag

  // Actions to update the state
  setSelectedItem: (item) => set({ selectedItem: item }),
  setHoveredItem: (item) => set({ hoveredItem: item }),
  triggerHyperspeed: () => set((state) => ({ triggerAnimation: !state.triggerAnimation }))
}));

export default useGalaGUIStore;
