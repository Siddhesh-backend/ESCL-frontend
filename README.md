# ESCL — Engineering Sports Championship League (Frontend)

A production-ready React 19 + Vite + Tailwind CSS frontend for the ESCL cricket tournament
platform, built to plug into your existing Spring Boot + MySQL backend. No backend code, API
models, or extra fields were introduced beyond what you specified.

## Tech Stack
- React 19, Vite
- React Router DOM
- Axios (reusable service layer)
- Tailwind CSS v4
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Connecting to your backend

Copy `.env.example` to `.env` and set your backend base URL:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

All Axios calls go through `src/services/api.js`, which reads this variable — nothing is
hardcoded to `localhost` in individual services.

## Expected backend endpoints

The service layer assumes REST endpoints shaped like:

| Service | Base path |
|---|---|
| authService | `POST /auth/login`, `POST /auth/forgot-password` |
| playerService | `GET/POST /players`, `GET/PUT/DELETE /players/:id` |
| scheduleService | `GET/POST /schedules`, `GET/PUT/DELETE /schedules/:id` |
| upcomingSeriesService | `GET/POST /upcoming-series`, `GET/PUT/DELETE /upcoming-series/:id` |
| pointsTableService | `GET/POST /points-table`, `PUT/DELETE /points-table/:id` |
| contactService | `GET/POST /contacts`, `DELETE /contacts/:id` |

Adjust the paths in `src/services/*.js` if your controllers use different routes — the fields
sent in each payload match exactly the modules you specified (no extra fields were added).

## Folder Structure

```
src/
  assets/       static assets
  components/   reusable UI (Navbar, Footer, Sidebar, Button, Input, Card, Table, Loader,
                Modal, Toast, Pagination, SearchBox, Filter, EmptyState)
  pages/        route-level pages (Home, Login, Register, Contact, Schedule,
                UpcomingSeries, PointsTable, PlayerList, PlayerDetails, EditPlayer,
                About, NotFound, admin/*)
  layouts/      MainLayout (public), AdminLayout (sidebar)
  router/       AppRouter, ProtectedRoute
  services/     Axios instance + one service per module
  hooks/        useFetch, useDebounce, usePagination
  context/      AuthContext, ToastContext
  utils/        constants, formatters, validators
  styles/       Tailwind entry + design tokens (colors, fonts)
```

## Auth

`AuthContext` stores a JWT in `localStorage` under `escl_token` after a successful
`POST /auth/login`, and attaches it as a `Bearer` token to every subsequent Axios request.
`ProtectedRoute` guards `/admin/*` and the player edit route.

## Notes

- No fields were invented beyond what was specified per module.
- Colors, typography and layout follow the dark blue / orange / white theme, rounded cards,
  and cricket-network-style visual language (ICC / IPL / Cricbuzz / ESPN Cricinfo) requested.
- Admin dashboard charts are placeholders — wire them to your analytics endpoints when ready.
