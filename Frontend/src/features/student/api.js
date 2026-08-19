const API_ROOT = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1"
).replace(/\/api\/v1\/?$/, "");

async function request(path, token, options = {}) {
  const response = await fetch(`${API_ROOT}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || "Không thể kết nối máy chủ");
  }
  return response.json();
}

export const diagnosticApi = {
  getQuestions: (token) => request("/diagnostic/questions", token),
  submit: (token, payload) =>
    request("/diagnostic/submit", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const studyPlanApi = {
  create: (token, payload) =>
    request("/study-plan/init", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
