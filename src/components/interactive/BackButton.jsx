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
  const goBack = useGalaGUIStore((state) => state.goBack);

  if (!isInDeckView) return null;

  return (
    <button className={styles.backButton} onClick={goBack}>
      BACK
    </button>
  );
};

export default BackButton;
