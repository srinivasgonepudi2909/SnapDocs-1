import React, { useEffect, useState } from "react";
import "./AuthModal.css";
import { signup, login } from "../lib/auth";

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState("signup"); // "signup" | "login"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Prevent page scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    try {
      if (tab === "signup") {
        await signup(email, password);
        setNotice("Account created. Please log in with your credentials.");
        setTab("login");
        return;
      } else {
        await login(email, password);
        onClose?.();
        window.location.href = "/app";
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__card">
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal__tabs">
          <button
            className={`tab ${tab === "login" ? "is-active" : ""}`}
            onClick={() => {
              setTab("login");
              setError("");
              setNotice("");
            }}
          >
            Log in
          </button>
          <button
            className={`tab ${tab === "signup" ? "is-active" : ""}`}
            onClick={() => {
              setTab("signup");
              setError("");
              setNotice("");
            }}
          >
            Sign up
          </button>
        </div>

        {notice && (
          <div style={{ color: "#0ea5e9", marginBottom: 8 }}>{notice}</div>
        )}
        {error && (
          <div style={{ color: "#e11d48", marginBottom: 8 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button className="btn btn--brand" type="submit">
            {tab === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
