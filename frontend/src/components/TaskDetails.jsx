
import React from 'react';
import {
  X,
  CalendarDays,
  Clock3,
  Pencil,
  CheckCircle2,
  CircleDashed,
  LoaderCircle,
} from 'lucide-react';

const prettyStatus = (status) =>
  ({
    pending: 'Pending',
    in_progress: 'In progress',
    completed: 'Completed',
  }[status] || status);

const dateLabel = (value) =>
  value
    ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(
        'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' }
      )
    : 'No due date';

const fullDate = (value) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export default function TaskDetails({ task, onClose, onEdit }) {
  if (!task) return null;

  const StatusIcon =
    task.status === 'completed'
      ? CheckCircle2
      : task.status === 'in_progress'
        ? LoaderCircle
        : CircleDashed;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">TASK DETAILS</span>
            <h2 id="details-title">A closer look</h2>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={19} />
          </button>
        </div>

        <div className="details-title-row">
          <h3>{task.title}</h3>
          <span className={`priority priority-${task.priority}`}>
            {task.priority} priority
          </span>
        </div>

        <p className="details-description">{task.description}</p>

        <div className="details-grid">
          <div className="detail-item">
            <span>Status</span>
            <strong>
              <StatusIcon size={16} /> {prettyStatus(task.status)}
            </strong>
          </div>

          <div className="detail-item">
            <span>Due date</span>
            <strong>
              <CalendarDays size={16} /> {dateLabel(task.dueDate)}
            </strong>
          </div>

          <div className="detail-item">
            <span>Created</span>
            <strong>
              <Clock3 size={16} /> {fullDate(task.createdAt)}
            </strong>
          </div>

          <div className="detail-item">
            <span>Last updated</span>
            <strong>
              <Clock3 size={16} /> {fullDate(task.updatedAt)}
            </strong>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button button-secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="button button-primary"
            onClick={() => onEdit(task)}
          >
            <Pencil size={15} /> Edit task
          </button>
        </div>
      </section>
    </div>
  );
}
