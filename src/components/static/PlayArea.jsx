import { BackButton, GalaGUI, LaunchButton } from '@interactive';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styles from './PlayArea.module.scss';

/**
 * PlayArea component that hosts the GalaGUI, PlayerShip, and Walls.
 * Dynamically adjusts size to match the viewport dimensions.
 *
 * @component
 * @returns {JSX.Element} The rendered PlayArea component.
 */
const PlayArea = () => {
  return (
    <div className={styles.playArea}>
      {/* GalaGUI Component */}
      <ErrorBoundary fallback={<div className={styles.error}>Something went wrong in GalaGUI</div>}>
        <div className={styles.galaGUICanvasContainer}>
          <Canvas className={styles.galaGUICanvas}>
            <GalaGUI />
          </Canvas>
          <div className={styles.buttonContainer}>
            <BackButton />
            <LaunchButton />
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default PlayArea;
