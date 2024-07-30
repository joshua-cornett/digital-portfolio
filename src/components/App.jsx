// App.jsx

import profilePic from '../assets/me-pixelicious (2).png';
import { Header, TabViewer, Footer } from '../components/shared/index';

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
