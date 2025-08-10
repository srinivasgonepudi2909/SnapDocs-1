const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function setToken(t) { localStorage.setItem("token", t); }
export function getToken() { return localStorage.getItem("token"); }
export function clearToken() { localStorage.removeItem("token"); }

function headers(extra = {}) {
  const h = { ...extra };
  const t = getToken();
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers() },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Login failed");
  const data = await res.json();
  setToken(data.token);
  return data.user;
}

export async function signup({ username, phone, email, password }) {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, phone, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Signup failed");
  return res.json(); // {ok, message}
}

export async function me() {
  const res = await fetch(`${API}/auth/me`, { headers: headers() });
  if (!res.ok) throw new Error("Not authed");
  return res.json();
}

export function isAuthed() {
  return !!getToken();
}
