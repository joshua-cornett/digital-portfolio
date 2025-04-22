import { create } from 'zustand';

/**
 * Zustand store for managing GalaGUI-related global state.
 */
const useGalaGUIStore = create((set) => ({
  selectedItem: null,
  hoveredItem: null,
  options: [],

  setSelectedItem: (item) => set({ selectedItem: item }),
  setHoveredItem: (item) => set({ hoveredItem: item }),
  setOptions: (options) => set({ options }),
  triggerAnimation: false,
  triggerHyperspeed: () => set((state) => ({ triggerAnimation: !state.triggerAnimation }))
}));

export default useGalaGUIStore;
