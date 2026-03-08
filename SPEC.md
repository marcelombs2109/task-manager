# SPEC: MVP — Gestión de Tareas

**Versión:** 1.0  
**Fecha:** 2026-03-07  
**Stack:** React (frontend) + Node.js/Express (backend) + SQLite (base de datos)  
**Metodología:** Spec Driven Development

---

## 1. Descripción del Producto

Una aplicación web de gestión de tareas personales que permite a un usuario crear, visualizar, actualizar y eliminar tareas desde un navegador. El objetivo del MVP es validar el flujo básico de gestión de tareas (CRUD) con una interfaz simple y funcional.

---

## 2. Objetivo del MVP

Entregar una aplicación funcional que permita a un usuario:
- Registrar tareas con información básica
- Visualizar el estado de sus tareas
- Marcar tareas como completadas
- Eliminar tareas que ya no son relevantes

El MVP **no** requiere autenticación, multi-usuario ni persistencia en la nube.

---

## 3. Usuarios Objetivo

**Usuario primario:** Persona individual que quiere organizar sus pendientes personales desde el navegador, sin necesidad de cuenta ni instalación.

---

## 4. Arquitectura General

```
┌─────────────────┐        HTTP/REST        ┌──────────────────────┐
│  Frontend        │ ◄────────────────────► │  Backend              │
│  React (Vite)    │                        │  Node.js + Express    │
│  Puerto: 5173    │                        │  Puerto: 3000         │
└─────────────────┘                        └──────────┬───────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  SQLite          │
                                              │  tasks.db        │
                                              └─────────────────┘
```

---

## 5. Modelo de Datos

### Entidad: `Task`

| Campo       | Tipo      | Requerido | Descripción                              |
|-------------|-----------|-----------|------------------------------------------|
| `id`        | INTEGER   | Sí        | Clave primaria, autoincremental          |
| `title`     | TEXT      | Sí        | Título de la tarea (máx. 100 caracteres) |
| `description` | TEXT    | No        | Descripción opcional (máx. 500 caracteres) |
| `due_date`  | TEXT (ISO8601) | No  | Fecha límite en formato `YYYY-MM-DD`     |
| `status`    | TEXT      | Sí        | `"pending"` o `"completed"`              |
| `created_at`| TEXT (ISO8601) | Sí  | Fecha de creación, generada por el servidor |

---

## 6. Features del MVP

### Feature 1: Crear Tarea

**Descripción:** El usuario puede crear una nueva tarea completando un formulario.

**Campos del formulario:**
- Título (obligatorio)
- Descripción (opcional)
- Fecha límite (opcional)

**Comportamiento esperado:**
- Al enviar el formulario con título válido → la tarea aparece en la lista con estado `pending`
- Si el título está vacío → se muestra un mensaje de error inline, no se envía el formulario
- Tras crear exitosamente → el formulario se limpia

---

### Feature 2: Listar Tareas

**Descripción:** El usuario puede ver todas sus tareas organizadas por estado.

**Comportamiento esperado:**
- Las tareas se muestran separadas en dos secciones: **Pendientes** y **Completadas**
- Cada tarea muestra: título, descripción (si existe), fecha límite (si existe) y estado
- Si no hay tareas → se muestra un mensaje vacío: *"No tienes tareas aún. ¡Crea una!"*
- Las tareas se cargan al iniciar la aplicación

---

### Feature 3: Marcar Tarea como Completada

**Descripción:** El usuario puede cambiar el estado de una tarea de `pending` a `completed` (y viceversa).

**Comportamiento esperado:**
- Al hacer clic en el checkbox o botón de completar → el estado cambia inmediatamente en la UI
- La tarea se mueve a la sección correspondiente (Pendientes ↔ Completadas)
- El cambio persiste en la base de datos

---

### Feature 4: Eliminar Tarea

**Descripción:** El usuario puede eliminar una tarea permanentemente.

**Comportamiento esperado:**
- Cada tarea tiene un botón de eliminar (ícono de basura)
- Al hacer clic → aparece una confirmación: *"¿Eliminar esta tarea?"* con opciones Confirmar / Cancelar
- Al confirmar → la tarea desaparece de la lista y se elimina de la base de datos
- Al cancelar → no pasa nada

