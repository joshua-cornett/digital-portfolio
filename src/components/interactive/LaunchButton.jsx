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
      setSelectedItem(section);
    } else {
      // In root view, load the deck data
      try {
        const response = await fetch(`data/decks/${hoveredItem.id}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load deck: ${response.status} ${response.statusText}`);
        }
        const deckData = await response.json();

        // Validate deck data structure
        if (!deckData.id || !deckData.title || !Array.isArray(deckData.sections)) {
          throw new Error('Invalid deck data format');
        }

        // Validate each section has required fields
        const validSections = deckData.sections.every(
          (section) => section.id && section.title && Array.isArray(section.slides)
        );

        if (!validSections) {
          throw new Error('Invalid section data format');
        }

        setCurrentDeck(deckData);
      } catch (error) {
        console.error('Error loading deck:', error);
        // Show error state in the UI
        setCurrentDeck({
          id: 'error',
          title: 'Error Loading Deck',
          sections: [
            {
              id: 'error',
              title: 'Failed to Load Content',
              slides: [
                {
                  id: 'error',
                  label: 'Error',
                  type: 'narrative',
                  base: {
                    heading: 'Error Loading Deck',
                    body: 'There was a problem loading this deck. Please try refreshing the page.',
                    readings: {
                      A: { label: 'Error', content: ['Failed to load deck data'] },
                      B: { label: 'Details', content: [error.message] },
                      C: { label: 'Action', content: ['Try refreshing the page'] },
                      D: { label: 'Status', content: ['Content unavailable'] }
                    }
                  }
                }
              ]
            }
          ]
        });
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
