// React imports
import { useId } from 'react';

// Style imports
import styles from './Narrator.module.scss';

// Component imports
import { Dialogue, Portrait } from '@interactive';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Narrator component that displays a portrait and a dialogue box.
 * Handles both 2D and 3D contexts using modular components.
 *
 * @component
 * @param {boolean} isGameMode - Determines the rendering context.
 * @returns {JSX.Element} The rendered narrator component.
 */
const Narrator = ({ isGameMode }) => {
  const id = useId();
  const narratorDialogue =
    "Heyo! I'm Josh! This <b><i>Oort</i></b>folio is still under development. In the meantime, feel free to test out the GUI below by clicking and dragging.";

  // Content of the Narrator component
  const narratorContent = (
    <div className={styles.narrator}>
      {/* Portrait Component */}
      <ErrorBoundary
        fallback={<div className={styles.errorFallback}>Portrait failed to load.</div>}
      >
        <div className={styles.portrait}>
          <Portrait />
        </div>
      </ErrorBoundary>

      {/* Dialogue Component */}
      <ErrorBoundary
        fallback={<div className={styles.errorFallback}>Dialogue failed to load.</div>}
      >
        <div className={styles.dialogue}>
          <Dialogue id={id} dialogue={narratorDialogue} />
        </div>
      </ErrorBoundary>
    </div>
  );

  /** @TODO - Conditionally wrap content with Html for 3D context */
  return isGameMode ? { narratorContent } : narratorContent;
};

export default Narrator;
