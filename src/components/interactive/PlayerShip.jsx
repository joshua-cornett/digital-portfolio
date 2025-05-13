import React from 'react';
import styles from './PlayerShip.module.scss';

/**
 * PlayerShip component, representing the player's ship.
 *
 * The ship can move and interact with the game environment.
 *
 * @component
 * @returns {JSX.Element} The rendered PlayerShip component.
 */
const PlayerShip = () => {
  return <div className={styles.playerShip} />;
};

export default PlayerShip;
