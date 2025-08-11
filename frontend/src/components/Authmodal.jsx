import React, { useEffect, useMemo, useState } from "react";
import { signup, login } from "../api/auth";
import "./AuthModal.css";

export default function AuthModal({ open, initialMode = "signup", onClose }) {
  const [mode, setMode] = useState(initialMode); // 'signup' | 'login'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => setMode(initialMode), [initialMode]);
  useEffect(() => {
    if (!open) {
      setErr(""); setOk("");
      setUsername(""); setEmail(""); setPassword("");
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (mode === "signup") return username && email && password;
    return username && password;
  }, [mode, loading, username, email, password]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setErr(""); setOk(""); setLoading(true);
    try {
      if (mode === "signup") {
        const u = await signup({ username, email, password });
        setOk(`Account created for ${u.username}. You can now login.`);
        setMode("login");
        setPassword("");
      } else {
        const res = await login({ username, password });
        setOk(`Welcome ${res.user.username}! Login successful.`);
        // optional: let app know user logged in
        window.dispatchEvent(new CustomEvent("auth-success", { detail: res.user }));
        setTimeout(() => onClose?.(), 700);
      }
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="am-backdrop" role="dialog" aria-modal="true" id="auth-modal" onClick={() => !loading && onClose?.()}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-head">
          <button
            className={`am-tab ${mode === "signup" ? "am-tab--active" : ""}`}
            onClick={() => !loading && (setMode("signup"), setErr(""), setOk(""))}
          >
            Sign Up
          </button>
          <button
            className={`am-tab ${mode === "login" ? "am-tab--active" : ""}`}
            onClick={() => !loading && (setMode("login"), setErr(""), setOk(""))}
          >
            Login
          </button>
          <button className="am-x" onClick={() => !loading && onClose?.()} aria-label="Close">×</button>
        </div>

        <form className="am-body" onSubmit={onSubmit}>
          <div className="am-field">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. srinivas"
              autoComplete="username"
            />
          </div>

          {mode === "signup" && (
            <div className="am-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sri@example.com"
                autoComplete="email"
              />
            </div>
          )}

          <div className="am-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {err && <div className="am-error">{err}</div>}
          {ok && <div className="am-ok">{ok}</div>}

          <button className="am-primary" type="submit" disabled={!canSubmit}>
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
