import React from "react";
import "./HomeIntro.css";
import logo from "../assets/logo.png";

const HomeIntro = () => {
  return (
    <section className="hi-wrap">
      {/* Logo */}
      <div className="hi-logo-box">
        <img src={logo} alt="SnapDocs Logo" />
      </div>

      {/* Title */}
      <h1 className="hi-title">Access Your Documents Anytime, Anywhere</h1>

      {/* Subtitle */}
      <p className="hi-sub">
        Create folders like <strong>Study Certificates</strong>,{" "}
        <strong>Family Photos</strong>, <strong>Property Docs</strong>, and
        upload securely. Access from any device—anywhere in the world.
      </p>

      {/* Upload Button */}
      <div className="hi-actions">
        <a href="#upload" className="btn btn--brand">
          Upload Documents
        </a>
      </div>

      {/* Folder Icons */}
      <div className="hi-folders" style={{ marginTop: "2.85rem" }}>
        <div className="hi-folder">
          <div className="hi-folder__icon">
            <svg viewBox="0 0 24 24" width="90" height="90" fill="#F4B400">
              <path d="M10 4H2v16h20V6H12l-2-2z" />
            </svg>
          </div>
          <div className="hi-folder__label">Study Certificates</div>
        </div>

        <div className="hi-folder">
          <div className="hi-folder__icon">
            <svg viewBox="0 0 24 24" width="90" height="90" fill="#4285F4">
              <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l7-3 7 3 4-1z" />
            </svg>
          </div>
          <div className="hi-folder__label">Family Photos</div>
        </div>

        <div className="hi-folder">
          <div className="hi-folder__icon">
            <svg viewBox="0 0 24 24" width="90" height="90" fill="#A142F4">
              <path d="M4 4h16v16H4z" />
            </svg>
          </div>
          <div className="hi-folder__label">Property Docs</div>
        </div>

        <div className="hi-folder">
          <div className="hi-folder__icon">
            <svg viewBox="0 0 24 24" width="90" height="90" fill="#34A853">
              <path d="M2 4h20v16H2z" />
            </svg>
          </div>
          <div className="hi-folder__label">IDs</div>
        </div>

        <div className="hi-folder">
          <div className="hi-folder__icon">
            <svg viewBox="0 0 24 24" width="90" height="90" fill="#F4B400">
              <path d="M2 6h20v12H2z" />
            </svg>
          </div>
          <div className="hi-folder__label">Other Documents</div>
        </div>
      </div>
    </section>
  );
};

export default HomeIntro;
