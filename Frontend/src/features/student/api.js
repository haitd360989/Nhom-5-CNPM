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
    const error = new Error(body.detail || "Không thể kết nối máy chủ");
    error.status = response.status;
    throw error;
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
  getCurrent: (token) => request("/study-plan/current", token),
  create: (token, payload) =>
    request("/study-plan/init", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const analyticsApi = {
  getProgress: (token) => request("/analytics/progress", token),
};

export const practiceApi = {
  getQuestions: (token, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.subject) params.set("subject", filters.subject);
    if (filters.topic) params.set("topic", filters.topic);
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.limit != null) params.set("limit", String(filters.limit));

    const query = params.toString();

    return request(`/practice/questions${query ? `?${query}` : ""}`, token);
  },

  submit: (token, payload) =>
    request("/practice/submit", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  history: (token) => request("/practice/history", token),
};

export const tutorApi = {
  ask: (token, payload) =>
    request("/v1/rbac/tutor/ask", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
