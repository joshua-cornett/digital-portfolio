import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import { OortCloud, PlayArea, Narrator, Socials } from '@static';
import { useSynchronizedRenderLoop } from '@hooks';
import styles from './styles/App.module.scss';

/**
 * Main application component that renders the app's primary layout and components.
 *
 * @component
 * @returns {JSX.Element} The main application structure.
 */
const App = () => {
  const isGameMode = false; // Replace with Zustand state when integrated
  useSynchronizedRenderLoop();

  return (
    <div className={styles.app}>
      {/* Canvas for OortCloud */}
      <div className={styles.canvas}>
        <Canvas>
          <ErrorBoundary fallback={<div className={styles.error}>OortCloud failed to load</div>}>
            <OortCloud />
          </ErrorBoundary>

          {/* Narrator in Game Mode */}
          {isGameMode && (
            <ErrorBoundary fallback={<div className={styles.error}>Narrator failed to load</div>}>
              <Html>
                <Narrator isGameMode={isGameMode} />
              </Html>
            </ErrorBoundary>
          )}
        </Canvas>
      </div>

      {/* Narrator in Non-Game Mode */}
      {!isGameMode && (
        <div className={`${styles.narrator} ${styles.domMode}`}>
          <ErrorBoundary fallback={<div className={styles.error}>Narrator failed to load</div>}>
            <Narrator isGameMode={isGameMode} />
          </ErrorBoundary>
        </div>
      )}

      {/* PlayArea Section */}
      <div className={styles.playArea}>
        <ErrorBoundary fallback={<div className={styles.error}>PlayArea failed to load</div>}>
          <PlayArea />
        </ErrorBoundary>
      </div>

      {/* Socials Section */}
      <footer className={styles.socialsContainer}>
        <ErrorBoundary fallback={<div className={styles.error}>Socials failed to load</div>}>
          <Socials />
        </ErrorBoundary>
      </footer>
    </div>
  );
};

export default App;
