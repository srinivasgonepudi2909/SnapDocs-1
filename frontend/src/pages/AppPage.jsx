// src/pages/AppPage.jsx
import React, { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal.jsx";
import { isAuthed, me } from "../lib/auth";

export default function AppPage() {
  const [open, setOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // read ?mode=login|signup
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "signup") setInitialTab("signup");
    else setInitialTab("login");

    const boot = async () => {
      if (isAuthed()) {
        try {
          const u = await me();
          setUser(u);
          setOpen(false);
        } catch {
          setOpen(true);
        }
      } else {
        setOpen(true);
      }
    };
    boot();
  }, []);

  const onAuthSuccess = async () => {
    try {
      const u = await me();
      setUser(u);
      setOpen(false);
    } catch {
      setOpen(true);
    }
  };

  return (
    <section className="app-wrap" style={{ padding: "2rem 1rem" }}>
      {!user && open && (
        <AuthModal open={open} onClose={() => setOpen(false)} onSuccess={onAuthSuccess} initialTab={initialTab} />
      )}

      {user && (
        <div className="app-dashboard" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ color: "#0b2545", marginBottom: "1rem" }}>
            Welcome, <span style={{ fontWeight: 700 }}>{user.email}</span>
          </h2>

          {/* Starter backend UI (replace with your real folders/uploads next) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
            <div className="card">
              <h3>Create Folder</h3>
              <p>Make folders like Study Certificates, Property Docs, etc.</p>
              <button className="btn btn--brand" disabled>Coming soon</button>
            </div>
            <div className="card">
              <h3>Upload Documents</h3>
              <p>Securely upload files to your folders.</p>
              <button className="btn btn--brand" disabled>Coming soon</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
