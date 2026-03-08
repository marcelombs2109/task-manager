import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

export default function TaskItem({ task, onToggleStatus, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isCompleted = task.status === 'completed';

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <button
        className={`checkbox ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggleStatus(task.id, task.status)}
        aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
      >
        {isCompleted && (
          <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.description && <span className="task-description">{task.description}</span>}
        {task.due_date && (
          <span className="task-due">
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="11" height="11">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 6h12M5 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {formatDate(task.due_date)}
          </span>
        )}
      </div>

      <button
        className="btn-delete"
        onClick={() => setShowConfirm(true)}
        aria-label="Eliminar tarea"
      >
        <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="16">
          <path d="M1 3.5h12M5 3.5V2h4v1.5M2.5 3.5l.8 10h7.4l.8-10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {showConfirm && (
        <ConfirmDialog
          onConfirm={() => { setShowConfirm(false); onDelete(task.id); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
