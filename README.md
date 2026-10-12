# Bagging line monitor

Small Angular app that shows the machines of a bagging production line (Scale, Attacher, Packer,
Closer) in a navigation bar and in an overview. Each machine is `running`, `alarm` or `warning`;
the state is shown by an icon, a color and a text, so it never relies on color alone.

## Run

Needs Node.js that satisfies the Angular CLI requirement (checked with Node 24).

```bash
npm install
npm start          # http://localhost:4200
npm test           # unit tests (Vitest)
npm run lint
npm run build
```

## What it does

- Navigation bar with one tab per machine, overview with all machines connected by a line,
  detail page `/machine/:id` with the time in the current state and the history of changes.
- Header with the clock, the language switch (English, Czech), the logged-in user, counters of
  alarms and warnings, and the connection status.
- Machine states change live. There is no backend, so the changes come from a simulation: every
  few seconds a random machine changes its state and now and then the connection "drops" for a
  moment (the header shows it).
- Works down to the smallest phones (320 px wide); the page itself does not scroll, each page
  scrolls inside.

## How it is built

- Angular 22, standalone components, signals, zoneless, SCSS. The only library with UI parts is
  Angular Material, used for the state tooltip and the language menu.
- Icons: Material Symbols (font bundled via `@fontsource-variable`). Translations: ngx-translate.

```
src/app/
  core/       models, data (API + socket), services, interceptors, guard, helpers
  layout/     header, machine navigation
  shared/     machine tile (used in the navigation and in the overview)
  features/   overview, machine detail
public/       data.json (the machines), i18n/*.json (translations), assets/
```

**Data flow.** `MachineService` loads the machines from `data.json` (`MachineApi`, a plain HTTP
GET) and then subscribes to `MachineSocket.updates()`. It is the single source of truth: it keeps
the machines, the history of changes (last 50) and the counters as signals, and the navigation,
overview, header and detail only read them.

**WebSocket.** `MachineSocket` is an abstract class with two implementations:

- `SimulatedMachineSocket` (used now) plays the server.
- `WebSocketMachineSocket` is a real client (RxJS `webSocket()`, reconnects automatically).
  It is **not verified**, because there is no server to try it against.

The app switches between them with one line in `app.config.ts`. A message from the server looks
like this:

```json
{ "id": "packer", "state": "alarm", "timestamp": 1760000000000 }
```

Each machine in `data.json` has a `type` (scale, attacher, packer, closer) and a `name`
(for example `CL-02`). The type is translated and decides the icon; the name is data from the
server, is not translated, and is shown in the detail and as the `title` of the tile. The state
labels and all other texts are translated.

## Styling

- Plain SCSS, mobile-first: the base styles are for a phone and `min-width` media queries (600 px,
  900 px) add the wider layouts. Header and overview use CSS grid / flex, no CSS framework.
- Sizes are in `rem` (so the layout follows the font size set in the browser); the only `px`
  values are the 1 px of the visually hidden helper class. Breakpoints are written in `px`,
  because a media query cannot read a CSS variable.
- The colors and the shadow are CSS custom properties (tokens) in `:root` in `src/styles.scss`,
  for example `--color-alarm`. Components use `var(--color-...)`, so a color is changed in one place.
- The three states are `.state-running`, `.state-alarm` and `.state-warning` (global). Each one
  only sets `--state-bg`, `--state-ink` and `--state-icon`; the tile and the header badges read
  them, so a new state means one new class.
- Every component has its own SCSS file. Global styles are only the tokens, the state classes,
  a small reset and three helper classes (`.sr-only`, `.text-overflow`, the icon font class).
- Angular Material has no theme here; only the tooltip and the menu are used, and their colors
  are set with the `mat.tooltip-overrides` and `mat.menu-overrides` mixins.
- The layout fills the screen (`100dvh`): the header and the navigation stay in place and each
  page scrolls inside itself.
- Animations (pulse of an alarm tile, color transitions) are switched off by
  `prefers-reduced-motion`.

## Accessibility

Semantic landmarks, a skip link, `aria-current` on the active tab, a visually hidden live region
that announces state changes ("Packer: Alarm"), visible focus, and no animation with
`prefers-reduced-motion`.

## Not implemented

- **Login.** There is no login page. The user is always "logged in" with a demo token
  (`AuthService`), the guard and the interceptors (token header, redirect on 401) only show where
  a real login would plug in. The guard redirects to `/login`, which does not exist, so it must
  not be used without adding that page first. A real app would keep the token in an HttpOnly
  cookie rather than send it from JavaScript.
- The real `WebSocketMachineSocket` is untested against a server. After a reconnect it only
  receives new changes; it does not load the states again, so changes missed during the break
  would not show.
- The history keeps the last 50 changes of all machines together, not 50 per machine.
- Only a few unit tests, no end-to-end tests.
- The socket address (`ws://localhost:8081`) is a constant in the code, not a configuration.

## Use of AI

Claude Code was used as a helper for specific coding tasks (for example the project setup, the
translations and some of the styles and tests). I reviewed the code and I am responsible for it.
