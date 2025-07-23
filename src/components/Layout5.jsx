import React, { useState, useEffect } from 'react';
import Header from './Header5';
import Sidebar from './Sidebar5';
import { Outlet } from 'react-router-dom';
import '../assets/css/dashboard2.css';

const Layout5 = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="sorath-layout d-flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="sorath-main-wrapper flex-grow-1 d-flex flex-column">
        <Header
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <main className="sorath-content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

// ✅ FIX HERE
export default Layout5;
