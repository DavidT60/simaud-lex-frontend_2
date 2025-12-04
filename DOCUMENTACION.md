**SIMAUD-LEX — Documentación del Frontend**

Breve documentación en español del frontend `simaud-lex-frontend`. Contiene descripción del proyecto, cómo arrancar, estructura del código y explicaciones de los componentes y utilidades más relevantes.

**Resumen**

- **Proyecto:** Frontend React + Vite para la aplicación SIMAUD-LEX (gestión de procesos judiciales).
- **Stack principal:** `React 19`, `TypeScript`, `Vite`, `Tailwind CSS`, `react-hook-form`, `axios`, `zod`, `@tanstack/react-query`.

**Requisitos**

- **Node.js:** v18+ recomendado.
- **Instalación de dependencias:** usar `npm install` (o `pnpm`/`yarn` según preferencia).

**Scripts importantes**

- **`npm run dev`**: arranca el servidor de desarrollo (Vite).
- **`npm run build`**: compila TypeScript (`tsc -b`) y construye la app (`vite build`).
- **`npm run preview`**: sirve la build para previsualizar.
- **`npm run lint`**: ejecuta ESLint.

**Estructura principal (resumen)**

- **`/src`**: código fuente.
  - **`/components`**: componentes reutilizables y layout.
    - **`layout/`**: `Layout.tsx`, `Header.tsx`, `Sidebar.tsx` — estructura y navegación principal.
    - **`forms/`**: formularios (ej. `NewCaseForm.tsx`, `NnaForm.tsx`, `PersonForm.tsx`).
    - **`modals/`**: modales como `CaseDetailsModal.tsx`.
    - **`ui/`**: componentes UI base (`button.tsx`, `input.tsx`, `card.tsx`, `modal.tsx`, `tabs.tsx`).
    - **`ProtectedRoute.tsx`**: wrapper que protege rutas basadas en el contexto de autenticación.
  - **`/pages`**: vistas principales (`LoginPage.tsx`, `RegisterPage.tsx`, `DashboardPage.tsx`, `CasosPage.tsx`, `SimulacionesPage.tsx`, `BibliotecaPage.tsx`).
  - **`/contexts`**: `auth.context.tsx` — proveedor y hook `useAuth`.
  - **`/lib`**: utilidades y cliente API (`api.ts`, `utils.ts`).
  - `App.tsx`, `main.tsx` — entrada y ruteo.

**Descripción de archivos y componentes clave**

**`App.tsx`**

- **Propósito:** Define las rutas públicas (`/login`, `/register`) y las rutas protegidas (`/dashboard`, `/casos`, `/simulaciones`, `/biblioteca`).
- **Notas:** Las rutas protegidas usan `ProtectedRoute` para redireccionar a `/login` si no hay sesión.

**`src/contexts/auth.context.tsx`**

- **Propósito:** Provee el contexto de autenticación: `user`, `isAuthenticated`, `isLoading`, y funciones `login`, `register`, `logout`.
- **Comportamiento:** Guarda `access_token` y `user` en `localStorage`. Decodifica el payload del JWT (usa `atob`) para extraer `sub` y `email` del token.
- **Cuidado:** El decode con `atob` asume un JWT estándar y que el token contiene los campos esperados; validar en backend/adaptar según sea necesario.

**`src/lib/api.ts`**

- **Propósito:** Cliente `axios` centralizado con `baseURL` y interceptores.
- **Interceptores:**
  - Request interceptor: añade header `Authorization: Bearer <token>` si existe `access_token` en `localStorage`.
  - Response interceptor: si la respuesta es `401`, limpia token/usuario y redirige a `/login`.
- **APIs definidas:** `authAPI`, `nnaAPI`, `procesoJudicialAPI`, `personAPI` con métodos `getAll`, `getOne`, `create`, `update`, `delete`.

**Layout y navegación**

- **`Layout.tsx`**: componente que renderiza `Sidebar` y `Header`, y el `main` para el contenido.
- **`Header.tsx`**: muestra el nombre/email del usuario y botón `Cerrar Sesión` que llama a `logout`.
- **`Sidebar.tsx`**: menú lateral con links a las secciones principales. Usa `cn` desde `src/lib/utils.ts` para clases condicionales.

