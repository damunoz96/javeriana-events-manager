# Javeriana Lead & Events Manager

Dashboard administrativo para la gestión de programas académicos y leads (aspirantes interesados) de la Pontificia Universidad Javeriana.

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/) (o npm)
- Una cuenta en [Supabase](https://supabase.com/) con el proyecto configurado

## Instalación y ejecución local

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd javeriana-events-manager
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar las variables de entorno. Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_KEY=tu-anon-key
```

4. Ejecutar en modo desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

5. Build de producción:

```bash
pnpm build
pnpm preview
```

## Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── app/             # Componentes de la app (sidebar)
│   ├── form/            # Componentes de formulario (TextField, SelectField, SubmitButton)
│   ├── layout/          # Layout principal (AdminLayout)
│   └── ui/              # Componentes base de shadcn/ui
├── constants/           # Constantes globales (query keys)
├── hooks/               # Hooks personalizados (useDebounce, useTheme, form context)
├── integrations/        # Integraciones externas (Supabase, TanStack Query provider)
├── modules/
│   ├── events/          # Módulo de programas académicos
│   │   ├── components/  # ProgramCard, FeaturedProgramCard
│   │   ├── models/      # Tipos de la entidad
│   │   ├── pages/       # Catálogo y detalle de programa
│   │   ├── query-options/ # Opciones de query (infiniteQuery, queryOptions)
│   │   └── services/    # Servicio de comunicación con Supabase
│   └── leads/           # Módulo de leads/aspirantes
│       ├── components/  # LeadRow, LeadFormDialog, LeadDeleteDialog
│       ├── hooks/       # useLeadCrud (lógica CRUD compartida)
│       ├── models/      # Tipos de la entidad
│       ├── pages/       # Panel de leads
│       ├── query-options/
│       └── services/    # Servicio de comunicación con Supabase
├── routes/              # Rutas basadas en archivos (TanStack Router)
└── styles.css           # Estilos globales y tokens de diseño
```

## Decisiones técnicas

### Stack principal

- **React 19** con **Vite** como bundler. Se eligió Vite por su velocidad en desarrollo y su ecosistema de plugins.
- **TypeScript** para tener tipado estricto y reducir errores en tiempo de desarrollo.

### Routing

- **TanStack Router** con file-based routing. Cada archivo en `src/routes/` genera una ruta automáticamente. Se usó en vez de React Router porque ofrece tipado end-to-end en parámetros de ruta y search params sin configuración extra.

### Data fetching y estado del servidor

- **TanStack Query** para todo el manejo de datos del servidor. Se aprovechan features como `keepPreviousData` para transiciones suaves entre filtros, `infiniteQueryOptions` para el infinite scroll del catálogo, y query keys que incluyen los filtros para mantener cache granular.
- Los servicios (`Events`, `Leads`) encapsulan las llamadas a Supabase y se consumen desde los query options, separando la lógica de fetching de los componentes.

### Formularios

- **TanStack Form** con `createFormHook` para generar un hook tipado (`useAppForm`) que inyecta los componentes de campo (TextField, SelectField) y de formulario (SubmitButton) por contexto. Esto permite reutilizar la misma estructura de form sin prop drilling y con validación integrada.

### Base de datos

- **Supabase** como backend. Se usa el cliente JS para queries directas con filtros server-side (`.ilike()`, `.or()`, `.range()`, `.eq()`). Los tipos de la base de datos se generan automáticamente con `supabase gen types` y se importan en los modelos.

### UI y estilos

- **shadcn/ui** como sistema de componentes base (Card, Dialog, Button, Select, Tabs, etc.). No es una librería instalada como dependencia sino componentes copiados al proyecto, lo que permite modificarlos libremente.
- **Tailwind CSS v4** con tokens de color en OKLCH. Se agregó un token `--gold` para el branding de la universidad.
- **Modo oscuro** implementado con Context API (`ThemeProvider`), persistido en `localStorage` y con detección de preferencia del sistema.

### Notificaciones

- **Sonner** para toasts de feedback en operaciones CRUD (crear, editar, eliminar leads). Se integra con el theme context para respetar el modo claro/oscuro.

### Arquitectura modular

Se organizó el código por módulos (`events`, `leads`) donde cada uno tiene sus propios componentes, servicios, modelos y query options. Esto mantiene las responsabilidades separadas y hace que sea fácil escalar o agregar nuevos módulos sin afectar los existentes.

Los hooks personalizados como `useLeadCrud` y `useDebounce` extraen lógica reutilizable que se comparte entre páginas, y componentes como `PaginationControls` y `LeadRowSkeleton` evitan duplicación de código.
