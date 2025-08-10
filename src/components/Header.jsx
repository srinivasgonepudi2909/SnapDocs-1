import React from "react";
import "./Header.css";
import logo from "../assets/logo.png"; // path to your logo image

export default function Header() {
  return (
    <header className="header">
      <a className="brand" href="#">
        <img className="brand__logo" src={logo} alt="SnapDocs logo" />
      </a>
      <div className="actions">
        <button className="btn btn--ghost">Log in</button>
        <button className="btn btn--brand">Sign up</button>
      </div>
    </header>
  );
}
