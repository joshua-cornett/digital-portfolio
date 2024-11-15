// src/App.jsx

// Asset imports
import profilePic from './assets/me-pixelicious (2).png';
// Component imports
import { Header, TabViewer, Footer } from './components/shared/index';

/**
 * Main application component that renders the header, tab viewer, and footer.
 *
 * @component
 * @returns {JSX.Element} The main app component.
 */
const App = () => {
  return (
    <div className="App">
      <Header profilePic={profilePic}></Header>
      <TabViewer></TabViewer>
      <Footer></Footer>
    </div>
  );
};

export default App;
