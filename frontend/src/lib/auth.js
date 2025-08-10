const KEY = "snapdocs_token";

export function setToken(token) {
  localStorage.setItem(KEY, token);
}
export function getToken() {
  return localStorage.getItem(KEY);
}
export function clearToken() {
  localStorage.removeItem(KEY);
}
export function isAuthed() {
  const t = getToken();
  return !!t && t.length > 10;
}

export async function api(path, { method = "GET", body, headers } = {}) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function signup(email, password) {
  const data = await api("/auth/signup", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data.user;
}
export async function login(email, password) {
  const data = await api("/auth/login", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data.user;
}
