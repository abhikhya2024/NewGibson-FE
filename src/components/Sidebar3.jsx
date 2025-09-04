import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as bootstrap from 'bootstrap';

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();

  // Initialize Bootstrap tooltips
useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

  // Dispose old tooltips if any
  tooltipTriggerList.forEach((el) => {
    if (el._tooltipInstance) {
      el._tooltipInstance.dispose();
      delete el._tooltipInstance;
    }
  });

  // Enable tooltip only for screens <= 768px
  if (window.innerWidth <= 768) {
    tooltipTriggerList.forEach((el) => {
      const instance = new bootstrap.Tooltip(el, {
        trigger: 'click',
        delay: { show: 200, hide: 100 },
      });
      // Store instance for cleanup
      el._tooltipInstance = instance;
    });
  }
}, [isOpen]);



  return (
    <div className={`sidebar third-option text-white ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Header with Logo */}
      <div className="sidebar-header d-flex align-items-center p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <div className="logo-box bg-primary text-white fw-bold me-2 d-flex justify-content-center align-items-center">
            GB
          </div>
          {isOpen && <h5 className="mb-0">Gibson</h5>}
        </div>
      </div>

      {/* Sidebar Links */}
      <ul className="list-unstyled mt-4 sorath-header-li">
         <li className={`btn-style2 px-3 ${location.pathname === '/dashboard1' ? 'active' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard1"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Dashboard"
          >
            <i className="bi bi-house"></i>
            <span className="menu-text ms-3">Dashboard</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3 ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/testimony"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Dashboard"
          >
            <i className="bi bi-house"></i>
            <span className="menu-text ms-3">Search All Testimony</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3 ${location.pathname === '/dashboard2' ? 'active2' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard2"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Dashboard2"
          >
            <i className="bi bi-person"></i>
            <span className="menu-text ms-3">Testimony by Topic</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3 ${location.pathname === '/dashboard3' ? 'active3' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/transcripts"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Transcripts</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard3"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Topics</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard3"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Topics by Frequency</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard3"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Word Cloud</span>
          </Link>
        </li>
      </ul>

      
    </div>
  );
};

export default Sidebar;
