// src/components/AuthModal.jsx
import React, { useEffect, useState } from "react";
import { signup } from "../lib/auth";

export default function AuthModal({ open, onClose, initialMode = "signup" }) {
  const [mode] = useState(initialMode); // keeping only signup for now
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!open) {
      setUsername(""); setPhone(""); setEmail(""); setPassword("");
      setError(""); setInfo("");
    }
  }, [open]);

  if (!open) return null;

  const canSubmit =
    username.trim().length >= 2 &&
    phone.trim().length >= 7 &&
    /\S+@\S+\.\S+/.test(email) &&
    password.length >= 6;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || busy) return;
    setBusy(true); setError(""); setInfo("");
    try {
      await signup({ username, phone, email, password });
      setInfo("Account created. Please log in with your credentials.");
      setTimeout(() => onClose?.(), 1200);
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="tabs">
            <button className="tab inactive" disabled>Log in</button>
            <button className="tab active">Sign up</button>
          </div>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={onSubmit} className="auth-body">
          <label>
            <span>Username</span>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} required />
          </label>
          <label>
            <span>Phone number</span>
            <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} />
          </label>

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          <button type="submit" className="btn btn--brand w-full" disabled={!canSubmit || busy}>
            {busy ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>

      {/* lightweight styles */}
      <style>{`
        .auth-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1000; }
        .auth-modal { width:520px; max-width:92vw; background:#fff; border-radius:16px; box-shadow:0 15px 40px rgba(0,0,0,.14); }
        .auth-header { display:flex; align-items:center; justify-content:space-between; padding:12px 16px 0; }
        .tabs { display:flex; gap:8px; }
        .tab { border:none; background:#eef3ff; color:#0b2545; padding:10px 16px; border-radius:12px; font-weight:600; }
        .tab.active { background:#2563ff; color:#fff; }
        .tab.inactive { opacity:.55; }
        .close { border:none; background:transparent; font-size:22px; line-height:1; cursor:pointer; padding:6px 10px; color:#667085; }
        .auth-body { padding:12px 16px 18px; display:flex; flex-direction:column; gap:12px; }
        label span { display:block; font-size:14px; color:#34475a; margin-bottom:6px; }
        input { width:100%; height:44px; border:1px solid #d9e1f1; border-radius:12px; padding:0 12px; font-size:15px; outline:none; }
        input:focus { border-color:#2563ff; box-shadow:0 0 0 3px rgba(37,99,255,.12); }
        .auth-error { color:#c0392b; font-size:14px; }
        .auth-info { color:#17642b; font-size:14px; }
        .w-full { width:100%; }
      `}</style>
    </div>
  );
}
