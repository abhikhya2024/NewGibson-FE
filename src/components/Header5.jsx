import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { BsSearch, BsBell, BsMoon, BsSun } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("sorath-dark-mode", !darkMode);
  };

  return (
    <header className="sorath-header d-flex justify-content-between align-items-center px-3 py-2 sticky-top">
      {/* Left: Title + Search */}
      <div className="d-flex align-items-center gap-3">
        <h4 className="mb-0 sorath-page-title">Dashboard</h4>
      </div>

      {/* Right: Icons */}
      <div className="d-flex align-items-center gap-4">
        {/* Search Box */}
        <div className="sorath-search-box d-none d-md-block position-relative">
          <input
            type="text"
            className="form-control sorath-search-input ps-5"
            placeholder="Search here..."
          />
          <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 sorath-search-svg" />
        </div>
        {/* Language Dropdown */}
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            id="dropdown-language"
            className="d-flex align-items-center sorath-lang-dropdown"
          >
            <img
              src="https://flagcdn.com/w40/us.png"
              alt="Lang"
              width="30"
              height="30"
              className="me-2"
            />
            <span className="d-none d-md-inline me-2">Eng (US)</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Eng (US)</Dropdown.Item>
            <Dropdown.Item>Hindi (IN)</Dropdown.Item>
            <Dropdown.Item>Français (FR)</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Theme Toggle */}
        <button onClick={toggleDarkMode} className="sorath-theme-toggle">
          {darkMode ? <BsSun /> : <BsMoon />}
        </button>

        {/* Notifications */}
        <div className="position-relative sorath-notification-icon">
          <BsBell className="fs-5" />
          <span className="sorath-notify-dot position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </div>

        {/* Profile Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle className="d-flex align-items-center gap-3 sorath-profile-dropdown">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="profile"
              className="rounded-circle"
              width="32"
              height="32"
            />
            <div className="d-none d-md-block text-start">
              <div className="sorath-profile-name ">Musfiq</div>
              <div className="small text-muted">Admin</div>
            </div>

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">
              <FaRegUser className="me-2" /> Profile
            </Dropdown.Item>
            <Dropdown.Item href="#">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
