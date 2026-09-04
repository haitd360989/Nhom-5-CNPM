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
  // Xóa (DELETE) thường trả về rỗng (204), không có JSON để đọc
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const teacherQuestionApi = {
  getQuestions: (token, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.subject) params.set("subject", filters.subject);
    if (filters.topic) params.set("topic", filters.topic);
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.skip != null) params.set("skip", String(filters.skip));
    if (filters.limit != null) params.set("limit", String(filters.limit));

    const query = params.toString();

    return request(`/teacher/questions${query ? `?${query}` : ""}`, token);
  },

  createQuestion: (token, payload) =>
    request("/teacher/questions", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateQuestion: (token, questionId, payload) =>
    request(`/teacher/questions/${questionId}`, token, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteQuestion: (token, questionId) =>
    request(`/teacher/questions/${questionId}`, token, {
      method: "DELETE",
    }),
};

export const teacherAnalyticsApi = {
  getOverviewAnalytics: (token) => request("/teacher/analytics/overview", token),
};

export const teacherOverviewApi = {
  getTeacherOverview: (token) => request("/teacher/overview", token),

  queryKnowledge: (token, payload) =>
    request("/v1/rag/query", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
