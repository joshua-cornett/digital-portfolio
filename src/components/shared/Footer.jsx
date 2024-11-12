// src/components/shared/Footer.jsx

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
    <footer className="footer">
      <div className="container">
        <div className="social-links">
          {' '}
          <a
            href="https://github.com/joshua-cornett"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub className="social-icon" />
          </a>
          <a
            href="https://www.linkedin.com/in/joshua-cornett"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="social-icon" />
          </a>
          <a href="mailto:joshua.m.cornett@protonmail.com" aria-label="ProtonMail">
            <HiOutlineMail className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
