# Repository Guidelines

## Project Structure & Modules
- Monorepo managed by `pnpm` and `turbo`. Core apps live in `apps/`: `apps/web` (Next.js frontend) and `apps/agent` (Express-based agent service). Shared code and configs live in `packages/` (`packages/shared`, `packages/config`).
- Architecture notes sit in `docs/architecture/`; use them to understand design decisions before making big changes.
- Environment examples: `.env.example` in the repo root; keep secrets out of commits.

## Build, Test, and Development
- Install: `pnpm install` (Node 18+). Workspace-aware, so run from repo root.
- Run all builds: `pnpm build` (delegates to Turbo).
- Run all dev servers: `pnpm dev` (spawns app-specific dev commands via Turbo).
- Lint everything: `pnpm lint`; format repo-wide: `pnpm format`.
- Web app: `pnpm --filter @interview/web dev` (Turbopack), `pnpm --filter @interview/web build`, `pnpm --filter @interview/web lint`.
- Agent service: `pnpm --filter @interview/agent dev` for watch mode, `... start` for prod-like run, `... test:shared` to exercise shared agent flows.

## Coding Style & Naming
- TypeScript-first; prefer strict typing and `async/await`.
- Formatting: Prettier defaults (2-space indent, semicolons off by Next defaults). Use `pnpm format` before pushes.
- Linting: Next.js ESLint config for `apps/web`; standard ESLint in `apps/agent` and `packages/`.
- Naming: kebab-case for files, PascalCase for components/classes, camelCase for functions/vars; keep React components co-located with related styles/assets.

## Testing Guidelines
- Static checks are required: run `pnpm lint` plus `pnpm --filter @interview/agent test:shared` when touching agent logic.
- Prefer colocated test files named `*.test.ts`/`*.test.tsx`; mock external APIs (Stream/OpenAI) and avoid hitting real services in CI.
- Aim for meaningful integration coverage around auth, streaming, and persistence boundaries; document gaps in PR descriptions.

## Commit & Pull Request Guidelines
- Commit messages should be short and imperative; prefixes like `feat:`, `fix:`, `chore:`, `docs:` match existing history (e.g., `feat: Add GDPR cookie consent banner`).
- Keep commits scoped to a single concern; include migration steps or env changes in the message body when relevant.
- PRs should include: brief summary, test notes/commands run, screenshots or clips for UI changes, and linked issues. Call out schema or config changes explicitly.

## Security & Config Notes
- Sensitive env vars (DB, auth providers, Stream keys, OpenAI) are read via Turbo global env; load them locally through a `.env` copy of `.env.example`.
- Do not commit generated `.next`, `dist`, or database artifacts. Use `docker-compose.yml` only when services are required for local debugging.
