import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PopupMenu from './PopupMenu';
import OptionsPage1 from './OptionsPage1';
import OptionsPage2 from './OptionsPage2';
import { CanvasApiProvider } from './CanvasApiContext'; // Import the provider

function App() {
  return (
    <CanvasApiProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PopupMenu />} />
          <Route path="/options1" element={<OptionsPage1 />} />
          <Route path="/options2" element={<OptionsPage2 />} /> 
        </Routes>
      </Router>
    </CanvasApiProvider>
  );
}

export default App;
