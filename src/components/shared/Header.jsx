// Header.jsx

// React imports
import { useId } from 'react';
import { Link } from 'react-router-dom';

// Context imports

import { useLocationDialogue } from '../../utils/hooks/useLocationDialogue';

import Dialogue from './Dialogue';

const Header = ({ profilePic }) => {
  const id = useId();

  const headerDialogue = useLocationDialogue('HeaderDialogue'); // Use custom hook

  return (
    <header>
      <div className="profile-dialogue--wrapper">
        <div className="pixel-corners--wrapper">
          <img
            src={profilePic}
            alt="Profile Pic for Joshua Cornett"
            className="profile-pic pixel-corners"
          />
        </div>
        <div className="dialogue-box">
          <Dialogue id={id} dialogue={headerDialogue} className="dialogue"></Dialogue>
        </div>
      </div>
      {/**TODO: Atomize this */}
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
