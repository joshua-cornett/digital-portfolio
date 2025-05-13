import { act, renderHook } from '@testing-library/react';
import useGalaGUIStore from './useGalaGUIStore';

describe('useGalaGUIStore', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useGalaGUIStore.setState({
        selectedItem: null,
        hoveredItem: null,
        options: [],
        selectedItemData: null,
        hoveredItemData: null,
        currentDeck: null,
        currentSections: [],
        navigationHistory: [],
        isInDeckView: false
      });
    });
  });

  describe('deck navigation', () => {
    it('should handle deck selection and update state accordingly', () => {
      const { result } = renderHook(() => useGalaGUIStore());
      const mockDeck = { id: 'deck-alpha', title: 'Alpha Deck' };

      act(() => {
        result.current.setCurrentDeck(mockDeck);
      });

      expect(result.current.currentDeck).toEqual(mockDeck);
      expect(result.current.isInDeckView).toBe(true);
      expect(result.current.navigationHistory).toHaveLength(1);
      expect(result.current.navigationHistory[0]).toEqual({
        type: 'deck',
        deck: mockDeck
      });
    });

    it('should handle going back from deck view to root view', () => {
      const { result } = renderHook(() => useGalaGUIStore());
      const mockDeck = { id: 'deck-alpha', title: 'Alpha Deck' };

      // First enter deck view
      act(() => {
        result.current.setCurrentDeck(mockDeck);
      });

      // Then go back
      act(() => {
        result.current.goBack();
      });

      expect(result.current.currentDeck).toBeNull();
      expect(result.current.isInDeckView).toBe(false);
      expect(result.current.navigationHistory).toHaveLength(0);
      expect(result.current.selectedItem).toBeNull();
    });

    it('should handle section selection in deck view', () => {
      const { result } = renderHook(() => useGalaGUIStore());
      const mockSection = { id: 'section-1', title: 'Section 1' };

      // First enter deck view
      act(() => {
        result.current.setCurrentDeck({ id: 'deck-alpha', sections: [mockSection] });
      });

      // Then select a section
      act(() => {
        result.current.setSelectedItem(mockSection);
      });

      expect(result.current.selectedItem).toEqual(mockSection);
      expect(result.current.selectedItemData).toBeTruthy();
      expect(result.current.selectedItemData.timestamp).toBeDefined();
    });
  });
});
