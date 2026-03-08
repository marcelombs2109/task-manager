# PLAN: MVP — Gestión de Tareas

**Versión:** 1.0  
**Fecha:** 2026-03-07  
**Referencia:** SPEC.md v1.0  
**Stack:** React + Vite (frontend) · Node.js + Express (backend) · SQLite (DB)

---

## Convenciones

- Cada tarea tiene un ID único: `[FASE-NÚMERO]`
- Las tareas dentro de cada fase deben completarse **en orden**
- No pasar a la siguiente fase sin completar la actual
- Marcar cada tarea con `[x]` al completarla

---

## FASE 0 — Setup del Proyecto

> Objetivo: tener el entorno listo para empezar a desarrollar.

### Backend

- [ ] `[B0-1]` Crear carpeta `backend/` e inicializar proyecto: `npm init -y`
- [ ] `[B0-2]` Instalar dependencias: `npm install express cors better-sqlite3`
- [ ] `[B0-3]` Instalar dependencias de desarrollo: `npm install -D nodemon`
- [ ] `[B0-4]` Agregar script en `package.json`: `"dev": "nodemon src/app.js"`
- [ ] `[B0-5]` Crear estructura de carpetas:
  ```
  backend/src/
  ├── app.js
  ├── routes/
  │   └── tasks.js
  └── db/
      └── database.js
  ```
- [ ] `[B0-6]` Crear `src/app.js` con Express básico (sin rutas aún), verificar que corre en puerto 3000

### Frontend

- [ ] `[F0-1]` Crear proyecto React con Vite: `npm create vite@latest frontend -- --template react`
- [ ] `[F0-2]` Entrar a `frontend/` e instalar dependencias: `npm install`
- [ ] `[F0-3]` Limpiar archivos de ejemplo: borrar contenido de `App.jsx`, `App.css`, `index.css`
- [ ] `[F0-4]` Crear estructura de carpetas:
  ```
  frontend/src/
  ├── App.jsx
  ├── components/
  │   ├── TaskForm.jsx
  │   ├── TaskList.jsx
  │   ├── TaskItem.jsx
  │   └── ConfirmDialog.jsx
  └── services/
      └── api.js
  ```
- [ ] `[F0-5]` Verificar que el frontend corre en puerto 5173 con `npm run dev`

**✅ Criterio de éxito de FASE 0:** Backend en `:3000` y frontend en `:5173` corriendo sin errores.

---

## FASE 1 — Base de Datos y Conexión

> Objetivo: tener la base de datos SQLite funcionando con la tabla `tasks`.

- [ ] `[B1-1]` En `db/database.js`, crear conexión a SQLite usando `better-sqlite3`
- [ ] `[B1-2]` Crear tabla `tasks` con todos los campos del modelo (ver SPEC sección 5):
  ```sql
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL
  );
  ```
- [ ] `[B1-3]` Exportar la instancia `db` para usarla en las rutas
- [ ] `[B1-4]` Importar y ejecutar `database.js` desde `app.js` para que la tabla se cree al iniciar
- [ ] `[B1-5]` Verificar manualmente que el archivo `tasks.db` se genera al correr el servidor

**✅ Criterio de éxito de FASE 1:** El servidor inicia y el archivo `tasks.db` existe con la tabla `tasks`.

---

## FASE 2 — API REST (Backend)

> Objetivo: implementar los 4 endpoints definidos en la SPEC.

### Setup de rutas

- [ ] `[B2-1]` En `app.js`, configurar middleware: `express.json()` y `cors()`
- [ ] `[B2-2]` Registrar el router de tareas: `app.use('/api/tasks', tasksRouter)`

### GET /api/tasks

- [ ] `[B2-3]` Implementar handler: consultar todas las filas de `tasks` ordenadas por `created_at DESC`
- [ ] `[B2-4]` Responder con `200` y el array de tareas en JSON
- [ ] `[B2-5]` Probar con curl o Postman: `GET http://localhost:3000/api/tasks` → debe devolver `[]`

### POST /api/tasks

- [ ] `[B2-6]` Implementar handler: recibir `{ title, description, due_date }` del body
- [ ] `[B2-7]` Validar que `title` no esté vacío → si falla, responder `400` con `{ "error": "El título es obligatorio" }`
- [ ] `[B2-8]` Insertar la tarea con `status: "pending"` y `created_at` = fecha actual ISO8601
- [ ] `[B2-9]` Responder con `201` y la tarea recién creada (con su `id`)
- [ ] `[B2-10]` Probar: crear una tarea → verificar que aparece en GET /tasks

### PATCH /api/tasks/:id

- [ ] `[B2-11]` Implementar handler: recibir `{ status }` del body
- [ ] `[B2-12]` Validar que `status` sea `"pending"` o `"completed"` → si no, responder `400`
- [ ] `[B2-13]` Verificar que la tarea con ese `id` existe → si no, responder `404`
- [ ] `[B2-14]` Actualizar el campo `status` en la base de datos
- [ ] `[B2-15]` Responder con `200` y la tarea actualizada
- [ ] `[B2-16]` Probar: cambiar status de una tarea → verificar en GET /tasks

### DELETE /api/tasks/:id

- [ ] `[B2-17]` Implementar handler: recibir `id` de los params
- [ ] `[B2-18]` Verificar que la tarea existe → si no, responder `404`
- [ ] `[B2-19]` Eliminar la tarea de la base de datos
- [ ] `[B2-20]` Responder con `204` sin body
- [ ] `[B2-21]` Probar: eliminar una tarea → verificar que no aparece en GET /tasks

**✅ Criterio de éxito de FASE 2:** Los 4 endpoints responden correctamente y con los códigos HTTP del SPEC.

