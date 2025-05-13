import React from 'react';
import styles from './Panel.module.scss';

/**
 * Panel component for Slide layout. Type can be 'A', 'B', 'C', 'D', or 'main'.
 * @param {Object} props
 * @param {'A'|'B'|'C'|'D'|'main'} props.type - Panel type
 * @param {string} [props.label] - Optional label for A/B/C/D panels
 * @param {React.ReactNode} [props.children] - Panel content
 */
const Panel = ({ type, label, children }) => {
  const typeClass = styles[`panel${type.charAt(0).toUpperCase() + type.slice(1)}`] || styles.panel;
  return (
    <div className={`${styles.panel} ${typeClass}`}>
      <div className={styles.scanlines} />
      {label && <div className={styles.panelLabel}>{label}</div>}
      <div className={styles.panelContent}>{children}</div>
    </div>
  );
};

export default Panel;
