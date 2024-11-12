// src/components/shared/TabViewer

// React imports
import { Routes, Route } from 'react-router-dom';
// Page imports
import { About, Projects, SkillMatrix } from '../tabs';

/**
 * TabViewer component that renders different content tabs based on the route.
 *
 * @component
 * @returns {JSX.Element} The rendered tab viewer component with route-based content.
 */
const TabViewer = () => {
  return (
    <main className="content">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/matrix" element={<SkillMatrix />} />
      </Routes>
    </main>
  );
};

export default TabViewer;
