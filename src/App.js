import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Dashboard from './Pages/Dashboard/index';
import Dashboard2 from './Pages/Dashboard/index2';
import Dashboard3 from './Pages/Dashboard/index3';
import Layout from './components/Layout';
import Layout2 from './components/Layout2';
import Layout3 from './components/Layout3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/css/style.css';

function App() {
  
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard2" element={<Layout2><Dashboard2 /></Layout2>} />
        <Route path="/dashboard3" element={<Layout3><Dashboard3 /></Layout3>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
