import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggleStatus, onDelete }) {
  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✦</div>
        <p>No tienes tareas aún.</p>
        <span>¡Crea una para empezar!</span>
      </div>
    );
  }

  return (
    <div className="task-list">
      {pending.length > 0 && (
        <section className="task-section">
          <h3 className="section-label">
            Pendientes <span className="section-count">{pending.length}</span>
          </h3>
          {pending.map(task => (
            <TaskItem key={task.id} task={task} onToggleStatus={onToggleStatus} onDelete={onDelete} />
          ))}
        </section>
      )}

      {completed.length > 0 && (
        <section className="task-section">
          <h3 className="section-label muted">
            Completadas <span className="section-count">{completed.length}</span>
          </h3>
          {completed.map(task => (
            <TaskItem key={task.id} task={task} onToggleStatus={onToggleStatus} onDelete={onDelete} />
          ))}
        </section>
      )}
    </div>
  );
}
