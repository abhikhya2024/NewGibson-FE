import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

import Dashboard from './Pages/Dashboard/index';
import Dashboard1 from './Pages/Dashboard/Dashboard';
import Dashboard2 from './Pages/Dashboard/Dashboard2';

// import Dashboard2 from './Pages/Dashboard/index2';
import Dashboard3 from './Pages/Dashboard/index3';

import Layout from './components/Layout';
import Layout2 from './components/Layout2';
import Layout3 from './components/Layout3';
import Layout4 from "./components/Layout4";
import Layout5 from "./components/Layout5";

import Login from './Pages/Auth/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/css/style.css';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

// ✅ Private route wrapper using MSAL hook
function PrivateRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      setLoading(false);
    }
  }, [inProgress]);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard2" element={<Layout2><Dashboard2 /></Layout2>} /> */}
        <Route path="/dashboard1" element={<Layout3><Dashboard1 /></Layout3>} />
        <Route path="/dashboard2" element={<Layout5><Dashboard2 /></Layout5>} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/testimony"
          element={
            <PrivateRoute>
              <Layout3>
                <Dashboard3 />
              </Layout3>
             </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/testimony" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
