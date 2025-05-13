import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useGalaGUIStore from '../../stores/useGalaGUIStore';
import LaunchButton from './LaunchButton';

// Mock the store
vi.mock('../../stores/useGalaGUIStore', () => ({
  default: vi.fn()
}));

// Mock fetch
global.fetch = vi.fn();

describe('LaunchButton', () => {
  const mockSetSelectedItem = vi.fn();
  const mockSetCurrentDeck = vi.fn();
  const mockHoveredItem = { id: 'deck-alpha', title: 'Alpha Deck' };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockReset();
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: null,
        setSelectedItem: mockSetSelectedItem,
        setCurrentDeck: mockSetCurrentDeck,
        isInDeckView: false
      })
    );
  });

  it('should be disabled when no item is hovered', () => {
    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });
    expect(button).toBeDisabled();
  });

  it('should be enabled when an item is hovered', () => {
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockHoveredItem,
        setSelectedItem: mockSetSelectedItem,
        setCurrentDeck: mockSetCurrentDeck,
        isInDeckView: false
      })
    );

    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });
    expect(button).not.toBeDisabled();
  });

  it('should load deck data and set current deck when in root view', async () => {
    const mockDeckData = { id: 'deck-alpha', title: 'Alpha Deck', sections: [] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockDeckData)
    });

    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockHoveredItem,
        setSelectedItem: mockSetSelectedItem,
        setCurrentDeck: mockSetCurrentDeck,
        isInDeckView: false
      })
    );

    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/data/decks/deck-alpha.json');
      expect(mockSetCurrentDeck).toHaveBeenCalledWith(mockDeckData);
    });
  });

  it('should select section when in deck view', () => {
    const mockSection = { id: 'section-1', title: 'Section 1' };
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockSection,
        setSelectedItem: mockSetSelectedItem,
        setCurrentDeck: mockSetCurrentDeck,
        isInDeckView: true
      })
    );

    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });
    fireEvent.click(button);

    expect(mockSetSelectedItem).toHaveBeenCalledWith(mockSection);
    expect(mockSetCurrentDeck).not.toHaveBeenCalled();
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockHoveredItem,
        setSelectedItem: mockSetSelectedItem,
        setCurrentDeck: mockSetCurrentDeck,
        isInDeckView: false
      })
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(mockSetCurrentDeck).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should trigger launch on Enter key press when item is hovered', () => {
    const mockSection = { id: 'section-1', title: 'Section 1' };
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockSection,
        setSelectedItem: mockSetSelectedItem,
        setCurrentDeck: mockSetCurrentDeck,
        isInDeckView: true
      })
    );

    render(<LaunchButton />);
    fireEvent.keyPress(document, { key: 'Enter', code: 'Enter' });

    expect(mockSetSelectedItem).toHaveBeenCalledWith(mockSection);
  });
});
