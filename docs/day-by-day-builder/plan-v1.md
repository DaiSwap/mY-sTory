# Day-by-day Builder — Plan v1 (post-review reset)

> v0 was reviewed by 10 specialists (see `review-01` through
> `review-10`) and **abandoned in its proposed form** after a product
> direction reset. This file documents v1: a much smaller, narrative-
> first slice. v0 stays in the repo for the record.

## The product problem (in the user's words)

> *A clean itinerary that you can **choose like a story** (the flow of
> exploring + voting on the site) and **read back as a story** at the
> end — friendly for users of any age, no jargon, no edit complexity.*

This reframes "Day-by-day Builder" from a *feature* into a *story
ending* for the site that already exists.

## What changed from v0

| v0 (rejected) | v1 (this plan) |
|---|---|
| New `plan.html` page in the nav | **No new page.** A synthesis block on the existing Results page. |
| Auto-generated 14-day vertical timeline | One paragraph + a compact stop-by-stop strip |
| Editable: ▲ ▼ buttons, −/+ nights, ✕ remove | **Read-only.** No edit controls. |
| Per-day cost breakdown (accom + food + activities + transport) | One total: *"~₹X per person"* — no line items |
| Plan stored in localStorage with edit-drift detection | Derived live from existing votes + profile; no separate storage |
| Print stylesheet, copy-as-text button | Neither in v1 |
| Personal-only first (group plan deferred) | **Group-by-default**, with a *"My picks"* toggle for personal view |
| Cost model: 5 hardcoded ₹ figures | Reuses the existing route cost formula (already on Routes page) |
| Transport lookup table + Haversine fallback | Reuses existing Haversine; doesn't pretend to know road times |

## Why this is the right cut

The convergent signal across the 10 reviews:

- **Product design (#01):** "the *budget number* is the moment of
  delight, not the timeline" — collapse to a headline number.
- **PM (#02):** "the site's thesis is collective decision; ship a
  group plan first; v1 should be read-only."
- **Personas (#04):** 2 of 5 mock users (parents, sister) explicitly
  want to *read*, not build.
- **IA (#05):** *"Plan is not a tab within Results... but a thin
  block at the bottom is correct."*
- **Travel domain (#09):** *"Tier-based default nights and Haversine
  × 1.3 will be wrong in ways an experienced traveller notices
  immediately."* — so don't pretend to be precise.
- **Edge cases (#10):** 18 of 20 failure modes evaporate when there
  are no edit controls and no separate storage.

The simplest design that satisfies the product problem statement is:
**a paragraph and a strip, computed from data already on the page,
on the Results page, with no new persistence.** No reviewer's "must
have" findings get violated.

## What v1 ships

A new block at the bottom of `results.html`, between the bar chart
and the foot. Two states by default:

**1. Headline sentence.** One line, large type, plain English:

> *"Your group is leaning toward a 12-day north-to-central trip —
> Hanoi, Ha Giang, Phong Nha, Hoi An. Around ₹68,000 per person."*

**2. A compact stop strip** below it: each stop as a small chip
showing place name + nights, with km between chips. Reuses the
`.stop` / `.dist-label` styles already on the map.

**3. A 'My picks / Group's picks' toggle.** Group is default. The
two states pull from the same data through different filters:
- *Group* = places with combined-yes-score ≥ 2 (or a simple
  configurable threshold)
- *My picks* = places where this device's user voted Yes or Maybe

## What v1 does NOT ship

- No new nav entry
- No new page
- No drag, no edit, no ✕ remove, no −/+ nights
- No per-day cost breakdown — only the total
- No print stylesheet, no copy-as-text, no shareable URL
- No persistence — the synthesis is derived live every time

## Acceptance criteria (does it read as a story?)

A 65-year-old non-technical user, given the URL and 30 seconds,
should be able to:

1. See one sentence summarising the group's leaning
2. See where they'd be going (place names, in order)
3. See roughly how long and how much
4. *Not* see edit controls, sliders, cost breakdowns, or anything
   labelled "advanced"

A 12-year-old in the group should be able to read the same sentence
out loud at the dinner table and have it make sense.

That's it. If the synthesis fails either test, v1 isn't done.

## Implementation outline

- `app.js` adds one new function `renderTripStory()` called from
  inside `renderResults()` after the bar chart.
- It derives the place list (group or personal), orders north → south
  using the existing `renderMyRoute` sort, applies the existing tier
  → night defaults, computes total km via existing `haversineKm`,
  and reuses the existing `estimateRouteCost` for the rupee total.
- All-ages friendly copy via a small templating helper — plain
  sentences, written numbers where natural ("twelve days" not "12 d").
- The toggle is a 2-button pill above the synthesis block, similar
  to the existing route-picker buttons.
- Mobile: synthesis sentence at top, strip wraps; toggle stays a
  single row.
- Reduced-motion: no entrance animation.
- Accessibility: synthesis sentence is an `<h2>` with `aria-live="polite"`
  so toggling between *My picks* and *Group's picks* announces the
  change.

## Open question for v1.1+

The reviews flag one big constraint: **the trip dates are still TBD**.
Calendar dates would make the story read as *"You'll arrive August 14
in Hanoi…"* instead of *"Day 1 in Hanoi"*. That's a meaningful
emotional difference but adds a 6th onboarding step and locks the
group into a window. Defer until the dates conversation happens
separately.
