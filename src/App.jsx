import { useSynchronizedRenderLoop } from '@hooks';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Narrator, OortCloud, PlayArea } from '@static';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import BackButton from './components/interactive/BackButton';
import SlideWithSteps from './components/static/SlideWithSteps';
import Socials from './components/static/Socials';
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
  const setIsInDeckView = useGalaGUIStore((state) => state.setIsInDeckView);

  // Determine if a section is selected (in deck view, selectedItem is a section)
  const isSectionSelected =
    isInDeckView && selectedItem && selectedItem.slides && selectedItem.slides.length > 0;

  // Slide navigation state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = isSectionSelected ? selectedItem.slides : [];
  const currentSlide = slides[currentSlideIndex];

  // Debug log
  // eslint-disable-next-line no-console
  console.log('App rendering', { isSectionSelected, currentSlideIndex, currentSlide });

  // Determine Narrator context
  let narratorContext = 'default';
  if (!isInDeckView) {
    narratorContext = 'deckSelect';
  } else if (isInDeckView && !isSectionSelected) {
    narratorContext = 'sectionSelect';
  } else if (isSectionSelected && currentSlide) {
    narratorContext = 'slideView';
  }

  return (
    <div className={styles.app}>
      <div className={styles.socialsArea}>
        <Socials />
      </div>
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
            <Narrator isGameMode={isGameMode} context={narratorContext} />
          </ErrorBoundary>
        </div>
      )}

      {/* PlayArea or Slide Section */}
      <div className={styles.playArea}>
        <ErrorBoundary fallback={<div className={styles.error}>PlayArea failed to load</div>}>
          {isSectionSelected && currentSlide ? (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 16
                }}
              >
                <BackButton />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    marginTop: 32
                  }}
                >
                  <SlideWithSteps
                    slide={currentSlide}
                    onPrevSlide={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                    onNextSlide={() =>
                      setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))
                    }
                    isFirstSlide={currentSlideIndex === 0}
                    isLastSlide={currentSlideIndex === slides.length - 1}
                  />
                </div>
              </div>
            </>
          ) : (
            <PlayArea />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
