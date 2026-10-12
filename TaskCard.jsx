import { CalendarDays, MoreHorizontal, Pencil, Eye, Trash2, CheckCircle2, CircleDashed, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
const prettyStatus = (status) => ({ pending: 'Pending', in_progress: 'In progress', completed: 'Completed' }[status] || status);
const dateLabel = (value) => value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date';
export default function TaskCard({ task, onView, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const StatusIcon = task.status === 'completed' ? CheckCircle2 : task.status === 'in_progress' ? LoaderCircle : CircleDashed;
  return <article className={`task-card ${task.status === 'completed' ? 'task-complete' : ''}`}>
    <div className="task-card-top"><span className={`status status-${task.status}`}><StatusIcon size={13} />{prettyStatus(task.status)}</span><div className="menu-wrap"><button className="icon-button card-menu" aria-label={`Actions for ${task.title}`} onClick={() => setMenuOpen(!menuOpen)}><MoreHorizontal size={19} /></button>{menuOpen && <><button className="menu-dismiss" aria-label="Close menu" onClick={() => setMenuOpen(false)}></button><div className="action-menu"><button onClick={() => { setMenuOpen(false); onView(task); }}><Eye size={15} /> View details</button><button onClick={() => { setMenuOpen(false); onEdit(task); }}><Pencil size={15} /> Edit task</button><button className="danger-text" onClick={() => { setMenuOpen(false); onDelete(task); }}><Trash2 size={15} /> Delete task</button></div></>}</div></div>
    <button className="task-title-button" onClick={() => onView(task)}><h3>{task.title}</h3></button><p className="task-description">{task.description}</p>
    <div className="task-card-bottom"><span className={`priority priority-${task.priority}`}><span className="priority-dot"></span>{task.priority}</span><span className="due-date"><CalendarDays size={14} />{dateLabel(task.dueDate)}</span></div>
    <div className="task-card-footer"><span className="created-label">Created {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><select aria-label={`Change status for ${task.title}`} className="quick-status" value={task.status} onChange={(e) => onStatusChange(task, e.target.value)}><option value="pending">Set pending</option><option value="in_progress">Set in progress</option><option value="completed">Set completed</option></select></div>
  </article>;
}
