const Header = ({ isOpen, toggle }) => {
  return (
    <nav className="navbar navbar-light bg-light shadow-sm px-3 d-flex justify-content-between align-items-center">
      {/* Left: Toggle Button */}
      <button className="btn btn-primary" onClick={toggle}>
        <i className={`bi ${isOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
      </button>

      {/* Right: Notification + Profile */}
      <div className="d-flex align-items-center gap-3">
        {/* Notification Icon */}
        <button className="btn btn-light position-relative">
          <i className="bi bi-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>

        {/* Profile Dropdown (hover-enabled) */}
        <div className="dropdown dropdown-hover">
          <button
            className="btn btn-style1 d-flex align-items-center dropdown-toggle"
            type="button"
            id="profileDropdown"
          >
            <i className="bi bi-person-circle fs-5 me-1"></i>
            <span className="d-none d-md-inline">Profile</span>
          </button>
          <ul className="dropdown-menu" aria-labelledby="profileDropdown">
            <li><a className="dropdown-item" href="#">👤 My Profile</a></li>
            <li><a className="dropdown-item" href="#">⚙️ Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">🚪 Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
