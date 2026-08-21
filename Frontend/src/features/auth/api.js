const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || "Không thể kết nối máy chủ");
  }
  return response.status === 204 ? null : response.json();
}

export const authApi = {
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: (token) =>
    request("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
  logout: (token) =>
    request("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
