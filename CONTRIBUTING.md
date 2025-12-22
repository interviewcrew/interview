# Contributing Guidelines

## Environment & Setup
- Use Node 18+ with `pnpm` and Turbo; install dependencies at the repo root via `pnpm install`.
- Copy `.env.example` to `.env` (and app-specific env files as needed) and fill in secrets (Stream, OpenAI, OAuth, DB).
- Workspace layout: apps live in `apps/` (`web` for Next.js, `agent` for the Express agent service); shared utilities live in `packages/`.

## Branches & Commits
- Prefer small, focused branches. Keep commit messages imperative with short prefixes (`feat:`, `fix:`, `chore:`, `docs:`) matching current history.
- One concern per commit; document env or migration changes in the commit body when relevant.

## Development Workflow
- Build all: `pnpm build` (Turbo fan-out).
- Run dev: `pnpm dev` (spawns app-specific dev servers); target apps with filters, e.g. `pnpm --filter @interview/web dev`.
- Lint/format before pushing: `pnpm lint` and `pnpm format`. Web uses Next ESLint config; agent uses standard ESLint.
- Keep dependencies in workspace scope (`workspace:*` where applicable) and avoid duplicating packages across apps.

## Code Style
- TypeScript-first. Use `async/await`, avoid unhandled promises, and keep modules cohesive.
- Naming: kebab-case files; PascalCase for components/types; camelCase for vars/functions; enums as PascalCase with SCREAMING_SNAKE members only when required.
- Prettier conventions (2-space indent, double quotes per current config). Do not disable lint rules without a local comment explaining why.
- React/Next: co-locate hooks/components with their module folders; prefer server actions for mutations when appropriate.

## Testing & Quality
- Minimum: `pnpm lint` plus `pnpm --filter @interview/agent test:shared` when touching agent logic.
- Add `*.test.ts`/`*.test.tsx` colocated with code. Mock external APIs (Stream/OpenAI); no live calls in tests.
- For data changes, verify Drizzle schema and migrations stay in sync; avoid breaking API contracts in `trpc` routers.

## Security & Data
- Never commit secrets or generated artifacts (`.next`, `dist`, recordings, DB dumps). Respect Turbo `globalEnv` keys; keep them local.
- Validate webhook and auth flows: maintain signature checks and authorization guards; avoid logging sensitive payloads in production.

## Pull Requests
- Include: what changed, why, and how to test (commands). Add screenshots or clips for UI changes.
- Call out schema/env changes and any manual steps. Ensure CI-critical commands (`pnpm lint`, targeted tests) are green before requesting review.
