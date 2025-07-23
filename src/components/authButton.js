// src/components/AuthButton.js
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export function SignInButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return <button onClick={handleLogin}>Sign in with Microsoft</button>;
}

export function SignOutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup();
  };

  return <button onClick={handleLogout}>Sign out</button>;
}
