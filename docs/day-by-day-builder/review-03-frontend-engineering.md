# Review 03 — Frontend Engineering

> Lens: senior frontend engineer. Asked to assess feasibility,
> complexity, state model, and what to push back on for v1 — within the
> constraint of plain HTML/CSS/JS, no framework, no bundler.

## Findings

**1. LOC estimate.** The existing patterns (innerHTML template
literals, addEventListener, CSS classes) are verbose but consistent.
Realistic: `plan.html` shell ~80 lines, plan-specific CSS ~200 lines
(day-card layout, edit controls, print styles), `plan.js` ~450–550
lines (state model, render function, event delegation, localStorage
save/load, transport lookup). Total new code ~750–850 lines —
roughly doubling the current CSS and adding ~45% to JS. That's
substantial for a "static site, no framework."

**2. State management.** The existing code uses full re-render on
every change (`renderResults`, `renderMyRoute`, `renderRouteMeta`
all rebuild innerHTML wholesale). For day-cards with 5+ controls
each, **full re-render on every edit is the correct v1 pattern here**
— it matches the codebase idiom, avoids surgical DOM-surgery bugs,
and the dataset is tiny (≤12 cards). The risk is focus loss after
re-render. Mitigation: save
`document.activeElement.dataset.id` and `dataset.action` before
re-render, then `querySelector` and re-focus the matching button
after. No framework needed.

**3. Haversine × 1.3 for novel pairs.** Vietnam is topographically
hostile to straight-line estimates. Quy Nhon → HCMC is ~590 km
straight-line but ~650 km by road (acceptable). Ha Giang → Cat Ba is
~370 km straight-line but road via Hanoi is ~480 km plus a ferry, so
the multiplier undershoots badly. The real failure mode is
mountain-region pairs (Ha Giang, Pu Luong, Sapa) where passes and
switchbacks add 40–60% over crow-flies. 1.3× is fine for flat or
coastal legs but will produce optimistic durations for northern legs.
**Hardcode known-bad pairs in the lookup table; fall back to
Haversine only for genuinely novel combos.**

**4. Cost constants.** They already exist scattered:
`flights=25000, visa=2100, perDay=3000, perTransfer=1500` in the
existing route cost estimator. Consolidate into a single `COST`
object at the top of `app.js` alongside `PLACES`/`ROUTES`. Don't make
them per-profile configurable in v1 — that's a separate UX problem
(which cost categories does the user control?).

**5. localStorage schema.** Keep it flat and versioned:
```js
{
  v: 1,
  generatedAt: "ISO-string",
  stops: [
    { id, nights, locked: bool }
  ]
}
```
The `locked` flag per stop allows the user to pin a stop so it
survives a regenerate. The `v` field lets you migrate or discard
stale schemas without crashes.

**6. Edit conflicts / staleness.** The Firestore subscription pushes
ALL_VOTES live. If the user edits their plan and then votes change,
the plan should **not** auto-regenerate — that would destroy user
edits silently. The right behaviour: show a "Votes have changed
since this plan was built — regenerate?" banner. Do not
auto-regenerate. Store `generatedAt`; compare against the latest
vote timestamp on each Firestore snapshot.

**7. Print stylesheet specifics.** Hide `.nav`, `.onb-wrap`,
`.sheet`, `.scrim`, the edit control buttons, and any
`data-no-print` elements. Force `color: #000; background: #fff` on
all day-cards. Remove `border-radius` and `box-shadow` (waste ink).
Expand any collapsed sections. Set `page-break-inside: avoid` on
each day-card. Override the CSS custom properties for `--bg`,
`--bg-2`, `--ink` at `@media print`.

**8. Mobile edit controls.** Drag-and-drop is essentially unusable
on touch without a dedicated library (plain JS drag API doesn't work
reliably on iOS Safari). **Push back on drag-reorder for v1**; use
▲ ▼ tap buttons with `min-height: 44px`. The −/+ nights buttons are
fine at 44 px touch targets.

**9. Third-party dependencies.** The transport lookup table and
Haversine are pure JS — no new dependency. The print stylesheet is
pure CSS. **Nothing here requires a library.** The only risk is if
someone proposes a drag-and-drop library — resist that.

**10. Push back on v1 scope.**
- (a) **Drag-to-reorder → ▲ ▼ buttons.** Saves ~100 LOC and a
  touch-compatibility rabbit hole.
- (b) **Transport-out lookup table for all 66 pairs (12 places²) →
  only the ~20–25 pairs that actually appear in ROUTES stops.** Fall
  back gracefully ("transport TBD") for exotic combos rather than
  pretending Haversine × 1.3 means anything for Ha Giang → Quy Nhon.

## Architecture sketch

Build `plan.html` as a self-contained page that imports the same
`app.js` (for `Profile`, `TripVotes`, `PLACES`, `Log`, `formatINR`,
`escapeHTML`) and a new `plan.js`. On load, `plan.js` reads the saved
plan from localStorage or calls `generatePlan()` which filters PLACES
by yes/maybe votes, orders them north-to-south (matching
`renderMyRoute`'s existing sort), assigns default nights from a
`DEFAULTS` object, and writes the schema.

A single `renderPlan()` function rebuilds the entire `#plan-list`
via one large innerHTML template literal — exactly as
`renderResults` does — and re-attaches event listeners via event
delegation on the container. Every edit (reorder, nights change,
remove) mutates the in-memory stops array, calls `savePlan()` to
write localStorage, then calls `renderPlan()`.

This keeps the state model as a plain array of stop objects, avoids
any two-way binding complexity, and stays idiomatic with the rest of
the file. The Firestore snapshot listener from `app.js` fires into
ALL_VOTES as usual; `plan.js` adds one listener on top that checks
`generatedAt` and shows a stale-banner if needed, without touching
the stops array.
