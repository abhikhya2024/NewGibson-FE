import { useMsal } from "@azure/msal-react";

const Header = ({ isOpen, toggle }) => {
  const { accounts } = useMsal();

  const name = accounts[0]?.idTokenClaims?.name; // Display Name
  const upn = accounts[0]?.idTokenClaims?.preferred_username;
  const initials = getInitials(name);

  const { instance } = useMsal();
  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/login", // redirect to homepage or login
    });
  };

function getInitials(name) {
  if (!name) return "";
  
  const words = name.trim().split(/\s+/); // Split by any amount of whitespace

  const firstInitial = words[0]?.[0] || "";
  const secondInitial = words[1]?.[0] || "";

  return (firstInitial + secondInitial).toUpperCase();
}
  return (
    <nav className="navbar navbar-light bg-light shadow-sm px-3 d-flex justify-content-between align-items-center">
      {/* Left: Toggle Button */}
      <button className="btn toggle-btn" onClick={toggle}>
        <i
          className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}
        ></i>
      </button>

      {/* Right: Notification + Profile */}
      <div className="d-flex align-items-center gap-3">
        {/* Notification Icon */}
        <button className="bel-sorath btn position-relative">
          <i className="bi bi-bell fs-5"></i>
          <span className="position-absolute translate-middle p-1 rounded-circle">
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
            {/* <i className="bi bi-person-circle fs-5 me-1"></i> */}
            <div
              style={{
                backgroundColor: "#007bff", // Bootstrap primary blue
                color: "white",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "16px",
              }}
              title={name}
            >
              {getInitials(name)}
            </div>
            {/* <span className="d-none d-md-inline">Profile</span> */}
          </button>
          <ul className="dropdown-menu" aria-labelledby="profileDropdown">
            <li>
              <a className="dropdown-item" href="#">
                👤 My Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                ⚙️ Settings
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item text-danger"
                href="#"
                onClick={handleLogout}
              >
                🚪 Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