**Rutas protegidas**

- **`ProtectedRoute.tsx`**: si `isLoading` muestra texto de carga; si no autenticado redirige a `/login`; si autenticado renderiza los hijos.

**Formularios y flujo de creación de casos**

- **`NewCaseForm.tsx`** (usado en `CasosPage`): formulario central para crear un caso judicial.

  - Permite seleccionar un NNA existente o crear uno nuevo (usa `NnaForm` como subformulario).
  - Flujo resumido al enviar:
    1. Si el usuario creó un NNA nuevo, invoca `nnaAPI.create(...)` y recupera `id`.
    2. Crea el caso llamando a `procesoJudicialAPI.create(...)` con `nnaId` y campos del caso.
  - Incluye búsqueda/selección de NNAs con autocompletado local.
  - Maneja errores mostrando alertas y registrando en consola.

- **`NnaForm.tsx`**: subformulario para datos del NNA (nombre completo, fecha de nacimiento, opiniones, necesidades especiales). `NewCaseForm` importa y usa este componente.

**Páginas: `CasosPage.tsx`**

- **Propósito:** Lista de casos, búsqueda, botón `Nuevo Caso` que abre un `Modal` con `NewCaseForm`.
- **Detalles:** Al crear un caso exitosamente se refresca la lista llamando a `procesoJudicialAPI.getAll()`.

**UI**

- Componentes base en `src/components/ui/` permiten consistencia visual: `Button`, `Input`, `Card`, `Modal`, `Tabs`.

**Notas técnicas y recomendaciones**

- **URLs y CORS:** `src/lib/api.ts` apunta por defecto a `http://localhost:3000`. Ajustar `API_URL` para producción o usar variable de entorno.
- **Manejo de JWT:** Si el backend devuelve diferentes nombres de campo en el token (p. ej. `userId` en lugar de `sub`), actualizar `auth.context.tsx`.
- **Validaciones:** `react-hook-form` está en uso; para validaciones complejas preferir `zod` y `@hookform/resolvers` (ya está instalado).
- **Tip de seguridad:** No confiar únicamente en el token en el frontend; validar permisos desde backend.

**Dónde buscar cambios recientes**

- Archivos relevantes que fueron editados recientemente y revisados para esta documentación:
  - `src/components/forms/NewCaseForm.tsx` — formulario de creación de casos (incluye lógica para crear NNA y el caso).
  - `src/pages/CasosPage.tsx` — lista de casos y modal para crear nuevo caso.
  - `src/contexts/auth.context.tsx` — manejo de sesión y token.

Nota: El archivo `DynamicForm.tsx` y `NuevoCasoModal.tsx` no se encuentran en la ruta `src/components/forms/` actualmente. El formulario usado para crear casos es `NewCaseForm.tsx`.

**Cómo contribuir / extender**

- Para añadir un nuevo formulario reutilizable:
  - Crear archivo en `src/components/forms/`, usar `react-hook-form` y tipos `TS` para los datos.
  - Exportar las props necesarias (p. ej. `register`, `errors`) para integrarlo en formularios compuestos.
- Para añadir un nuevo endpoint API:
  - Añadir nuevas funciones en `src/lib/api.ts` usando la instancia `api`.

**Comandos rápidos**

```
npm install
npm run dev
npm run build
npm run preview
```

**Siguientes pasos sugeridos**

- Añadir un archivo `env` o usar variables de entorno para `API_URL`.
- Añadir manejo de errores y notificaciones más amigables (toasts) en vez de `alert`.
- Añadir tipado más estricto para las respuestas del API (interfaces `TS`).

Si quieres, puedo:

- Generar documentación adicional por archivo (resumen de props y tipos para cada componente).
- Crear una versión en `README.md` con esta información y badges de estado.

---

Generado automáticamente por el asistente. Pide ajustes o profundidad en áreas concretas si lo deseas.
