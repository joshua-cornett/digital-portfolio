import { useSynchronizedRenderLoop } from '@hooks';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Narrator, OortCloud, PlayArea, Socials } from '@static';
import { ErrorBoundary } from 'react-error-boundary';
import Slide from './components/static/Slide';
import useGalaGUIStore from './stores/useGalaGUIStore';
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

  // Get selected section and its first slide
  const selectedItem = useGalaGUIStore((state) => state.selectedItem);
  const isInDeckView = useGalaGUIStore((state) => state.isInDeckView);
  const currentDeck = useGalaGUIStore((state) => state.currentDeck);

  // Determine if a section is selected (in deck view, selectedItem is a section)
  const isSectionSelected =
    isInDeckView && selectedItem && selectedItem.slides && selectedItem.slides.length > 0;
  const firstSlide = isSectionSelected ? selectedItem.slides[0].base : null;
  const firstSlideReadings = isSectionSelected ? selectedItem.slides[0].base.readings : null;

  // Debug log
  // eslint-disable-next-line no-console
  console.log('App rendering', { isSectionSelected, firstSlide });

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

      {/* PlayArea or Slide Section */}
      <div className={styles.playArea}>
        <ErrorBoundary fallback={<div className={styles.error}>PlayArea failed to load</div>}>
          {isSectionSelected && firstSlide ? (
            <Slide slide={{ ...firstSlide, readings: firstSlideReadings }} />
          ) : (
            <PlayArea />
          )}
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
