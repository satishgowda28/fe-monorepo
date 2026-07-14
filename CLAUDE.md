# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Learning repo for monorepo mechanics. pnpm workspaces + Lerna task runner, one Vite/React app, shared internal packages.

## Commands

Run from repo root (Lerna fans out to workspaces):

```
pnpm install       # installs all workspaces
pnpm dev           # lerna run dev --parallel
pnpm build         # lerna run build (tsc -b && vite build per app)
pnpm lint          # lerna run lint
pnpm test          # lerna run test
```

Scope to one workspace directly instead of root scripts when iterating on a single package:

```
pnpm --filter customer-portal dev
pnpm --filter @repo/ui build
```

No test runner is wired up yet (`test` script exists at root only; no package defines a `test` script or test files).

## Architecture

Workspace globs (`pnpm-workspace.yaml`): `app/*` and `packages/*`. Lerna (`lerna.json`, versioning disabled at `0.0.0`) is only the task orchestrator across workspaces — pnpm handles installs/linking.

- `app/customer-portal` — the Vite + React 19 app. Consumes `@repo/ui` via `workspace:*`.
- `packages/ui` (`@repo/ui`) — shared component library, unbuilt: `main`/`types`/`exports` all point straight at `./src/index.ts`, no compile step. Consumers get raw TSX/CSS-module source through the bundler, not a `dist`.
- `packages/ts-config` (`@repo/ts-config`) — shared tsconfig bases, not code. `base.json` sets strict compiler options common to everything; `react-app.json` and `react-lib.json` extend it for app-shaped vs. library-shaped packages (lib adds `declaration`/`declarationMap`). Every new package/app tsconfig should extend one of these two, not `base.json` directly.
- `packages/utils` — placeholder, not yet populated.

### Adding a new shared package

Follow `packages/ui` as the template: `package.json` with `main`/`types`/`exports` pointing at `src/index.ts` (source-only, no build), `tsconfig.json` extending `../ts-config/react-lib.json`, referenced by consumers as `"@repo/<name>": "workspace:*"`.

### Adding a new app

Follow `app/customer-portal`: split tsconfig (`tsconfig.json` as a references-only root, `tsconfig.app.json` extending `../../packages/ts-config/react-app.json`, `tsconfig.node.json` for Vite config typing), Vite + `@vitejs/plugin-react`, ESLint flat config (`eslint.config.js`) composed from `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
