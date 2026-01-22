# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project type
- Create React App (CRA) app using `react-scripts`.
- React 18 + `react-router-dom` (v6).
- JavaScript-only codebase (no TypeScript in app code, even if `typescript` is present in devDependencies).

## Common commands

### Install
- `npm install`
- CI/clean install (recommended if `package-lock.json` is up to date): `npm ci`

### Run dev server
- `npm start`
  - Serves at `http://localhost:3000`

### Production build
- `npm run build`
  - Outputs to `build/`

### Tests (Jest via CRA)
- Run all tests in watch mode: `npm test`
- Run a single test file: `npm test -- path/to/test-file.test.js`
- Run tests matching a name/pattern: `npm test -- -t "pattern"`
- Run tests once (non-interactive / CI style): `npm test -- --watchAll=false`
  - Note: currently there are no tests in `src/`, so this exits with code 1; use `npm test -- --watchAll=false --passWithNoTests` if you need a zero exit code.

### Linting
- CRA runs ESLint during `npm start` and `npm run build`.
- There is currently no dedicated `npm run lint` script; if you add one later, document it here.

## Current entry points
- `src/index.js`: bootstraps React and renders `<App />`.
- `src/App.js`: main app component (expected to define routing and layouts).

## Intended app architecture (per repository spec)
This repository is intended to become a small educational math site with:
- Standard pages: Home, About, Contact.
- A Lessons/Topics section with a left sidebar (topic list) and center content (topic theory + examples + tasks + score).
- UI copy is Armenian (strings are currently hardcoded in components/pages).

### Routing
Target routes (react-router-dom):
- `/` → Home
- `/about` → About
- `/contact` → Contact
- `/lessons` (or `/topics`) → lessons index (shows placeholder card when there are no topics)
- `/lessons/:topicId` → a single lesson/topic page

### Layout rules
Use route-based layouts (preferred over “if route then hide footer”):
- **Main layout**: fixed Header + page content + fixed Footer.
- **Lessons layout**: fixed Header + lessons content (no Footer).

Ensure page content has enough top/bottom padding so it doesn’t render under the fixed Header/Footer.

### Suggested folder structure (keep CSS adjacent to components)
When implementing the spec, keep components and pages grouped with colocated `.css` files:
- `src/components/`
  - `Header/` (fixed top nav)
  - `Footer/` (fixed bottom; content mirrors About)
  - `Sidebar/` (topic list for lessons)
  - `Card/` (placeholder “Скоро будет”)
- `src/pages/`
  - `Home/`, `About/`, `Contact/`
  - `Lessons/` (lessons index)
  - `LessonTopic/` (single topic page)
- `src/data/topics.js`: array of topics, each with theory + examples + ~5 questions.

### Lessons/topic data model expectations
`src/data/topics.js` is expected to be a plain JS array of objects (easy to replace later), e.g.:
- `id` (used as `:topicId`)
- `title`, `description`, `text`
- `examples` (array)
- `questions` (array, at least 5)

### Quiz/scoring expectations
On a topic page:
- Render at least 5 questions.
- Collect answers (simple inputs/buttons are fine).
- On “Проверить/Завершить”, compute a score (e.g. scale to 10–100) and render the result below the questions.

## Notes
- `node_modules/` is present in the repo tree; avoid editing it and avoid expensive searches that recurse into it when possible.
