import React, { useState } from "react";
import AuthModal from "./AuthModal.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("login");

  const openLogin = () => { setInitialTab("login"); setOpen(true); };
  const openSignup = () => { setInitialTab("signup"); setOpen(true); };
  const onSuccess = () => { /* nothing: new tab opens inside modal */ };

  return (
    <>
      <header className="header">
        {/* left: logo ... */}
        <div className="header-actions">
          <button className="btn btn--ghost" onClick={openLogin}>Log in</button>
          <button className="btn btn--brand" onClick={openSignup}>Sign up</button>
        </div>
      </header>

      {open && (
        <AuthModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess}
          initialTab={initialTab}
        />
      )}
    </>
  );
}
