import React, { useState } from "react";
import { login, signup } from "../lib/auth";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password);
      onSuccess?.();
      onClose?.();
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={tabs}>
          <button onClick={() => setMode("login")} style={modeBtn(mode==="login")}>Log in</button>
          <button onClick={() => setMode("signup")} style={modeBtn(mode==="signup")}>Sign up</button>
        </div>

        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <label style={label}>Email</label>
          <input style={input} type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label style={label}>Password</label>
          <input style={input} type="password" value={password} onChange={e=>setPassword(e.target.value)} required />

          {err && <div style={error}>{err}</div>}

          <button type="submit" disabled={busy} style={primary}>
            {busy ? "Please wait..." : (mode === "login" ? "Log in" : "Create account")}
          </button>
        </form>
      </div>
    </div>
  );
}

const backdrop = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,.35)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
};
const modal = {
  width: 360, background: "#fff", borderRadius: 16, padding: 20,
  boxShadow: "0 20px 50px rgba(0,0,0,.15)"
};
const tabs = { display: "flex", gap: 8 };
const modeBtn = (active)=>({
  flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid #e6ebf5",
  background: active ? "#1f64ff" : "#fff", color: active ? "#fff" : "#0b2545",
  fontWeight: 600, cursor: "pointer"
});
const label = { display: "block", fontSize: 13, color: "#667085", marginTop: 12, marginBottom: 6 };
const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e6ebf5", outline: "none" };
const error = { color: "#d92d20", fontSize: 13, marginTop: 8 };
const primary = {
  width: "100%", marginTop: 16, padding: "12px 14px", border: 0, borderRadius: 12,
  background: "#1f64ff", color: "#fff", fontWeight: 700, cursor: "pointer",
};
