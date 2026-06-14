# Review 06 — Mobile UX

> Lens: senior mobile UX specialist. Most users will be on phones (per
> explicit user statement). Asked to prioritise mobile concerns from P0
> to P7.

## P0 — Touch targets will break on cards

Each day-card needs ▲ ▼ − / + ✕ — at least 5 controls. At 44 px each
with 8 px gaps, they consume ~268 px horizontally on a 375 px card,
leaving ~107 px for the place name. The only workable layout: split
controls into two rows — reorder buttons (▲ ▼) stacked vertically on
the left edge as a drag-handle alternative, and − / + ✕ in a bottom
action strip inside the card. **Do not try to fit all five on one
row.**

## P1 — Sticky summary header must collapse

The string *"14 days · 2,180 km · ₹78,400 per person · under budget
by ₹6,600"* does not fit on one line at 375 px. The existing
`.route-info` pill (bottom-left absolute,
`left:12px;right:12px;bottom:12px` on mobile) is the right precedent.
For the summary, use a **two-line collapsed sticky bar** at the top:
line 1 is *"14 days · ₹78,400"*, line 2 is a slim green/amber
budget-delta pill. Tap to expand inline. Height ≤ 56 px collapsed.
Reuse `backdrop-filter:blur(18px)` from `.nav`.

## P2 — 14-card scroll needs a jump index

A 700 px viewport with ~180 px cards means ~11 px of scroll per card
— 14 cards is ~2,520 px of scroll. Add a **horizontally scrolling
day-pill strip** below the sticky header (single row,
`overflow-x:auto; scroll-snap-type:x mandatory`). *"Day 1 · HAN ·
Day 2 · HOI…"* — tapping snaps the main scroll to that card via
`scrollIntoView`. Lighter than a full index modal.

## P3 — Full-screen edit sheet for text inputs

Any rename or add-note input will invoke the iOS virtual keyboard,
pushing the layout up ~300 px — the existing `.sheet` already handles
this correctly (`height:90svh; bottom:0;
border-radius:24px 24px 0 0`). Plan edits involving text input must
trigger this same bottom sheet. Inline inputs inside stacked cards
will be crushed by the keyboard. Consistent with the existing detail
sheet pattern.

## P4 — Re-render cost on mobile Safari

Avoid re-rendering all 14 cards on every − / + tap. Only update the
changed card's cost text node and the summary header. Use
`will-change:transform` only on the card being reordered (add/remove
the class in JS). Blanket `will-change` across 14 cards is a Safari
compositor memory hazard.

## P5 — Copy / Print buttons: not sticky

These are low-frequency actions. Put them at the bottom, not sticky.
On iOS, "Copy as text" is more useful than Print (AirPrint is
clunky). Swap button priority: "Copy" as `.hbtn-fill`, "Print" as
`.hbtn-line`, matching the existing hero CTA pattern.

## P6 — Landscape: skip 2-column

Existing patterns (`.grid`, `.res-bar`, `.stop`) use `auto-fill` /
`flex-wrap` rather than explicit 2-column breakpoints. For 14
ordered timeline cards, column order ambiguity on landscape is a UX
hazard — users won't know whether to read down column 1 then column
2, or across. Stay single-column; instead, reduce card padding at
`@media (max-height:500px) and (orientation:landscape)` to tighten
vertical rhythm.

## P7 — Optimistic UI for Firestore

Apply the reorder / change locally in JS state before the Firestore
write resolves. If the write fails, snap back with a subtle
"Couldn't save" toast using the existing `.route-info` pill style.
Do not block the UI on network round-trips.

## Recommended responsive layout pattern

Reuse three existing primitives verbatim:
- **Sticky header** = nav pattern (`position:fixed; backdrop-filter`)
- **Day-jump strip** = route-picker strip (`flex-wrap:nowrap;
  overflow-x:auto`)
- **Card edit tray** = bottom sheet (`90svh;
  border-radius:24px 24px 0 0`)

The day-card itself follows `.card` with an inner `.vote`-style
action strip at the bottom. **No new layout primitives needed.**
