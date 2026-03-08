import { useState } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onCreate({ title, description, due_date: dueDate });
      setTitle('');
      setDescription('');
      setDueDate('');
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-wrapper">
      {!open ? (
        <button className="btn-new-task" onClick={() => setOpen(true)}>
          <span className="plus-icon">+</span> Nueva tarea
        </button>
      ) : (
        <form className="task-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Nueva tarea</h2>
          <div className="field">
            <label>Título <span className="required">*</span></label>
            <input
              type="text"
              placeholder="¿Qué necesitas hacer?"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              autoFocus
              maxLength={100}
            />
            {error && <span className="field-error">{error}</span>}
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea
              placeholder="Detalles adicionales (opcional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              maxLength={500}
            />
          </div>
          <div className="field">
            <label>Fecha límite</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => { setOpen(false); setError(''); }}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear tarea'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
