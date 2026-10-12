import { taskService, validateTask } from '../services/task.service.js';

export const getTasks = (_req, res) => res.status(200).json({ success: true, count: taskService.list().length, data: taskService.list() });

export const getTask = (req, res, next) => {
  try {
    const task = taskService.get(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    return res.status(200).json({ success: true, data: task });
  } catch (error) { return next(error); }
};

export const createTask = (req, res, next) => {
  try {
    const input = req.body ?? {};
    const errors = validateTask(input);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Please correct the validation errors.', errors });
    const task = taskService.create(input);
    return res.status(201).json({ success: true, message: 'Task created successfully.', data: task });
  } catch (error) { return next(error); }
};

export const updateTask = (req, res, next) => {
  try {
    const input = req.body ?? {};
    const existing = taskService.get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Task not found.' });
    const errors = validateTask(input, true);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Please correct the validation errors.', errors });
    const task = taskService.update(req.params.id, input);
    return res.status(200).json({ success: true, message: 'Task updated successfully.', data: task });
  } catch (error) { return next(error); }
};

export const deleteTask = (req, res) => {
  const task = taskService.remove(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
  return res.status(200).json({ success: true, message: 'Task deleted successfully.', data: task });
};
