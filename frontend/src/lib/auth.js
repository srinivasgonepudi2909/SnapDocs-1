const KEY = "snapdocs_token";
const API = import.meta.env.VITE_API_BASE;

export const setToken = (t) => localStorage.setItem(KEY, t);
export const getToken = () => localStorage.getItem(KEY) || "";
export const clearToken = () => localStorage.removeItem(KEY);
export const isAuthed = () => !!getToken();

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.error || "Request failed");
  return data;
}

export async function signup(email, password) {
  const data = await request("/auth/signup", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data.user;
}

export async function login(email, password) {
  const data = await request("/auth/login", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data.user;
}

export async function me() {
  return request("/auth/me");
}
