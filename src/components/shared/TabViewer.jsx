import { Routes, Route } from 'react-router-dom';
// Page imports
import { About, Projects } from '../tabs';

const TabViewer = () => {
  return (
    <main className="content">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </main>
  );
};

export default TabViewer;
