// src/components/shared/TabViewer

// React imports
import { Routes, Route } from 'react-router-dom';
// Style imports
import styles from './TabViewer.module.css';
// Page imports
import { About, Projects } from '../../pages';

/**
 * TabViewer component that renders different content tabs based on the route.
 *
 * @component
 * @returns {JSX.Element} The rendered tab viewer component with route-based content.
 */
const TabViewer = () => {
  return (
    <main className={styles.tab}>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </main>
  );
};

export default TabViewer;
