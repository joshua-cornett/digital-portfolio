// React imports
import { useEffect, useId, useState } from 'react';

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
 * @param {string} context - The context for fetching dialogue.
 * @returns {JSX.Element} The rendered narrator component.
 */
const Narrator = ({ isGameMode, context = 'default' }) => {
  const id = useId();
  const [dialogueLines, setDialogueLines] = useState([]);

  useEffect(() => {
    fetch('/data/dialogue.json')
      .then((res) => res.json())
      .then((data) => {
        setDialogueLines(data[context] || data.default || []);
      })
      .catch(() => {
        setDialogueLines(['Welcome to the digital portfolio.']);
      });
  }, [context]);

  // Join lines for Dialogue component
  const narratorDialogue = dialogueLines.join(' ');

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
