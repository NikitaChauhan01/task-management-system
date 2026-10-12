import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownUp, Bell, Check, CheckCircle2, ChevronDown, CircleDashed, ClipboardList, LayoutDashboard, ListFilter, LoaderCircle, LogOut, Menu, Moon, Plus, Search, SlidersHorizontal, Sparkles, Sun, Target, TrendingUp, X } from 'lucide-react';
import { taskApi } from './services/api';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';

const FILTERS = [{ value: 'all', label: 'All tasks' }, { value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In progress' }, { value: 'completed', label: 'Completed' }];
const labelStatus = (value) => ({ pending: 'Pending', in_progress: 'In progress', completed: 'Completed' }[value] || value);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [dark, setDark] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const pageSize = 6;

  const loadTasks = useCallback(async () => {
    setLoading(true); setError('');
    try { const result = await taskApi.list(); setTasks(result.data); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3200); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);

  const stats = useMemo(() => ({ total: tasks.length, pending: tasks.filter((t) => t.status === 'pending').length, progress: tasks.filter((t) => t.status === 'in_progress').length, completed: tasks.filter((t) => t.status === 'completed').length }), [tasks]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = tasks.filter((task) => (!needle || `${task.title} ${task.description}`.toLowerCase().includes(needle)) && (statusFilter === 'all' || task.status === statusFilter) && (priorityFilter === 'all' || task.priority === priorityFilter));
    list.sort((a, b) => {
      if (sortBy === 'priority') return ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]);
      if (sortBy === 'dueDate') return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return list;
  }, [tasks, query, statusFilter, priorityFilter, sortBy]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { setPage(1); }, [query, statusFilter, priorityFilter, sortBy]);
  const visibleTasks = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function saveTask(payload) {
    setSaving(true);
    try {
      if (editingTask) { await taskApi.update(editingTask.id, payload); setNotice('Task updated successfully.'); }
      else { await taskApi.create(payload); setNotice('Your new task is ready.'); }
      setFormOpen(false); setEditingTask(null); await loadTasks();
    } catch (e) { setNotice(e.message); }
    finally { setSaving(false); }
  }
  function openCreate() { setEditingTask(null); setFormOpen(true); }
  function openEdit(task) { setViewingTask(null); setEditingTask(task); setFormOpen(true); }
  async function removeTask() {
    try { await taskApi.remove(deleteTask.id); setDeleteTask(null); setNotice('Task deleted.'); await loadTasks(); }
    catch (e) { setNotice(e.message); setDeleteTask(null); }
  }
  async function changeStatus(task, status) {
    try { await taskApi.update(task.id, { status }); setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status, updatedAt: new Date().toISOString() } : item)); setNotice(`Task moved to ${labelStatus(status).toLowerCase()}.`); }
    catch (e) { setNotice(e.message); }
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><ClipboardList size={21} strokeWidth={2.2} /></div><span>taskflow<span className="brand-period">.</span></span><button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={19}/></button></div>
      <div className="workspace-label">WORKSPACE</div><div className="workspace-picker"><div className="workspace-avatar">N</div><div className="workspace-copy"><strong>My workspace</strong><span>Personal plan</span></div><ChevronDown size={15}/></div>
      <div className="nav-label">MENU</div><nav className="side-nav"><button className="nav-item nav-active" onClick={() => { setStatusFilter('all'); setMobileNav(false); }}><LayoutDashboard size={18}/><span>Overview</span><span className="nav-count">{tasks.length}</span></button><button className="nav-item" onClick={() => { setStatusFilter('pending'); setMobileNav(false); }}><CircleDashed size={18}/><span>My tasks</span></button><button className="nav-item" onClick={() => { setStatusFilter('completed'); setMobileNav(false); }}><CheckCircle2 size={18}/><span>Completed</span></button></nav>
      <div className="sidebar-divider"></div><div className="nav-label">PREFERENCES</div><nav className="side-nav"><button className="nav-item" onClick={() => setDark(!dark)}>{dark ? <Sun size={18}/> : <Moon size={18}/>}<span>{dark ? 'Light appearance' : 'Dark appearance'}</span><span className={`toggle ${dark ? 'toggle-on' : ''}`}></span></button></nav>
      <div className="sidebar-spacer"></div><div className="sidebar-tip"><div className="tip-icon"><Sparkles size={17}/></div><strong>Make room for focus.</strong><p>Small steps, done consistently, lead to big things.</p><div className="tip-progress"><span style={{ width: `${stats.total ? Math.round(stats.completed / stats.total * 100) : 0}%` }}></span></div><div className="tip-foot"><span>Completion rate</span><strong>{stats.total ? Math.round(stats.completed / stats.total * 100) : 0}%</strong></div></div>
      <div className="profile"><div className="profile-avatar">NC</div><div className="profile-info"><strong>Nikita Chauhan</strong><span>Personal workspace</span></div><button className="icon-button profile-more" aria-label="Profile menu"><LogOut size={16}/></button></div>
    </aside>
    {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}></button>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div></div><div className="topbar-right"><div className="today-label">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div><button className="icon-button theme-mobile" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><div className="topbar-avatar">NC</div></div></header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow welcome-eyebrow"><span className="live-dot"></span> YOUR PERSONAL WORKSPACE</div><h1>Good things take <span>focus.</span></h1><p className="welcome-subtitle">A little progress each day adds up to big results.</p></div><button className="button button-primary create-top" onClick={openCreate}><Plus size={17}/> New task</button></section>
        {error && <div className="error-banner"><div><strong>Couldn't load your tasks</strong><p>{error}</p></div><button className="button button-secondary" onClick={loadTasks}>Try again</button></div>}
        <section className="stats-grid" aria-label="Task summary">
          <div className="stat-card"><div className="stat-top"><span>Total tasks</span><div className="stat-icon stat-icon-purple"><ClipboardList size={18}/></div></div><div className="stat-number">{loading ? '—' : stats.total.toString().padStart(2, '0')}</div><div className="stat-foot"><span className="stat-foot-icon"><Activity size={13}/></span><span>Across your workspace</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>To do</span><div className="stat-icon stat-icon-amber"><CircleDashed size={18}/></div></div><div className="stat-number">{loading ? '—' : stats.pending.toString().padStart(2, '0')}</div><div className="stat-foot"><span className="stat-neutral">Keep the momentum</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>In progress</span><div className="stat-icon stat-icon-blue"><LoaderCircle size={18}/></div></div><div className="stat-number">{loading ? '—' : stats.progress.toString().padStart(2, '0')}</div><div className="stat-foot"><span className="stat-neutral">One step at a time</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>Completed</span><div className="stat-icon stat-icon-green"><Check size={18}/></div></div><div className="stat-number">{loading ? '—' : stats.completed.toString().padStart(2, '0')}</div><div className="stat-foot"><span className="stat-foot-icon green-foot"><TrendingUp size={13}/></span><span>{stats.total ? Math.round(stats.completed / stats.total * 100) : 0}% of all tasks</span></div></div>
        </section>
        <section className="tasks-section"><div className="section-heading"><div><div className="section-title-row"><h2>Your tasks</h2><span className="result-count">{filtered.length}</span></div><p>Keep track of what matters today.</p></div><button className="button button-secondary add-task-inline" onClick={openCreate}><Plus size={16}/> Add task</button></div>
          <div className="filter-bar"><div className="search-box"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" aria-label="Search by title or description"/><kbd>⌘ K</kbd></div><div className="filter-controls"><label className="select-wrap"><ListFilter size={15}/><select aria-label="Filter by priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}><option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select><ChevronDown size={14}/></label><label className="select-wrap sort-select"><ArrowDownUp size={15}/><select aria-label="Sort tasks" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="createdAt">Recently created</option><option value="dueDate">Due date</option><option value="priority">Priority</option></select><ChevronDown size={14}/></label></div></div>
          <div className="filter-tabs" role="tablist" aria-label="Filter by status">{FILTERS.map((filter) => <button key={filter.value} role="tab" aria-selected={statusFilter === filter.value} className={`filter-tab ${statusFilter === filter.value ? 'filter-tab-active' : ''}`} onClick={() => setStatusFilter(filter.value)}>{filter.label}{filter.value === 'all' && <span>{tasks.length}</span>}</button>)}</div>
          {loading ? <div className="loading-grid">{[1,2,3,4].map((i) => <div className="skeleton-card" key={i}><div className="skeleton-line short"></div><div className="skeleton-line title-line"></div><div className="skeleton-line"></div><div className="skeleton-line"></div></div>)}</div> : !error && visibleTasks.length > 0 ? <div className="task-grid">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} onView={setViewingTask} onEdit={openEdit} onDelete={setDeleteTask} onStatusChange={changeStatus}/>)}</div> : !error ? <div className="empty-state"><div className="empty-icon"><Target size={25}/></div><h3>{query || statusFilter !== 'all' || priorityFilter !== 'all' ? 'No tasks match those filters' : 'A fresh start'}</h3><p>{query || statusFilter !== 'all' || priorityFilter !== 'all' ? 'Try changing your search or filters to find what you need.' : 'Create your first task and make today count.'}</p>{query || statusFilter !== 'all' || priorityFilter !== 'all' ? <button className="button button-secondary" onClick={() => { setQuery(''); setStatusFilter('all'); setPriorityFilter('all'); }}>Clear filters</button> : <button className="button button-primary" onClick={openCreate}><Plus size={16}/> Create your first task</button>}</div> : null}
          {!loading && !error && filtered.length > pageSize && <div className="pagination"><span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} tasks</span><div><button className="page-button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span className="page-number">{page} / {pageCount}</span><button className="page-button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button></div></div>}
        </section>
        <footer className="page-footer"><span>Made for focused work <span className="footer-heart">✳</span></span><span>Taskflow <span className="footer-dot">·</span> Keep moving forward</span></footer>
      </div>
    </main>
    {formOpen && <TaskForm task={editingTask} onClose={() => { setFormOpen(false); setEditingTask(null); }} onSubmit={saveTask} saving={saving}/>}
    {viewingTask && <TaskDetails task={viewingTask} onClose={() => setViewingTask(null)} onEdit={openEdit}/>}
    {deleteTask && <div className="modal-backdrop"><section className="modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><div className="confirm-icon"><X size={20}/></div><h2 id="delete-title">Delete this task?</h2><p><strong>{deleteTask.title}</strong> will be permanently removed from this session. This action can't be undone.</p><div className="form-actions"><button className="button button-secondary" onClick={() => setDeleteTask(null)}>Keep task</button><button className="button button-danger" onClick={removeTask}>Delete task</button></div></section></div>}
    {notice && <div className="toast" role="status"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15}/></button></div>}
  </div>;
}
