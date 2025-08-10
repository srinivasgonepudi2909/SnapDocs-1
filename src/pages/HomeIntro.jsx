import React from "react";
import "./HomeIntro.css";

function Folder({ icon, label }) {
  return (
    <div className="hi-folder">
      <div className="hi-folder__icon">{icon}</div>
      <div className="hi-folder__label">{label}</div>
    </div>
  );
}

const icons = {
  study: (
    <svg viewBox="0 0 64 64" width="54" height="54">
      <path fill="#f6b93b" d="M6 20h22l4 4h26v24a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V20z"/>
      <rect x="14" y="28" width="21" height="14" rx="3" fill="#f9d27a"/>
    </svg>
  ),
  photos: (
    <svg viewBox="0 0 64 64" width="54" height="54">
      <rect x="8" y="14" width="48" height="36" rx="6" fill="#68b0ff"/>
      <path d="M20 40l8-10 6 8 6-6 6 8H20z" fill="#9fd0ff"/>
      <rect x="18" y="20" width="8" height="6" rx="3" fill="#e6f2ff"/>
    </svg>
  ),
  property: (
    <svg viewBox="0 0 64 64" width="54" height="54">
      <rect x="10" y="18" width="44" height="30" rx="6" fill="#7a6cf5"/>
      <path d="M18 40h12v8H18zM34 36h12v12H34z" fill="#b9b2fb"/>
      <path d="M28 22h20" stroke="#d9d5fe" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  ids: (
    <svg viewBox="0 0 64 64" width="54" height="54">
      <rect x="8" y="18" width="48" height="28" rx="6" fill="#17c3a1"/>
      <rect x="14" y="24" width="16" height="16" rx="3" fill="#a9f0df"/>
      <rect x="34" y="28" width="16" height="4" rx="2" fill="#a9f0df"/>
      <rect x="34" y="36" width="12" height="4" rx="2" fill="#a9f0df"/>
    </svg>
  ),
  other: (
    <svg viewBox="0 0 64 64" width="54" height="54">
      <rect x="10" y="18" width="44" height="30" rx="6" fill="#f9c76b"/>
      <rect x="20" y="26" width="24" height="14" rx="3" fill="#ffe2a8"/>
      <path d="M24 44h16" stroke="#ffdfa0" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
};

export default function HomeIntro() {
  return (
    <section className="hi-wrap">
      <h1 className="hi-title">Access Your Documents<br/>Anytime, Anywhere</h1>
      <p className="hi-sub">
        Create folders like <b>Study Certificates</b>, <b>Family Photos</b>, <b>Property Docs</b>,
        and upload securely. Access from any device—anywhere in the world.
      </p>

      <div className="hi-actions">
        <a className="btn btn--brand" href="#get-started">Get Started</a>
      </div>

      <div className="hi-folders">
        <Folder icon={icons.study}   label="Study Certificates" />
        <Folder icon={icons.photos}  label="Family Photos" />
        <Folder icon={icons.property} label="Property Docs" />
        <Folder icon={icons.ids}     label="IDs" />
        <Folder icon={icons.other}   label="Other Documents" />
      </div>
    </section>
  );
}
