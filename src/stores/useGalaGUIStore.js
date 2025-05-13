import { create } from 'zustand';

/**
 * Zustand store for managing GalaGUI-related global state.
 */
const useGalaGUIStore = create((set) => ({
  selectedItem: null,
  hoveredItem: null,
  options: [],
  selectedItemData: null,
  hoveredItemData: null,
  currentDeck: null, // Store the current deck data
  currentSections: [], // Store the current sections
  navigationHistory: [], // Store navigation history for back button
  isInDeckView: false, // Flag to indicate if we're viewing deck sections

  setSelectedItem: (item) =>
    set((state) => {
      console.log('[setSelectedItem] item:', item);
      // If we're in deck view, handle section selection
      if (state.isInDeckView) {
        return {
          selectedItem: item,
          selectedItemData: item
            ? {
                ...item,
                timestamp: Date.now()
              }
            : null
        };
      }

      // If we're in root view, handle deck selection
      return {
        selectedItem: item,
        selectedItemData: item
          ? {
              ...item,
              timestamp: Date.now()
            }
          : null,
        isInDeckView: true,
        navigationHistory: [...state.navigationHistory, { type: 'deck', item }]
      };
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

  setCurrentDeck: (deck) =>
    set((state) => {
      console.log('[setCurrentDeck] deck:', deck);
      const result = {
        currentDeck: deck,
        currentSections: deck?.sections || [],
        isInDeckView: true,
        navigationHistory: [...state.navigationHistory, { type: 'deck', deck }]
      };
      console.log('[setCurrentDeck] result.currentSections:', result.currentSections);
      return result;
    }),

  goBack: () =>
    set((state) => {
      const newHistory = [...state.navigationHistory];
      newHistory.pop(); // Remove current state
      const previousState = newHistory[newHistory.length - 1];

      if (!previousState) {
        // If no history, return to root view
        return {
          currentDeck: null,
          currentSections: [],
          isInDeckView: false,
          navigationHistory: [],
          selectedItem: null,
          selectedItemData: null
        };
      }

      // Return to previous state
      return {
        currentDeck: previousState.type === 'deck' ? previousState.deck : null,
        currentSections: previousState.type === 'deck' ? previousState.deck?.sections || [] : [],
        isInDeckView: previousState.type === 'deck',
        navigationHistory: newHistory,
        selectedItem: null,
        selectedItemData: null
      };
    }),

  triggerAnimation: false,
  triggerHyperspeed: () => set((state) => ({ triggerAnimation: !state.triggerAnimation })),

  setIsInDeckView: (value) => set({ isInDeckView: value }),

  goToSectionSelect: () =>
    set((state) => ({
      isInDeckView: true,
      selectedItem: null
      // Keep currentDeck and currentSections as-is
    }))
}));

export default useGalaGUIStore;
