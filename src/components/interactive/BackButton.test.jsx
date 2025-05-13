import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useGalaGUIStore from '../../stores/useGalaGUIStore';
import BackButton from './BackButton';

// Mock the store
vi.mock('../../stores/useGalaGUIStore', () => ({
  default: vi.fn()
}));

describe('BackButton', () => {
  const mockGoBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        isInDeckView: false,
        goBack: mockGoBack
      })
    );
  });

  it('should not render when not in deck view', () => {
    render(<BackButton />);
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('should render when in deck view', () => {
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        isInDeckView: true,
        goBack: mockGoBack
      })
    );

    render(<BackButton />);
    const button = screen.getByRole('button', { name: /back/i });
    expect(button).toBeInTheDocument();
  });

  it('should call goBack when clicked', () => {
    useGalaGUIStore.mockImplementation((selector) =>
      selector({
        isInDeckView: true,
        goBack: mockGoBack
      })
    );

    render(<BackButton />);
    const button = screen.getByRole('button', { name: /back/i });
    fireEvent.click(button);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
