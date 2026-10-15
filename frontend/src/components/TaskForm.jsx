
import React, { useEffect, useState } from 'react';
import { X, CalendarDays, AlignLeft, Flag, Type } from 'lucide-react';

const blankTask = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

export default function TaskForm({ task, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(blankTask);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(
      task
        ? {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate || '',
          }
        : blankTask
    );
    setErrors({});
  }, [task]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  async function submit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = 'Please enter a task title.';
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Please add a short description.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">TASK WORKSPACE</span>
            <h2 id="form-title">
              {task ? 'Edit task' : 'Create a task'}
            </h2>
            <p>Good work starts with a clear next step.</p>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="task-title">
            <Type size={15} /> Task title <span className="required">*</span>
          </label>

          <input
            id="task-title"
            autoFocus
            maxLength={120}
            placeholder="e.g. Prepare project proposal"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            aria-invalid={Boolean(errors.title)}
          />

          {errors.title && (
            <span className="field-error">{errors.title}</span>
          )}

          <label className="field-label" htmlFor="task-description">
            <AlignLeft size={15} /> Description{' '}
            <span className="required">*</span>
          </label>

          <textarea
            id="task-description"
            rows={4}
            maxLength={2000}
            placeholder="Add context, details, or the outcome you want…"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            aria-invalid={Boolean(errors.description)}
          />

          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}

          <div className="form-grid">
            <div>
              <label className="field-label" htmlFor="task-status">
                Status
              </label>

              <select
                id="task-status"
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="task-priority">
                <Flag size={15} /> Priority
              </label>

              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) => update('priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <label className="field-label" htmlFor="task-due">
            <CalendarDays size={15} /> Due date{' '}
            <span className="optional">(optional)</span>
          </label>

          <input
            id="task-due"
            type="date"
            value={form.dueDate}
            onChange={(e) => update('dueDate', e.target.value)}
          />

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="button button-primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving…'
                : task
                  ? 'Save changes'
                  : 'Create task'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
