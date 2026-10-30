# Maintenance

## Maintenance Log

### 2026-10-30: Revival from GitLab

- Migrated from `gitlab.com/dzd-hosting/dragonage-saveviewer` to `kadima-tech/dragonage-saveviewer`, based on the `3-cleanup` branch (the last deployed version); `master` was a stale squash of an earlier branch.
- Replaced GitLab CI (which depended on the private `kadima/ci/web-ci` submodule, unreachable from GitHub) with GitHub Actions: `ci.yml` (lint, test, build) and `deploy.yml` (GitHub Pages).
- Replaced Create React App 2 with Vite 8, and React 16 with React 19 (`createRoot`; `defaultProps` removed). Upgraded styled-components 4 → 6 (transient `$` props), and moved to ESLint 10 flat config, Vitest 5, Node 26 and pnpm 12.
- Replaced `paralleljs` (and the postinstall script that stripped a BOM from its `package.json`) with a native Web Worker, `public/lib/jsgff/worker.js`.
- Fixed bugs: Results crashed on chapters with no choices; failed parses left the app stuck on the loading screen; `_hasFlag` used `< 74` instead of `< 64`; fonts were loaded over `http`; the Upload button and drag-and-drop did nothing.
- Added end-to-end parser tests using saves generated with Gibbed.DragonAge.SaveGenerator.
- Hosted on GitHub Pages at `dragonage.kadima-tech.com`.

## Recurring Patterns

None yet.
