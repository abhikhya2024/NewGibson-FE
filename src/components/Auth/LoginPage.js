import React, {useEffect} from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      navigate("/admin/user-profile");
    }
  }, [accounts]);
  const handleLogin = () => {
    instance
      .loginRedirect({
        scopes: ["User.Read"],
      })
      .then((response) => {
        console.log("Login successful:", response);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  return (
    <div style={styles.container}>
      <h2>Microsoft Login Demo</h2>

      {accounts.length > 0 ? (
        <>
          <p>
            Welcome, <strong>{accounts[0].username}</strong>
          </p>
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={handleLogin} style={styles.button}>
          Login with Microsoft
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "100px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    background: "#0078d4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default LoginPage;
