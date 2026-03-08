const express = require('express');
const router = express.Router();
const { getDb, save } = require('../db/database');

function rowsToObjects(result) {
  if (!result || result.length === 0) return [];
  const cols = result[0].columns;
  return result[0].values.map(row =>
    Object.fromEntries(cols.map((col, i) => [col, row[i]]))
  );
}

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rowsToObjects(result));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const { title, description, due_date } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  try {
    const db = await getDb();
    db.run(
      `INSERT INTO tasks (title, description, due_date, status, created_at)
       VALUES (?, ?, ?, 'pending', ?)`,
      [title.trim(), description?.trim() || null, due_date || null, new Date().toISOString()]
    );
    save();

    const result = db.exec('SELECT * FROM tasks ORDER BY id DESC LIMIT 1');
    const task = rowsToObjects(result)[0];
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Estado inválido. Usa "pending" o "completed"' });
  }

  try {
    const db = await getDb();
    const existing = rowsToObjects(db.exec('SELECT * FROM tasks WHERE id = ?', [id]));
    if (existing.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });

    db.run('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    save();

    const updated = rowsToObjects(db.exec('SELECT * FROM tasks WHERE id = ?', [id]))[0];
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDb();
    const existing = rowsToObjects(db.exec('SELECT * FROM tasks WHERE id = ?', [id]));
    if (existing.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });

    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    save();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

module.exports = router;
