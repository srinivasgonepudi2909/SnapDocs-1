import React, { useState } from "react";
import "./Header.css";
import logo from "../assets/logo.png"; // path to your logo image

export default function Header() {
  // "signup" is default active
  const [active, setActive] = useState("signup");

  return (
    <header className="header">
      <a className="brand" href="#">
        <img className="brand__logo" src={logo} alt="SnapDocs logo" />
      </a>
      <div className="actions">
        <button
          onClick={() => setActive("login")}
          className={`btn ${active === "login" ? "btn--brand" : "btn--ghost"}`}
        >
          Log in
        </button>
        <button
          onClick={() => setActive("signup")}
          className={`btn ${active === "signup" ? "btn--brand" : "btn--ghost"}`}
        >
          Sign up
        </button>
      </div>
    </header>
  );
}
