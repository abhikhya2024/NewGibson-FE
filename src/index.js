/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import LoginPage from "components/Auth/LoginPage";

import "style.css";
import { ContextProvider } from "./providers/Context";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));
const msalInstance = new PublicClientApplication(msalConfig);

// ✅ Handle redirect response here
msalInstance.handleRedirectPromise().then((response) => {
  if (response !== null && response.account) {
    msalInstance.setActiveAccount(response.account);
    // ✅ Optional: Automatically redirect user after login
    window.location.href = "/admin/user-profile"; // Change this to your desired route
  }
}).catch((error) => {
  console.error("Redirect error:", error);
});
root.render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>

    <ContextProvider>
      {" "}
      {/* 👈 Wrap your app with this */}
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/admin/index" replace />} />
      </Routes>
    </ContextProvider>
    </MsalProvider>
  </BrowserRouter>
);
