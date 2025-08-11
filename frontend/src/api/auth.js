const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function toJson(res) {
  return res.json().catch(() => ({}));
}

export async function signup({ username, email, password }) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await toJson(res);
  if (!res.ok) throw new Error(data.detail || `Signup failed (${res.status})`);
  return data; // { id, username, email }
}

export async function login({ username, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await toJson(res);
  if (!res.ok) throw new Error(data.detail || `Login failed (${res.status})`);
  return data; // { message, user: { id, username } }
}
