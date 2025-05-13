import { GalaGUI, LaunchButton, PlayerShip } from '@interactive';
import { Canvas } from '@react-three/fiber';
import { Walls } from '@static';
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
          <LaunchButton />
        </div>
      </ErrorBoundary>

      {/* PlayerShip Component */}
      <ErrorBoundary
        fallback={<div className={styles.error}>Something went wrong in PlayerShip</div>}
      >
        <div className={styles.playerShipContainer}>
          <PlayerShip />
        </div>
      </ErrorBoundary>

      {/* Walls Component */}
      <ErrorBoundary fallback={<div className={styles.error}>Something went wrong in Walls</div>}>
        <div className={styles.walls}>
          <Walls />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default PlayArea;
