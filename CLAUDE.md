# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CRM Web Frontend - A Vue 3 + TypeScript management system built with Vite, Ant Design Vue, and Pinia.

## Commands

```bash
# Development server (runs on port 3000)
npm run dev

# Type check and build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### Tech Stack
- **Vue 3** with Composition API (`<script setup lang="ts">`)
- **TypeScript** with strict mode enabled
- **Vite** as build tool
- **Pinia** for state management (with persistedstate plugin)
- **Vue Router** for routing with navigation guards
- **Ant Design Vue 4** for UI components
- **Axios** for HTTP requests

### Project Structure

```
src/
├── api/           # API service layer - one file per domain (user.ts, role.ts, etc.)
├── stores/        # Pinia stores - user.ts for auth, permission.ts for RBAC
├── router/        # Vue Router with auth guards and white-listed routes
├── views/         # Page components organized by feature (login/, dashboard/, system/)
├── layouts/       # Layout components (MainLayout with sidebar)
├── utils/         # request.ts (Axios wrapper), auth.ts (Token utilities)
├── types/         # TypeScript interfaces for API requests/responses
└── styles/        # Global styles (index.less)
```

### Key Patterns

**API Layer** (`src/api/`):
- Functions return typed Promises using interfaces from `src/types/index.ts`
- All API calls go through `src/utils/request.ts` which handles:
  - Bearer token injection from localStorage
  - Response unwrapping (returns `data` directly on success, code === 0)
  - Error handling with 401 redirect to login

**State Management** (`src/stores/`):
- `user.ts` - Authentication state (token, userInfo, login/logout actions)
- `permission.ts` - Menu permissions and RBAC checks
- Stores use `pinia-plugin-persistedstate` for persistence

**Routing** (`src/router/index.ts`):
- Static routes defined in `constantRoutes`
- Auth guard checks token, fetches user info on first access
- White-list: `/login`, `/403`, `/404`

**Backend API Conventions**:
- Base URL: `VITE_API_BASE_URL` (dev: `http://localhost:8080`)
- Response format: `{ code: number, message: string, data: T }`
- Success: `code === 0`
- Auth header: `Authorization: Bearer <accessToken>`
- API paths start with `/user/` prefix (e.g., `/user/auth/login`, `/user/role/rolePage`)

### Path Alias

`@/` maps to `src/` (configured in tsconfig.json and vite.config.ts)

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_TITLE` - Application title