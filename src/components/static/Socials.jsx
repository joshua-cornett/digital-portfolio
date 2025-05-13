// React imports
import { Html } from '@react-three/drei';
// react-icons imports
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
// Style imports
import styles from './Socials.module.scss';

/**
 * Socials component displaying social media links for GitHub, LinkedIn, and email.
 *
 * @component
 * @returns {JSX.Element} The rendered Socials component with social media links.
 */
const Socials = () => {
  return (
    <div className={styles.socials}>
      <div className={styles.socialLinks}>
        <a
          href="https://github.com/joshua-cornett"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub className={styles.socialIcon} />
        </a>
        <a
          href="https://www.linkedin.com/in/joshua-cornett"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin className={styles.socialIcon} />
        </a>
        <a href="mailto:joshua.m.cornett@protonmail.com" aria-label="ProtonMail">
          <HiOutlineMail className={styles.socialIcon} />
        </a>
      </div>
    </div>
  );
};

export default Socials;
