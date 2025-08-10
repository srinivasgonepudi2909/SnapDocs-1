import React, { useState, useCallback } from "react";
import "./Header.css";
import logo from "../assets/logo.png";

const AUTH_URL = import.meta.env.VITE_AUTH_URL || ""; // e.g. http://54.89.184.30:4500

export default function Header() {
  const [active, setActive] = useState("signup");

  // dispatch event for the AuthModal in HomeIntro to catch
  const openAuth = useCallback((mode) => {
    const event = new CustomEvent("open-auth", { detail: { mode } });
    const dispatched = window.dispatchEvent(event);

    // fallback: if no listener handled it, open auth service in a new tab (optional)
    // comment out this block if you never want new-tab fallback
    if (AUTH_URL) {
      // small timeout to give any listeners a moment to mount
      setTimeout(() => {
        // If the modal isn’t open after dispatch, you can still let users authenticate:
        // open /login or /signup on the auth microservice
        // (No hard detection here—just always available as a graceful backup.)
        // window.open(`${AUTH_URL}/login`, "_blank", "noopener");
        // or for signup:
        // window.open(`${AUTH_URL}/signup`, "_blank", "noopener");
        // NOTE: keep these commented unless you decide to use auth pages.
      }, 0);
    }

    return dispatched;
  }, []);

  const handleLogin = () => {
    setActive("login");
    openAuth("login");
  };

  const handleSignup = () => {
    setActive("signup");
    openAuth("signup");
  };

  return (
    <header className="header">
      <a className="brand" href="/" aria-label="SnapDocs Home">
        <img className="brand__logo" src={logo} alt="SnapDocs logo" />
      </a>

      <div className="actions">
        <button
          type="button"
          onClick={handleLogin}
          className={`btn ${active === "login" ? "btn--brand" : "btn--ghost"}`}
          aria-haspopup="dialog"
          aria-controls="auth-modal"
        >
          Log in
        </button>

        <button
          type="button"
          onClick={handleSignup}
          className={`btn ${active === "signup" ? "btn--brand" : "btn--ghost"}`}
          aria-haspopup="dialog"
          aria-controls="auth-modal"
        >
          Sign up
        </button>
      </div>
    </header>
  );
}
