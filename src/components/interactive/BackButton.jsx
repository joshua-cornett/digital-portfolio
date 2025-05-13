import { useGalaGUIStore } from '@stores';
import React from 'react';
import styles from './BackButton.module.scss';

/**
 * BackButton component that appears when in deck view and allows navigation back to the root view.
 *
 * @component
 * @returns {JSX.Element} The rendered BackButton component.
 */
const BackButton = () => {
  const isInDeckView = useGalaGUIStore((state) => state.isInDeckView);
  const selectedItem = useGalaGUIStore((state) => state.selectedItem);
  const goBack = useGalaGUIStore((state) => state.goBack);
  const goToSectionSelect = useGalaGUIStore((state) => state.goToSectionSelect);

  if (!isInDeckView) return null;

  // If a section is selected (i.e., in slide view), go to section select; otherwise, goBack
  const handleBack = () => {
    if (selectedItem && selectedItem.slides) {
      goToSectionSelect();
    } else {
      goBack();
    }
  };

  return (
    <button className={styles.backButton} onClick={handleBack}>
      BACK
    </button>
  );
};

export default BackButton;
