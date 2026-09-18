# WorkspaceHub

WorkspaceHub is a full-stack multi-tenant workspace app for organizations: teams manage projects, tasks (with comments), bookings, members, and feature flags under role-based access control.

**Live:** <https://workspacehub-client-git-workspacehub-part-2-workspace-hub.vercel.app>

**API:** <https://workspacehub-api-git-workspacehub-part-2-workspace-hub.vercel.app/api/health>

## Features

- Multi-tenant organizations with owner, admin, and member roles
- Projects and tasks with permission-gated create, update, and delete
- Task comments (create, edit, delete) nested under tasks, including an “Unknown user” fallback when an author is missing
- Bookings with client-side validation and role-aware Save/Delete controls
- Organization feature flags and member management for privileged roles
- Typed API payloads, shared permission helpers, lint/format/tests, and CI
- Deployed as separate Vercel projects for the Express API and Vite client (serverless)

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS
- Node.js + Express + TypeScript
- MongoDB + Mongoose (local or Atlas)
- JWT authentication
- Context API for client state
- ESLint + Prettier + Vitest
- Vercel (client static site + serverless API)

## Project Structure

```text
workspacehub/
  client/
  server/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment examples and fill them in:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Recommended local values:

```env
# server/.env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/workspacehub
JWT_SECRET=super-secret-jwt-key
CLIENT_ORIGIN=http://localhost:5173
```

```env
# client/.env
VITE_API_URL=http://localhost:5001
```

3. Start MongoDB locally or point `MONGODB_URI` at an existing instance (for example MongoDB Atlas).

4. Seed demo data:

```bash
npm run seed
```

5. Run the server and client in separate terminals:

```bash
npm run dev:server
npm run dev:client
```

## Demo Users

The seed script creates one organization with these users:

- `owner@workspacehub.dev` / `Password123!`
- `admin@workspacehub.dev` / `Password123!`
- `member@workspacehub.dev` / `Password123!`

## Scripts

- `npm run dev:server`
- `npm run dev:client`
- `npm run build`
- `npm run seed`
- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm run test`

## Environment variables

| Variable        | Where         | Description                                                           |
| --------------- | ------------- | --------------------------------------------------------------------- |
| `PORT`          | `server/.env` | Port the API listens on locally (default `5001`)                      |
| `MONGODB_URI`   | `server/.env` | MongoDB connection string                                             |
| `JWT_SECRET`    | `server/.env` | Secret used to sign and verify JWT login tokens                       |
| `CLIENT_ORIGIN` | `server/.env` | Allowed browser origin for CORS (local client or Vercel frontend URL) |
| `VITE_API_URL`  | `client/.env` | Base URL of the API used by the Vite client                           |

## Notes

- All protected API responses follow the same JSON envelope:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

- The booking overlap rule is isolated in the booking service.
- Feature-flag checks are isolated in a reusable middleware/service path.
- Permission logic is centralized in auth and permission helpers.
- Task comments are available at `/api/tasks/:id/comments` and require authentication.
