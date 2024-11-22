/* eslint-disable import/no-unresolved */
// src/components/common/Narrator.jsx

// React imports
import { useId } from 'react';
// Style imports
import styles from './Narrator.module.css';
import classNames from 'classnames';

// Context imports
import { useLocationDialogue } from '@hooks';
// Component imports
import { Dialogue } from '@interactive';

/**
 * Narrator component that displays my portrait and a dialogue box
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.portrait - The URL or path to the profile picture.
 * @returns {JSX.Element} The rendered narrator component.
 */
const Narrator = ({ portrait }) => {
  const id = useId();
  const narratorDialogue = useLocationDialogue('NarratorDialogue');

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.pixelCornersWrapper}>
        <img
          src={portrait}
          alt="Narrator portrait - Joshua Cornett (Me)"
          className={classNames(styles.portrait, styles.pixelCorners)}
        />
      </div>
      <Dialogue id={id} dialogue={narratorDialogue} className={styles.dialogue}></Dialogue>
    </div>
  );
};

export default Narrator;