---

## FASE 3 — Servicio de API (Frontend)

> Objetivo: centralizar todas las llamadas HTTP en un solo archivo.

- [ ] `[F3-1]` En `services/api.js`, definir la constante `BASE_URL = "http://localhost:3000/api"`
- [ ] `[F3-2]` Implementar función `getTasks()` → GET /tasks, retorna array
- [ ] `[F3-3]` Implementar función `createTask(data)` → POST /tasks, retorna tarea creada
- [ ] `[F3-4]` Implementar función `updateTaskStatus(id, status)` → PATCH /tasks/:id, retorna tarea actualizada
- [ ] `[F3-5]` Implementar función `deleteTask(id)` → DELETE /tasks/:id
- [ ] `[F3-6]` Todas las funciones deben manejar errores con try/catch y lanzar el mensaje de error del servidor

**✅ Criterio de éxito de FASE 3:** Las 4 funciones están implementadas y exportadas correctamente.

---

## FASE 4 — Componentes React

> Objetivo: construir la UI con sus componentes, conectados al servicio de API.

### App.jsx — Estado global

- [ ] `[F4-1]` Crear estado: `const [tasks, setTasks] = useState([])`
- [ ] `[F4-2]` Al montar el componente (`useEffect`), llamar `getTasks()` y guardar en estado
- [ ] `[F4-3]` Implementar `handleCreate(taskData)` → llama `createTask()` y agrega la tarea al estado
- [ ] `[F4-4]` Implementar `handleToggleStatus(id, currentStatus)` → llama `updateTaskStatus()` y actualiza el estado
- [ ] `[F4-5]` Implementar `handleDelete(id)` → llama `deleteTask()` y elimina del estado
- [ ] `[F4-6]` Renderizar `<TaskForm>` y `<TaskList>` pasando las funciones como props

### TaskForm.jsx

- [ ] `[F4-7]` Crear campos controlados: `title`, `description`, `due_date` con `useState`
- [ ] `[F4-8]` Validar que `title` no esté vacío al enviar → mostrar error inline si falla
- [ ] `[F4-9]` Al enviar formulario válido → llamar `onCreate(data)` y limpiar los campos
- [ ] `[F4-10]` Deshabilitar el botón de envío mientras la petición está en curso (estado `loading`)

### TaskList.jsx

- [ ] `[F4-11]` Recibir `tasks`, `onToggleStatus`, `onDelete` como props
- [ ] `[F4-12]` Separar tareas: `pending = tasks.filter(t => t.status === "pending")`
- [ ] `[F4-13]` Renderizar sección "PENDIENTES" con su conteo y lista de `<TaskItem>`
- [ ] `[F4-14]` Renderizar sección "COMPLETADAS" con su conteo y lista de `<TaskItem>`
- [ ] `[F4-15]` Si no hay tareas en total → mostrar mensaje: *"No tienes tareas aún. ¡Crea una!"*

### TaskItem.jsx

- [ ] `[F4-16]` Recibir `task`, `onToggleStatus`, `onDelete` como props
- [ ] `[F4-17]` Mostrar: título, descripción (si existe), fecha límite (si existe)
- [ ] `[F4-18]` Renderizar checkbox que al cambiar llama `onToggleStatus(task.id, task.status)`
- [ ] `[F4-19]` Renderizar botón de eliminar que al hacer clic activa el `ConfirmDialog`
- [ ] `[F4-20]` Manejar estado local `showConfirm` para controlar la visibilidad del diálogo

### ConfirmDialog.jsx

- [ ] `[F4-21]` Recibir `onConfirm` y `onCancel` como props
- [ ] `[F4-22]` Mostrar mensaje: *"¿Eliminar esta tarea?"*
- [ ] `[F4-23]` Botón "Confirmar" → llama `onConfirm()`
- [ ] `[F4-24]` Botón "Cancelar" → llama `onCancel()`

**✅ Criterio de éxito de FASE 4:** La UI completa funciona con datos reales del backend.

---

## FASE 5 — Integración y Pruebas Manuales

> Objetivo: verificar que todos los criterios de aceptación del SPEC se cumplen.

- [ ] `[T5-1]` Crear tarea con título → aparece en "Pendientes"
- [ ] `[T5-2]` Intentar crear tarea sin título → muestra error, no se envía
- [ ] `[T5-3]` Recargar la página → las tareas persisten
- [ ] `[T5-4]` Marcar tarea como completada → se mueve a "Completadas"
- [ ] `[T5-5]` Desmarcar tarea completada → vuelve a "Pendientes"
- [ ] `[T5-6]` Eliminar tarea: clic en 🗑 → aparece confirmación
- [ ] `[T5-7]` Confirmar eliminación → tarea desaparece
- [ ] `[T5-8]` Cancelar eliminación → tarea permanece
- [ ] `[T5-9]` Con lista vacía → se muestra el mensaje de vacío
- [ ] `[T5-10]` Verificar en DevTools que no hay errores de consola en el flujo normal

**✅ Criterio de éxito de FASE 5:** Todos los checkboxes en verde = MVP completo.

---

## Resumen de Fases

| Fase | Descripción                     | Tareas |
|------|---------------------------------|--------|
| 0    | Setup del proyecto              | 11     |
| 1    | Base de datos SQLite            | 5      |
| 2    | API REST (backend)              | 21     |
| 3    | Servicio de API (frontend)      | 6      |
| 4    | Componentes React               | 24     |
| 5    | Integración y pruebas           | 10     |
| **Total** |                          | **77** |

---

*Referencia: SPEC.md — Gestión de Tareas MVP v1.0*
