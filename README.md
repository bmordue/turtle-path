# Turtle Path

A grid maze puzzle: plan a route from START to END, then program a turtle
robot to follow it using `turn left`, `turn right`, and `forward X`.

## Stack

- Vite + React + TypeScript, no server component.
- Levels live as individual JSON files in `src/levels/` and are picked up
  automatically via `import.meta.glob` — add a file, get a level, no other
  code changes needed. Shape:

  ```json
  {
    "name": "Level 3",
    "size": 6,
    "start": { "x": 0, "y": 5 },
    "startDir": 0,
    "end": { "x": 5, "y": 0 },
    "blocked": [[1,1],[1,2]]
  }
  ```
  `startDir`: 0 = North, 1 = East, 2 = South, 3 = West.

- `src/lib/turtle.ts` is the pure simulation core (no React): stepping,
  collision checks, and an async generator (`runProgram`) that yields one
  event per move/turn/crash/success, so both animated playback and any
  future headless testing share the same logic.
- `src/components/Grid.tsx` renders the maze as SVG and is reused, unchanged,
  by both the game (`src/App.tsx`) and the print worksheet
  (`src/print/PrintView.tsx`) — the worksheet is just the same component
  with `readOnly` and no turtle overlay, visited by adding `?print=1` to the
  URL and printing from the browser (`@media print` rules live in
  `src/styles.css`).

## Develop (NixOS / home-manager)

```sh
nix develop        # drops you into a shell with node + npm
npm install
npm run dev         # http://localhost:5173
npm run dev -- --open '/?print=1'   # jump straight to the worksheet view
```

## Build

```sh
npm run build        # -> dist/, plain static files, host anywhere
npm run preview       # serve the production build locally
```

### Reproducible Nix build

`nix build` uses `pkgs.buildNpmPackage`, which needs a hash of your
`package-lock.json` dependency tree (`npmDepsHash` in `flake.nix`). It ships
with a placeholder — run `nix build` once, Nix will fail and print the
correct hash to paste in, or compute it directly:

```sh
nix run nixpkgs#prefetch-npm-deps -- package-lock.json
```

## Adding levels

Drop a new `src/levels/level-N.json` following the shape above — no edits
to `App.tsx` or anywhere else required. Files are loaded in filename sort
order, so name them so that ordering comes out the way you want
(`level-01.json`, `level-02.json`, … for more than 9 levels).
