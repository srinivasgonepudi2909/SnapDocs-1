import React, { useState, useCallback } from "react";
import "./Header.css";
import logo from "../assets/logo.png"; // path to your logo image

export default function Header() {
  // keep your current visual state (which button looks active)
  const [active, setActive] = useState("signup");

  // tell the page to open the auth modal (no layout changes here)
  const openAuth = useCallback((mode) => {
    // mode: "login" | "signup"
    window.dispatchEvent(
      new CustomEvent("open-auth", { detail: { mode } })
    );
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
        >
          Log in
        </button>

        <button
          type="button"
          onClick={handleSignup}
          className={`btn ${active === "signup" ? "btn--brand" : "btn--ghost"}`}
        >
          Sign up
        </button>
      </div>
    </header>
  );
}
