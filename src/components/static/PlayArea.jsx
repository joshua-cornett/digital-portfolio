import React from 'react';
import { useDimensionContext } from '@contexts';
import styles from './PlayArea.module.css';

const PlayArea = () => {
  const { playArea } = useDimensionContext();

  return (
    <div
      className={styles.playArea}
      style={{
        width: `${playArea.width}px`,
        height: `${playArea.height}px`
      }}
    >
      <h1>Welcome to the PlayArea!</h1>
    </div>
  );
};

export default PlayArea;