---

## 7. API REST

### Base URL: `http://localhost:3000/api`

| Método | Endpoint        | Descripción                        | Body                                      | Respuesta exitosa |
|--------|-----------------|------------------------------------|-------------------------------------------|-------------------|
| GET    | `/tasks`        | Obtener todas las tareas           | —                                         | `200` + array de tasks |
| POST   | `/tasks`        | Crear una nueva tarea              | `{ title, description?, due_date? }`      | `201` + task creada |
| PATCH  | `/tasks/:id`    | Actualizar estado de una tarea     | `{ status }`                              | `200` + task actualizada |
| DELETE | `/tasks/:id`    | Eliminar una tarea                 | —                                         | `204` sin body |

### Ejemplo de respuesta — GET /tasks

```json
[
  {
    "id": 1,
    "title": "Estudiar para el examen",
    "description": "Repasar capítulos 3 y 4",
    "due_date": "2026-03-15",
    "status": "pending",
    "created_at": "2026-03-07T10:00:00Z"
  }
]
```

### Manejo de errores

| Código | Situación                              |
|--------|----------------------------------------|
| `400`  | Datos inválidos (ej: título vacío)     |
| `404`  | Tarea no encontrada                    |
| `500`  | Error interno del servidor             |

Formato de error:
```json
{ "error": "El título es obligatorio" }
```

---

## 8. Interfaz de Usuario

### Layout general

```
┌──────────────────────────────────────────┐
│  📋 Gestión de Tareas               [MVP] │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │  + Nueva tarea         [Formulario] │  │
│  └────────────────────────────────────┘  │
│                                          │
│  PENDIENTES (3)                          │
│  ┌────────────────────────────────────┐  │
│  │ ☐  Estudiar cap. 3   📅 15 mar    🗑 │  │
│  │ ☐  Comprar leche                  🗑 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  COMPLETADAS (1)                         │
│  ┌────────────────────────────────────┐  │
│  │ ☑  Lavar el auto                  🗑 │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Componentes React

| Componente       | Responsabilidad                                      |
|------------------|------------------------------------------------------|
| `App`            | Componente raíz, maneja estado global de tareas      |
| `TaskForm`       | Formulario para crear nueva tarea                    |
| `TaskList`       | Renderiza la lista de tareas por sección             |
| `TaskItem`       | Representa una tarea individual con sus acciones     |
| `ConfirmDialog`  | Modal de confirmación para eliminar                  |

---

## 9. Estructura de Carpetas

```
task-manager-mvp/
├── frontend/                   # React App (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── services/
│   │   │   └── api.js          # Funciones fetch hacia el backend
│   │   └── App.jsx
│   └── package.json
│
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── tasks.js        # Rutas del recurso /tasks
│   │   ├── db/
│   │   │   ├── database.js     # Conexión y setup de SQLite
│   │   │   └── tasks.db        # Archivo de base de datos
│   │   └── app.js              # Entry point
│   └── package.json
│
└── SPEC.md                     # Este archivo
```

---

## 10. Fuera del Alcance del MVP

Los siguientes elementos están **explícitamente excluidos** del MVP:

- Autenticación / registro de usuarios
- Soporte multi-usuario
- Categorías, etiquetas o prioridades
- Búsqueda o filtros avanzados
- Notificaciones o recordatorios
- Edición de tareas existentes
- Ordenamiento manual de tareas
- Deployment a producción

---

## 11. Criterios de Aceptación

El MVP se considera completo cuando:

- [ ] Se puede crear una tarea con título (campo obligatorio) desde el navegador
- [ ] Las tareas creadas persisten al recargar la página
- [ ] Las tareas se muestran separadas en secciones Pendientes y Completadas
- [ ] Se puede marcar/desmarcar una tarea como completada
- [ ] Se puede eliminar una tarea con confirmación previa
- [ ] Los errores de validación se muestran en la UI sin romper la app
- [ ] La API responde con los códigos HTTP correctos en todos los casos

---

*Próximo paso: redactar `PLAN.md` con las tareas técnicas de implementación.*
