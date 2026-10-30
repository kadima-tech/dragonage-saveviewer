# Dragon Age Save Viewer

Lists the story choices stored in a Dragon Age: Origins save game (`.das`) so they can be re-entered in the Dragon Age Keep. Everything runs in the browser; save files never leave the visitor's machine.

Live at <https://dragonage.kadima-tech.com>.

## Development

Requires Node 26 (see `.nvmrc`) and pnpm via Corepack.

```sh
corepack enable
pnpm install
pnpm dev      # local dev server
pnpm check    # lint, test and production build
```

## How it works

- `public/lib/jsgff/` is jsGFF, a reader for BioWare's GFF V4.0 format. `worker.js` loads it in a Web Worker so parsing doesn't block the page.
- `src/services/SaveFileService.js` reads the plot flags out of the parsed save and maps them to questions and answers using `src/assets/data/*.json`.
- `src/test/fixtures/` holds generated saves used by the end-to-end parser tests.

## Deployment

GitHub Actions runs `pnpm check` on every pull request. Pushes to `master` deploy `build/` to GitHub Pages, which serves the `dragonage.kadima-tech.com` custom domain. DNS is a CNAME to `kadima-tech.github.io` in the `kadima-default` Cloud DNS zone (project `kadima-terraform`).
