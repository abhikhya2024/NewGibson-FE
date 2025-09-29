import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/img/cc.png"
const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: 'bi-graph-up', label: 'Dashboard' },
    { to: '/testimony', icon: 'bi-house', label: 'Search All Testimony' },
    { to: '/transcripts', icon: 'bi-trophy', label: 'Transcripts' },
    // { to: '/table3', icon: 'bi-cart', label: 'Table 3' },
    // { to: '/dashboard1', icon: 'bi-box-seam', label: 'Dashboard 1' },
    
  ];

  return (
    <div className={`sorath-sidebar d-flex flex-column justify-content-between p-3 ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Logo + Brand */}
      <div>
        <div className="d-flex align-items-center mb-4">
          {/* <div className="sorath-logo-box me-3">PS</div> */}
          {/* {isOpen && <h5 className="mb-0 fw-semibold">Panasonic</h5>} */}
          <img height={170} src={logo} alt='logo'/>
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
    
    </div>
  );
};

export default Sidebar;
