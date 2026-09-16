# Copilot instructions for WorkspaceHub

WorkspaceHub is a full-stack project and task tracker: an Express/Mongoose API and a React/Vite frontend, run as an npm workspaces monorepo (`client/`, `server/`).

## Tech stack

- Backend: Express, Mongoose (MongoDB), TypeScript, JWT auth (`requireAuth`
  middleware).
- Frontend: React, React Router, Tailwind CSS, Axios.
- Tooling: ESLint 9 (flat config) + Prettier across both workspaces; Vitest
  for client unit tests.

## Project structure

- `server/src/models/`: Mongoose schemas. Types are derived with
  `InferSchemaType<typeof schema> & { _id: Types.ObjectId }` — never hand-write a matching interface.
- register models using the document as a type parameter `model<XDocument>("X", xSchema)`. For example:
    - `export const Task = model<TaskDocument>("Task", taskSchema);`
- `server/src/routes/` → `server/src/controllers/` → `server/src/services/`:
  the three backend layers. Routes wire up middleware and call `asyncHandler(controller)`; controllers extract request data, call a service, and respond with `sendSuccess(res, data)`; services hold business logic, database calls, and permission checks.
- `server/src/services/permissionService.ts`: every `canManage*` authorization check lives here, not in individual services or controllers.
- `client/src/types/models.ts`: frontend model and payload types. Update payloads are `Partial<CreatePayload>`, derived from the narrower create payload — never `Partial` of the full model.
- `client/src/services/*Service.ts`: one file per resource, each function wrapped in `unwrapResponse`.
- `client/src/pages/`, `client/src/components/`: pages own data loading and state; components receive data as props.

## Conventions

- Every document is scoped to an `organizationId`; new models and queries must respect that scoping.
- Frontend permission checks (`client/src/utils/permissions.ts`) mirror backend rules for UX only — the backend check is the real boundary and
  must exist independently.
- Don't add a database field or endpoint for something the frontend can derive from data it already has.

## Build, test, and validate

- `npm run dev:server` / `npm run dev:client`: start the two dev servers, in separate terminals.
- `npm run seed`: reseed demo data (`owner@workspacehub.dev`,
  `admin@workspacehub.dev`, `member@workspacehub.dev`; password
  `Password123!`).
- `npm run typecheck`: type-check both workspaces (`--workspace client` or `--workspace server` to scope it).
- `npm run lint` / `npm run format:check`: run across the whole repo, not per-workspace.

## Where to look first

- `server/src/app.ts`: middleware and route mounting.
- `server/src/routes/taskRoutes.ts` + `taskController.ts` + `taskService.ts`:
  a complete reference slice for the 3-layer pattern.
- `client/src/pages/TasksPage.tsx`: data loading, Tailwind conventions, and
  permission-gated UI, all in one file.

## Conditional constraints

For frontend work:

- Do NOT touch anything on the backend unless explicitly asked.
- Do NOT change the shape of any existing types unless explicitly asked.
- UI states must follow this pattern:
  1. **Loading:** The initial request is still in progress.
  2. **Load error:** The initial request failed, so the page can't safely show the ready UI.
  3. **Empty success:** The request succeeded, but there are no items to show.
  4. **Ready success:** The request succeeded, and there are items to show.
  5. **Action error:** The page is already usable, but a later create, update, or delete action failed.

For mock/test data:

- Do NOT invent fields. Do NOT include backend-only fields like passwordHash.
- Always use `_id`, not `id`.
- Include all required fields.
- Use valid constrained values (like specific status strings).
- Relationship fields (like `projectId`) must point to the right kind of record.
- Date fields must use the serialized string format expected by the frontend.
