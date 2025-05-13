import { useGalaGUIStore } from '@stores';
import React, { useEffect } from 'react';
import styles from './LaunchButton.module.scss';

/**
 * LaunchButton component that appears below the GalaGUI and becomes active when a node is hovered.
 * Handles both deck and section selection based on current view.
 *
 * @component
 * @returns {JSX.Element} The rendered LaunchButton component.
 */
const LaunchButton = () => {
  const hoveredItem = useGalaGUIStore((state) => state.hoveredItem);
  const setSelectedItem = useGalaGUIStore((state) => state.setSelectedItem);
  const setCurrentDeck = useGalaGUIStore((state) => state.setCurrentDeck);
  const isInDeckView = useGalaGUIStore((state) => state.isInDeckView);
  const currentDeck = useGalaGUIStore((state) => state.currentDeck);
  const [animationKey, setAnimationKey] = React.useState(0);

  // Update animation key when hovered item changes
  useEffect(() => {
    if (hoveredItem) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [hoveredItem?.id]);

  const handleLaunch = async () => {
    if (!hoveredItem) return;

    if (isInDeckView) {
      // In deck view, find the full section object from currentDeck
      let section = hoveredItem;
      if (currentDeck && currentDeck.sections) {
        const found = currentDeck.sections.find((s) => s.id === hoveredItem.id);
        if (found) section = found;
      }
      // Debug log
      // eslint-disable-next-line no-console
      console.log('[LaunchButton] setSelectedItem (section):', section);
      setSelectedItem(section);
    } else {
      // In root view, load the deck data
      try {
        const response = await fetch(`/data/decks/${hoveredItem.id}.json`);
        if (!response.ok) throw new Error('Failed to load deck');
        const deckData = await response.json();
        setCurrentDeck(deckData);
      } catch (error) {
        console.error('Error loading deck:', error);
        // Handle error appropriately
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && hoveredItem) {
      handleLaunch();
    }
  };

  // Add global keypress listener for Enter key
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [hoveredItem]);

  return (
    <button
      key={animationKey}
      className={`${styles.launchButton} ${hoveredItem ? styles.active : ''}`}
      onClick={handleLaunch}
      disabled={!hoveredItem}
    >
      LAUNCH
    </button>
  );
};

export default LaunchButton;
