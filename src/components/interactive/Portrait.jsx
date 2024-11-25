// Style imports
import styles from './Portrait.module.scss';
// Image import
import portraitImage from '@images/me-pixelicious (2).png';

/**
 * Portrait component that displays a character image with pixel-style corners.
 *
 * @component
 * @returns {JSX.Element} The rendered Portrait component.
 */
const Portrait = () => {
  return (
    <div className={styles.portraitContainer}>
      <div className={styles.pixelBorder}>
        <img
          src={portraitImage}
          alt="Narrator portrait - Joshua Cornett"
          className={styles.portrait}
        />
      </div>
    </div>
  );
};

export default Portrait;
