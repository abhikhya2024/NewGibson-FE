import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard2', icon: 'bi-graph-up', label: 'Dashboard 2' },
    { to: '/table', icon: 'bi-house', label: 'Table 1' },
    { to: '/table2', icon: 'bi-trophy', label: 'Table 2' },
    { to: '/table3', icon: 'bi-cart', label: 'Table 3' },
    { to: '/dashboard1', icon: 'bi-box-seam', label: 'Dashboard 1' },
    
  ];

  return (
    <div className={`sorath-sidebar d-flex flex-column justify-content-between p-3 ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Logo + Brand */}
      <div>
        <div className="d-flex align-items-center mb-4">
          <div className="sorath-logo-box me-3">PS</div>
          {isOpen && <h5 className="mb-0 fw-semibold">Panasonic</h5>}
        </div>

        {/* Navigation Items */}
        <ul className="list-unstyled">
          {navItems.map((item, index) => (
            <li key={index} className={`mb-2 ${location.pathname === item.to ? 'sorath-active' : ''}`}>
              <Link
                to={item.to}
                className="d-flex align-items-center text-decoration-none px-3 py-2 rounded sorath-nav-item"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={item.label}
              >
                <i className={`bi ${item.icon}`}></i>
                {isOpen && <span className="ms-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Get Pro Box */}
      <div className="bg-primary rounded text-center text-white p-3 mt-auto sorath-pro-box">
        <div className="mb-2">
          <i className="bi bi-lightning-charge-fill fs-4"></i>
        </div>
        {isOpen && (
          <>
            <h6 className="fw-bold mb-1">Panasonic Pro</h6>
            <p className="mb-2 small">Get access to all features on tetumbas</p>
            <button className="btn btn-light btn-sm text-primary rounded-pill px-3">Get Pro</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
