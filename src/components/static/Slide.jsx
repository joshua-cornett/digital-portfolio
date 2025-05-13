import React from 'react';
import Panel from './Panel';
import styles from './Slide.module.scss';
import Socials from './Socials';

/**
 * Slide component renders a slide's heading, body, and readings in a sci-fi HUD layout.
 * @param {Object} props
 * @param {Object} props.slide - The slide data (heading, body, readings)
 */
const Slide = ({ slide }) => {
  const readings = slide.readings || {};
  return (
    <div className={styles.slideGrid}>
      <div className={styles.socials}>
        <Socials />
      </div>
      <div className={styles.panelA}>
        <Panel type="A" label={readings.A?.label}>
          {readings.A?.content?.join(' ')}
        </Panel>
      </div>
      <div className={styles.panelB}>
        <Panel type="B" label={readings.B?.label}>
          {readings.B?.content?.join(' ')}
        </Panel>
      </div>
      <div className={styles.panelC}>
        <Panel type="C" label={readings.C?.label}>
          {readings.C?.content?.join(' ')}
        </Panel>
      </div>
      <div className={styles.panelD}>
        <Panel type="D" label={readings.D?.label}>
          {readings.D?.content?.join(' ')}
        </Panel>
      </div>
      <div className={styles.panelMain}>
        <Panel type="main">{[slide.heading, '', slide.body].filter(Boolean).join('\n\n')}</Panel>
      </div>
    </div>
  );
};

export default Slide;
