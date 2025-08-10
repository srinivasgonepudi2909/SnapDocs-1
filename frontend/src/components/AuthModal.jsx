import React, { useState } from "react";
import { login, signup, setToken } from "../lib/auth";

export default function AuthModal({
  open = true,
  onClose,
  onSuccess,
  initialTab = "login", // "login" | "signup"
}) {
  if (!open) return null;

  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // login fields
  const [lemail, setLEmail] = useState("");
  const [lpass, setLPass] = useState("");

  // signup fields
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [semail, setSEmail] = useState("");
  const [spass, setSPass] = useState("");
  const [signupOk, setSignupOk] = useState("");

  async function onLogin(e) {
    e.preventDefault();
    setError(""); setSignupOk(""); setLoading(true);
    try {
      await login(lemail, lpass);
      // open app in new tab
      window.open("/app", "_blank", "noopener");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSignup(e) {
    e.preventDefault();
    setError(""); setSignupOk(""); setLoading(true);
    try {
      await signup({ username, phone, email: semail, password: spass });
      setSignupOk("Account created. Please log in with your credentials.");
      setTab("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "is-active" : ""}`}
            onClick={() => setTab("login")}
          >
            Log in
          </button>
          <button
            className={`auth-tab ${tab === "signup" ? "is-active" : ""}`}
            onClick={() => setTab("signup")}
          >
            Sign up
          </button>
        </div>

        {tab === "login" && (
          <form onSubmit={onLogin} className="auth-form">
            <label>Email</label>
            <input type="email" value={lemail} onChange={(e) => setLEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={lpass} onChange={(e) => setLPass(e.target.value)} required />
            {error && <div className="auth-error">{error}</div>}
            {signupOk && <div className="auth-ok">{signupOk}</div>}
            <button className="btn btn--brand" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={onSignup} className="auth-form">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />

            <label>Phone number</label>
            <input
              type="tel"
              placeholder="+11234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="^\+?[0-9]{7,15}$"
              required
            />

            <label>Email</label>
            <input type="email" value={semail} onChange={(e) => setSEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" value={spass} onChange={(e) => setSPass(e.target.value)} required />

            {error && <div className="auth-error">{error}</div>}
            <button className="btn btn--brand" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        )}

        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
}
