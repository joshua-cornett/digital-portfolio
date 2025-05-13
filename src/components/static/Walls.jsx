import React from 'react';
import styles from './Walls.module.scss';

/**
 * Walls component, representing the barriers on either side of the PlayArea.
 *
 * "YOU SHALL NOT PASS!"
 *
 * @component
 * @returns {JSX.Element} The rendered Walls component.
 */
const Walls = () => {
  return (
    <div className={styles.walls}>
      <div className={styles.wall} aria-label="Left Wall">
        Wall
      </div>
      <div className={styles.wall} aria-label="Right Wall">
        Wall
      </div>
    </div>
  );
};

export default Walls;
