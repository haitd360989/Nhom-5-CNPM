const API_ROOT = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1"
).replace(/\/api\/v1\/?$/, "");

async function request(path, token) {
  const response = await fetch(`${API_ROOT}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || "Không thể kết nối máy chủ");
  }

  return response.json();
}

export const getParentOverview = (token) => request("/parent/overview", token);

export const getStudentProgress = (token) => request("/parent/progress", token);

export const parentApi = {
  getParentOverview,
  getStudentProgress,
};
