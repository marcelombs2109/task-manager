import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getTasks, createTask, updateTaskStatus, deleteTask } from './services/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError('No se pudo conectar con el servidor'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data) {
    const task = await createTask(data);
    setTasks(prev => [task, ...prev]);
  }

  async function handleToggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const updated = await updateTaskStatus(id, newStatus);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F7F4EF;
          --surface: #FFFFFF;
          --ink: #1A1A18;
          --ink-muted: #888880;
          --accent: #C8522A;
          --accent-light: #F2E8E3;
          --border: #E4DFD8;
          --completed-ink: #AEAAA4;
          --shadow: 0 2px 16px rgba(26,26,24,0.07);
          --radius: 12px;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--ink);
          min-height: 100vh;
        }

        .app {
          max-width: 620px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* Header */
        .app-header {
          margin-bottom: 40px;
        }
        .app-header h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 2.4rem;
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .app-header h1 span {
          color: var(--accent);
        }
        .app-header p {
          margin-top: 6px;
          font-size: 0.9rem;
          color: var(--ink-muted);
          font-weight: 300;
        }

        /* Form */
        .form-wrapper {
          margin-bottom: 32px;
        }
        .btn-new-task {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: var(--radius);
          padding: 12px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-new-task:hover { background: #B04420; }
        .btn-new-task:active { transform: scale(0.98); }
        .plus-icon { font-size: 1.2rem; line-height: 1; }

        .task-form {
          background: var(--surface);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
        }
        .form-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem;
          font-weight: 400;
          margin-bottom: 20px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .field label {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-muted);
        }
        .required { color: var(--accent); }
        .field input, .field textarea {
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 10px 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          background: var(--bg);
          color: var(--ink);
          outline: none;
          transition: border-color 0.15s;
          resize: none;
        }
        .field input:focus, .field textarea:focus {
          border-color: var(--accent);
          background: white;
        }
        .field-error {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 500;
        }
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 8px;
        }
        .btn-primary {
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-primary:hover { background: #B04420; }
        .btn-primary:disabled { background: var(--ink-muted); cursor: not-allowed; }
        .btn-secondary {
          background: transparent;
          color: var(--ink-muted);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover { border-color: var(--ink-muted); color: var(--ink); }

        /* Task List */
        .task-list { display: flex; flex-direction: column; gap: 28px; }
        .task-section { display: flex; flex-direction: column; gap: 8px; }
        .section-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .section-label.muted { color: var(--ink-muted); }
        .section-count {
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 20px;
          padding: 1px 8px;
          font-size: 0.7rem;
        }
        .section-label.muted .section-count {
          background: var(--border);
          color: var(--ink-muted);
        }

        /* Task Item */
        .task-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 16px;
          box-shadow: var(--shadow);
          transition: box-shadow 0.15s, opacity 0.15s;
          position: relative;
        }
        .task-item:hover { box-shadow: 0 4px 20px rgba(26,26,24,0.1); }
        .task-item.completed { opacity: 0.6; }

        .checkbox {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border-radius: 6px;
          border: 2px solid var(--border);
          background: var(--bg);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          transition: border-color 0.15s, background 0.15s;
          color: white;
        }
        .checkbox:hover { border-color: var(--accent); }
        .checkbox.checked {
          background: var(--accent);
          border-color: var(--accent);
        }
        .checkbox svg { width: 12px; height: 10px; }

        .task-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .task-title {
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.4;
          word-break: break-word;
        }
        .task-item.completed .task-title {
          text-decoration: line-through;
          color: var(--completed-ink);
        }
        .task-description {
          font-size: 0.82rem;
          color: var(--ink-muted);
          line-height: 1.4;
          font-weight: 300;
        }
        .task-due {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--ink-muted);
          margin-top: 2px;
        }

        .btn-delete {
          background: none;
          border: none;
          color: var(--border);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.15s, background 0.15s;
          margin-top: 1px;
        }
        .btn-delete:hover { color: var(--accent); background: var(--accent-light); }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 24px;
          color: var(--ink-muted);
        }
        .empty-icon {
          font-size: 2rem;
          color: var(--border);
          margin-bottom: 12px;
        }
        .empty-state p { font-size: 1rem; font-weight: 500; color: var(--ink-muted); }
        .empty-state span { font-size: 0.85rem; font-weight: 300; }

        /* Confirm Dialog */
        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26,26,24,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(2px);
        }
        .confirm-box {
          background: var(--surface);
          border-radius: var(--radius);
          padding: 28px 32px;
          box-shadow: 0 8px 40px rgba(26,26,24,0.2);
          max-width: 320px;
          width: 90%;
          text-align: center;
        }
        .confirm-box p {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          font-weight: 400;
          margin-bottom: 20px;
        }
        .confirm-actions { display: flex; gap: 10px; justify-content: center; }
        .btn-cancel {
          background: transparent;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 9px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          cursor: pointer;
          color: var(--ink-muted);
          transition: border-color 0.15s;
        }
        .btn-cancel:hover { border-color: var(--ink-muted); color: var(--ink); }
        .btn-confirm {
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 9px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-confirm:hover { background: #B04420; }

        /* Loading / Error */
        .loading-state, .error-state {
          text-align: center;
          padding: 60px 24px;
          color: var(--ink-muted);
          font-size: 0.95rem;
        }
        .error-state { color: var(--accent); }

        @media (max-width: 480px) {
          .app { padding: 32px 16px 60px; }
          .app-header h1 { font-size: 1.9rem; }
        }
      `}</style>

      <div className="app">
        <header className="app-header">
          <h1>Gestión de <span>Tareas</span></h1>
          <p>MVP — Spec Driven Development</p>
        </header>

        <TaskForm onCreate={handleCreate} />

        {loading && <div className="loading-state">Cargando tareas...</div>}
        {error && <div className="error-state">{error}</div>}
        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
}
