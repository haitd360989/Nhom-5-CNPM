// auth/api.js dung base URL co /api/v1, con diagnostic nam ngoai /api/v1
// nen phai tach rieng base URL cho diagnostic
const AUTH_API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";
const API_ROOT = AUTH_API_URL.replace(/\/api\/v1\/?$/, "");

async function request(path, token, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || "Khong the ket noi may chu");
  }
  return response.status === 204 ? null : response.json();
}

export const diagnosticApi = {
  getQuestions: (token) => request("/api/diagnostic/questions", token),
  submit: (token, payload) =>
    request("/api/diagnostic/submit", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
