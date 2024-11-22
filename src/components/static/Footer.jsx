// src/components/common/Footer.jsx

import styles from './Footer.module.css'; // Import CSS module

// react-icons imports
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

/**
 * Footer component displaying social media links for GitHub, LinkedIn, and email.
 *
 * @component
 * @returns {JSX.Element} The rendered footer component with social media links.
 */
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.socialLinks}>
          {' '}
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
    </footer>
  );
};

export default Footer;
