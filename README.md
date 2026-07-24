# Br1lliant T0ols

Frontend-only UI mockup of an all-in-one CTF toolkit. **No backend, no real analysis logic** —
every result is mock data, per the spec this was built from. It's meant to demo the product
vision, not actually crack anything.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + Recharts + lucide-react.

`shadcn/ui`, Monaco Editor, and React Flow from the original spec were swapped for hand-built
equivalents (styled panels / a custom SVG node graph) to keep the hackathon build light and
dependency-free. Swap them back in later if you want the real thing — the components are
isolated in `src/components/ui/` and `src/components/WorkbenchGraph.tsx` so it's a local change.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Deploying to GitHub Pages

1. `npm run build`
2. Push the repo, then either:
   - Use a GitHub Actions workflow to build and deploy `dist/` on push (recommended — ask
     Claude to generate one), or
   - Manually push the contents of `dist/` to a `gh-pages` branch.
3. In repo Settings → Pages, set the source to the `gh-pages` branch (or your Actions workflow).

Note: Vite needs a `base` path set in `vite.config.ts` if you're deploying to
`username.github.io/repo-name` rather than a custom domain — add `base: '/repo-name/'`.

## What's fully built vs. stubbed

**Fully interactive with mock data:**
Dashboard, Smart Analyzer (drag-drop + animated pipeline), Cryptography, Digital Forensics,
Utilities, Web Exploitation, Reverse Engineering, Plugins, Command Palette (⌘K).

**Polished empty states (not yet built out):**
Workspace, Networking, AI Assistant, Notes, Settings.

## Project structure

```
src/
  components/
    layout/       Sidebar, Topbar, CommandPalette
    ui/            Card, Button, Badge, Tabs, Progress, Input
    WorkbenchGraph.tsx   signature artifact-derivation graph (SVG)
    StubPage.tsx   shared empty-state for unbuilt modules
  data/mock.ts     all mock data in one place — edit here to change demo content
  pages/           one file per sidebar module
  App.tsx          routing (simple state-based, no react-router)
```
