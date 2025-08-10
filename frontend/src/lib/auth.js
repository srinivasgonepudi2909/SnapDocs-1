const API = import.meta.env.VITE_API_BASE;

export const tokenKey = "snap_token";
export const saveToken = (t) => localStorage.setItem(tokenKey, t);
export const getToken  = () => localStorage.getItem(tokenKey) || "";
export const clearToken = () => localStorage.removeItem(tokenKey);

async function req(path, options = {}) {
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.error || "Request failed");
  return data;
}

export async function signup(email, password) {
  const data = await req("/auth/signup", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  saveToken(data.token);
  return data.user;
}

export async function login(email, password) {
  const data = await req("/auth/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  saveToken(data.token);
  return data.user;
}

export async function me() {
  return req("/auth/me", {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
