// src/components/AuthModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { signup, login } from "../lib/auth";

export default function AuthModal({
  open = false,
  onClose,
  initialTab = "login", // "login" | "signup"
  onSuccess,
}) {
  const [tab, setTab] = useState(initialTab);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // login fields
  const [lemail, setLEmail] = useState("");
  const [lpass, setLPass] = useState("");

  // signup fields
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [semail, setSEmail] = useState("");
  const [spass, setSPass] = useState("");

  useEffect(() => {
    if (!open) {
      setError("");
      setInfo("");
      setBusy(false);
    }
  }, [open]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const canLogin = useMemo(() => {
    return /\S+@\S+\.\S+/.test(lemail) && lpass.length >= 6;
  }, [lemail, lpass]);

  const canSignup = useMemo(() => {
    return (
      username.trim().length >= 2 &&
      phone.trim().length >= 7 &&
      /\S+@\S+\.\S+/.test(semail) &&
      spass.length >= 6
    );
  }, [username, phone, semail, spass]);

  async function handleLogin(e) {
    e?.preventDefault?.();
    if (!canLogin || busy) return;
    setBusy(true);
    setError("");
    setInfo("");

    try {
      await login({ email: lemail, password: lpass });
      // Open the app in a new tab after successful login
      window.open("/app", "_blank", "noopener");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignup(e) {
    e?.preventDefault?.();
    if (!canSignup || busy) return;
    setBusy(true);
    setError("");
    setInfo("");

    try {
      await signup({
        username: username.trim(),
        phone: phone.trim(),
        email: semail.trim().toLowerCase(),
        password: spass,
      });
      // Show info and switch to login
      setInfo("Account created. Please log in with your credentials.");
      setTab("login");
      // Optionally prefill login email
      setLEmail(semail.trim().toLowerCase());
      setLPass("");
    } catch (err) {
      setError(err?.message || "Signup failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-tabs" role="tablist" aria-label="Authentication">
            <button
              role="tab"
              aria-selected={tab === "login"}
              className={`auth-tab ${tab === "login" ? "is-active" : ""}`}
              onClick={() => { setTab("login"); setError(""); setInfo(""); }}
            >
              Log in
            </button>
            <button
              role="tab"
              aria-selected={tab === "signup"}
              className={`auth-tab ${tab === "signup" ? "is-active" : ""}`}
              onClick={() => { setTab("signup"); setError(""); setInfo(""); }}
            >
              Sign up
            </button>
          </div>
          <button className="auth-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {tab === "login" ? (
          <form className="auth-body" onSubmit={handleLogin}>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={lemail}
                onChange={(e) => setLEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={lpass}
                onChange={(e) => setLPass(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </label>

            {error && <div className="auth-error">{error}</div>}
            {info && <div className="auth-ok">{info}</div>}

            <button type="submit" className="btn btn--brand w-full" disabled={!canLogin || busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form className="auth-body" onSubmit={handleSignup}>
            <label>
              <span>Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                required
                autoFocus
              />
            </label>

            <label>
              <span>Phone number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+11234567890"
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                value={semail}
                onChange={(e) => setSEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={spass}
                onChange={(e) => setSPass(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </label>

            {error && <div className="auth-error">{error}</div>}
            {info && <div className="auth-ok">{info}</div>}

            <button type="submit" className="btn btn--brand w-full" disabled={!canSignup || busy}>
              {busy ? "Creating..." : "Create account"}
            </button>
          </form>
        )}
      </div>

      {/* scoped styles; keeps your existing .btn design */}
      <style>{`
        .auth-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,.45);
          display: grid; place-items: center; z-index: 1000;
        }
        .auth-modal {
          width: 520px; max-width: 92vw; background: #fff; border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,.14); overflow: hidden;
        }
        .auth-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px 0 16px;
        }
        .auth-tabs { display: flex; gap: 8px; }
        .auth-tab {
          border: 1px solid #e5e7eb; background: #fff; color: #0b2545;
          padding: 10px 16px; border-radius: 12px; font-weight: 600;
        }
        .auth-tab.is-active { background: #2563ff; color: #fff; border-color: #2563ff; }
        .auth-close {
          border: none; background: transparent; font-size: 22px; line-height: 1;
          cursor: pointer; color: #667085; padding: 6px 10px;
        }
        .auth-body {
          padding: 14px 16px 18px; display: grid; gap: 12px;
        }
        .auth-body label span {
          display: block; font-size: 14px; color: #34475a; margin-bottom: 6px;
        }
        .auth-body input {
          width: 100%; height: 44px; border: 1px solid #d9e1f1; border-radius: 12px;
          padding: 0 12px; font-size: 15px; outline: none;
        }
        .auth-body input:focus {
          border-color: #2563ff; box-shadow: 0 0 0 3px rgba(37,99,255,.12);
        }
        .auth-error { color: #b91c1c; font-size: .95rem; }
        .auth-ok { color: #047857; font-size: .95rem; }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
}
