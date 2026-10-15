const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
  } catch {
    throw new Error('Could not connect to the API. Make sure the backend is running on port 5000.');
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || 'The request could not be completed.');
    error.details = body.errors || {};
    error.status = response.status;
    throw error;
  }
  return body;
}

export const taskApi = {
  list: () => request('/tasks'),
  get: (id) => request(`/tasks/${id}`),
  create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
};
