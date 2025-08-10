const AUTH_API = import.meta.env.VITE_AUTH_URL || "http://localhost:4500";

export async function signup({ username, phone, email, password }) {
  const res = await fetch(`${AUTH_API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, phone, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Signup failed");
  return data; // { message: "Account created. Please log in." }
}

export async function login({ email, password }) {
  const res = await fetch(`${AUTH_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Login failed");

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export function isAuthed() { return !!localStorage.getItem("token"); }
export function logout() { localStorage.removeItem("token"); localStorage.removeItem("user"); }
