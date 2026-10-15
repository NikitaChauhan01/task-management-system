import { randomUUID } from 'node:crypto';

const now = new Date();
const daysFromNow = (days) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

// Intentionally in-memory: tasks reset when the API process restarts.
let tasks = [
  { id: randomUUID(), title: 'Finalize product roadmap', description: 'Review priorities with the product team and publish the next sprint roadmap.', status: 'in_progress', priority: 'high', dueDate: daysFromNow(2), createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(), updatedAt: new Date(now.getTime() - 86400000).toISOString() },
  { id: randomUUID(), title: 'Prepare weekly report', description: 'Collect team updates, highlight blockers, and share the weekly progress report.', status: 'pending', priority: 'medium', dueDate: daysFromNow(4), createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString() },
  { id: randomUUID(), title: 'Update onboarding guide', description: 'Refresh setup steps and add troubleshooting notes for new team members.', status: 'completed', priority: 'low', dueDate: daysFromNow(-1), createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(), updatedAt: new Date(now.getTime() - 3600000).toISOString() },
  { id: randomUUID(), title: 'Audit open support tickets', description: 'Identify recurring issues and assign owners to high-impact tickets.', status: 'pending', priority: 'high', dueDate: daysFromNow(1), createdAt: new Date(now.getTime() - 3600000 * 12).toISOString(), updatedAt: new Date(now.getTime() - 3600000 * 12).toISOString() }
];

const allowedStatuses = ['pending', 'in_progress', 'completed'];
const allowedPriorities = ['low', 'medium', 'high'];

export function validateTask(input, partial = false) {
  const errors = {};
  if (!partial || 'title' in input) {
    if (typeof input.title !== 'string' || !input.title.trim()) errors.title = 'Title is required.';
    else if (input.title.trim().length > 120) errors.title = 'Title must be 120 characters or fewer.';
  }
  if (!partial || 'description' in input) {
    if (typeof input.description !== 'string' || !input.description.trim()) errors.description = 'Description is required.';
    else if (input.description.trim().length > 2000) errors.description = 'Description must be 2,000 characters or fewer.';
  }
  if ('status' in input && !allowedStatuses.includes(input.status)) errors.status = 'Status must be pending, in_progress, or completed.';
  if ('priority' in input && !allowedPriorities.includes(input.priority)) errors.priority = 'Priority must be low, medium, or high.';
  if ('dueDate' in input && input.dueDate !== '' && input.dueDate !== null && (typeof input.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate) || Number.isNaN(Date.parse(`${input.dueDate}T00:00:00Z`)))) {
    errors.dueDate = 'Due date must be a valid date in YYYY-MM-DD format.';
  }
  return errors;
}

export const taskService = {
  list() { return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); },
  get(id) { return tasks.find((task) => task.id === id) ?? null; },
  create(input) {
    const timestamp = new Date().toISOString();
    const task = { id: randomUUID(), title: input.title.trim(), description: input.description.trim(), status: input.status ?? 'pending', priority: input.priority ?? 'medium', dueDate: input.dueDate || '', createdAt: timestamp, updatedAt: timestamp };
    tasks.unshift(task);
    return task;
  },
  update(id, input) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index < 0) return null;
    const current = tasks[index];
    const next = { ...current };
    for (const key of ['title', 'description', 'status', 'priority', 'dueDate']) {
      if (key in input) next[key] = key === 'title' || key === 'description' ? input[key].trim() : (input[key] || '');
    }
    next.updatedAt = new Date().toISOString();
    tasks[index] = next;
    return next;
  },
  remove(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index < 0) return null;
    return tasks.splice(index, 1)[0];
  }
};
