import useGalaGUIStore from '@stores/useGalaGUIStore';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LaunchButton from './LaunchButton';

// Mock the store
vi.mock('@stores/useGalaGUIStore', () => ({
  default: vi.fn()
}));

describe('LaunchButton', () => {
  const mockSetSelectedItem = vi.fn();
  const mockHoveredItem = { id: 'test-id', title: 'Test Node' };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store mock for each test
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: null,
        setSelectedItem: mockSetSelectedItem
      })
    );
  });

  it('renders in disabled state when hoveredNode is null', () => {
    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });

    expect(button).toBeDisabled();
  });

  it('becomes active when hoveredNode is set', () => {
    // Mock store to return a hovered item
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockHoveredItem,
        setSelectedItem: mockSetSelectedItem
      })
    );

    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });

    expect(button).not.toBeDisabled();
  });

  it('calls setSelectedItem when clicked if hovered', () => {
    // Mock store to return a hovered item
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockHoveredItem,
        setSelectedItem: mockSetSelectedItem
      })
    );

    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });

    fireEvent.click(button);
    expect(mockSetSelectedItem).toHaveBeenCalledWith(mockHoveredItem);
  });

  it('does not call setSelectedItem when clicked if not hovered', () => {
    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });

    fireEvent.click(button);
    expect(mockSetSelectedItem).not.toHaveBeenCalled();
  });

  it('triggers selection when Enter key is pressed and node is hovered', () => {
    // Mock store to return a hovered item
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockHoveredItem,
        setSelectedItem: mockSetSelectedItem
      })
    );

    render(<LaunchButton />);

    // Simulate Enter key press
    fireEvent.keyPress(document, { key: 'Enter', code: 'Enter' });
    expect(mockSetSelectedItem).toHaveBeenCalledWith(mockHoveredItem);
  });

  it('does not trigger selection when Enter key is pressed and no node is hovered', () => {
    render(<LaunchButton />);

    // Simulate Enter key press
    fireEvent.keyPress(document, { key: 'Enter', code: 'Enter' });
    expect(mockSetSelectedItem).not.toHaveBeenCalled();
  });

  it('does not interfere with GalaGUI pointer dragging', () => {
    // Mock store to return a hovered item
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        hoveredItem: mockHoveredItem,
        setSelectedItem: mockSetSelectedItem
      })
    );

    render(<LaunchButton />);
    const button = screen.getByRole('button', { name: /launch/i });

    // Simulate pointer events that should be handled by GalaGUI
    const pointerDownEvent = new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100
    });

    // The button should not prevent the event from bubbling
    const prevented = !button.dispatchEvent(pointerDownEvent);
    expect(prevented).toBe(false);
  });
});
