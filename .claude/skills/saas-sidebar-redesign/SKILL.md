---
name: saas-sidebar-redesign
description: Redesign a Vue 3 application's UI into a modern SaaS-style interface with a vertical left sidebar instead of a top nav bar, consistent spacing, and a polished professional look. Use when the user asks to redesign, restyle, or modernize the app's layout/navigation, switch to a sidebar nav, or make the UI look more like a professional SaaS product.
---

# SaaS Sidebar Redesign

Converts a Vue 3 app's top-nav layout into a modern SaaS-style shell: fixed vertical
sidebar on the left, consistent spacing scale, and a polished visual system (cards,
tables, buttons) applied across every view. This is a layout + design-system change,
not a feature change — behavior, routes, and data flow stay the same.

## When to use

- "Redesign the UI into a SaaS look"
- "Move the nav to a sidebar"
- "Make this look more professional / modern"
- Any request to restyle the shell (nav, spacing, typography, cards) across the whole app

## Non-negotiables (carry over from this project's conventions)

- **Delegate every `.vue` create/edit to the `vue-expert` subagent** — this is a mandatory
  rule in this repo's `CLAUDE.md`. This skill's job is to produce a clear, complete spec;
  the actual file edits happen through that subagent.
- No emojis in the UI.
- Comment only non-obvious logic (the WHY, not the WHAT) — per `CLAUDE.md`'s Code Comments
  section. Pure CSS/layout changes rarely need comments.
- Don't touch `server/` — this is a frontend-only redesign.
- Keep existing routes, component names, and API calls untouched unless the redesign
  requires moving markup (e.g. nav links move from `App.vue`'s header into a new
  `Sidebar.vue`, but they still point at the same routes).

## Step 1 — Audit before touching anything

Read, don't guess:
1. `client/src/App.vue` — current shell: header/top-nav markup, global styles, how
   `<router-view>` is mounted.
2. `client/src/main.js` — route list (every route needs a sidebar link).
3. Every file in `client/src/views/` — note per-view padding/margin conventions,
   card styles, table styles, color usage, so the redesign doesn't clash.
4. `client/src/components/` — shared components (modals, FilterBar, ProfileMenu,
   LanguageSwitcher) that currently live in or near the top nav and need a new home.
5. Any existing CSS variables/design tokens (search for `:root` or `--` custom properties).
6. `client/src/locales/` — nav labels are likely i18n keys (`t('nav.xxx')`); the sidebar
   must reuse these keys, not hardcode English strings.

Do this audit yourself (Read/Grep) — it's research, not a `.vue` edit, so it doesn't need
the vue-expert subagent. The subagent gets a spec built from what you find here.

## Step 2 — Design the shell

**Layout**: CSS Grid on the root app container —
```css
.app {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}
```
- Sidebar: fixed width (~220–260px), full height, `position: sticky` or grid column,
  vertical stack: logo/brand at top, nav links in the middle, user/profile menu pinned
  to the bottom.
- Main content: the old top-nav's remaining concerns (FilterBar, page content) live here,
  with consistent outer padding (see spacing scale below).
- Collapse behavior: for a desktop-first SaaS demo, a fixed sidebar is fine. Only add a
  collapse/hamburger toggle if the user asks for mobile support — don't build it
  speculatively.

**Sidebar nav item anatomy** (icon optional — skip if the app has no icon set, don't
invent an icon library dependency):
```vue
<router-link
  to="/inventory"
  class="sidebar-link"
  :class="{ active: $route.path === '/inventory' }"
>
  {{ t('nav.inventory') }}
</router-link>
```
- Active state: left accent bar or filled background, not just bold text — SaaS sidebars
  use a persistent visual indicator, not just color.
- Hover state: subtle background shift, no layout jump.

**Spacing scale** — pick one 4px or 8px base unit and use it everywhere via CSS variables,
e.g.:
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}
```
Apply consistently to card padding, gaps between stat tiles, section margins — the
"polished" feeling mostly comes from *everything* snapping to the same scale, not from
any single component. Audit every view for one-off magic-number paddings and normalize
them to this scale as part of the redesign.

**Visual polish checklist** (apply site-wide, reusing the app's existing color palette
unless the user explicitly asks for new colors — see `CLAUDE.md`'s Design System section
for this project's current tokens):
- Cards: consistent border-radius (e.g. 8–12px), subtle 1px border + soft shadow, white
  (or themed) background.
- Tables: consistent row height, subtle zebra or hover highlight, header row visually
  distinct (weight/color, not just a bottom border).
- Buttons: one primary style, one secondary/outline style, consistent height and
  radius across the whole app — audit existing per-view button CSS for drift and
  consolidate into shared classes (in `App.vue`'s global styles or a shared stylesheet).
- Typography: one scale for page titles, section headers, body text, and muted/secondary
  text — again, consolidate rather than let each view define its own.

## Step 3 — Write the spec, hand off to vue-expert

Produce a concrete task list (file by file) and delegate it as a single Agent call to
`vue-expert`, e.g.:

1. New `client/src/components/Sidebar.vue` — logo/brand, nav links (one per route from
   `main.js`, using existing i18n keys), active-state styling, profile/user area at the
   bottom (reuse `ProfileMenu.vue` rather than rebuilding it).
2. `client/src/App.vue` — replace the `<header class="top-nav">` block with the grid
   shell described above; mount `<Sidebar />` in the left column and
   `<FilterBar /><router-view /></main>` (or whatever the current main-content structure
   is) in the right column. Move global spacing tokens into the `<style>` block here if
   there isn't a separate global stylesheet.
3. Each view in `client/src/views/` — normalize padding/margins to the new spacing scale
   and align card/table/button classes to the consolidated styles. This can be one
   vue-expert task covering all views, since it's mechanical once the tokens exist.
4. Confirm nothing else (routes, API calls, component logic) changed — this is a pure
   presentation-layer migration.

Always specify in the handoff prompt: which exact files to touch, the grid/spacing
approach decided in Step 2, and that routes/behavior must stay identical — don't let the
subagent re-derive these decisions on its own.

## Step 4 — Verify

- Start (or confirm running) the dev server on `http://localhost:3000`.
- If Playwright MCP tools are available, visually check: sidebar renders, every nav link
  routes correctly and shows an active state, no visual regressions on at least the
  Dashboard, Inventory, and Orders views, and the layout doesn't break at a narrower
  viewport (even without a collapse feature, nothing should overflow/clip).
- If Playwright isn't available, open the app in a browser (`open http://localhost:3000`)
  and ask the user to confirm the look, or describe what to check.
