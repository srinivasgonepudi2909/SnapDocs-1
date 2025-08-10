// src/lib/auth.js
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function signup({ username, phone, email, password }) {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, phone, email, password }),
  });

  let data = null;
  try { data = await res.json(); } catch (_) {}

  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || `Signup failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
