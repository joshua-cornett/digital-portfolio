import { useGalaGUIStore } from '@stores';
import React from 'react';
import styles from './LaunchButton.module.scss';

/**
 * LaunchButton component that appears below the GalaGUI and becomes active when a node is hovered.
 *
 * @component
 * @returns {JSX.Element} The rendered LaunchButton component.
 */
const LaunchButton = () => {
  const hoveredItem = useGalaGUIStore((state) => state.hoveredItem);
  const setSelectedItem = useGalaGUIStore((state) => state.setSelectedItem);
  const [animationKey, setAnimationKey] = React.useState(0);

  // Update animation key when hovered item changes
  React.useEffect(() => {
    if (hoveredItem) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [hoveredItem?.id]); // Only trigger on ID change

  const handleLaunch = () => {
    if (hoveredItem) {
      setSelectedItem(hoveredItem);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && hoveredItem) {
      handleLaunch();
    }
  };

  // Add global keypress listener for Enter key
  React.useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [hoveredItem]);

  return (
    <button
      key={animationKey} // Force re-render when hovered item changes
      className={`${styles.launchButton} ${hoveredItem ? styles.active : ''}`}
      onClick={handleLaunch}
      disabled={!hoveredItem}
    >
      LAUNCH
    </button>
  );
};

export default LaunchButton;
