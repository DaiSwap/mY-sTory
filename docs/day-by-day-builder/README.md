# Day-by-day Builder — Plan v0 + 10-Reviewer Critique

This folder captures the **product-design review process** before a single
line of the Day-by-day Builder feature is implemented. The aim: catch
weak assumptions early, surface domain gotchas, and ship a v1 that's
sharp from day one.

## What's in here

| File | What it is |
|---|---|
| [`plan-v0.md`](./plan-v0.md) | The initial proposal — what we'd build, why, and what we'd defer. **Reviewed, not yet implemented.** |
| [`review-01-product-design.md`](./review-01-product-design.md) | Senior product designer — UX flow, mental model, moment of delight |
| [`review-02-senior-pm.md`](./review-02-senior-pm.md) | Senior PM — MVP scope, sequencing, metric to move |
| [`review-03-frontend-engineering.md`](./review-03-frontend-engineering.md) | Frontend engineer — feasibility, state model, LOC estimate |
| [`review-04-user-personas.md`](./review-04-user-personas.md) | Five user personas (organiser, parents, busy sister, gap-year cousin, decision-maker spouse) |
| [`review-05-information-architecture.md`](./review-05-information-architecture.md) | IA — where it lives in the nav, naming, what NOT to merge |
| [`review-06-mobile-ux.md`](./review-06-mobile-ux.md) | Mobile UX specialist — touch targets, scroll length, sticky patterns |
| [`review-07-accessibility.md`](./review-07-accessibility.md) | a11y — WCAG 2.2 AA, screen-reader, focus management, print stylesheet |
| [`review-08-data-backend.md`](./review-08-data-backend.md) | Data / backend — schema, persistence, Firestore rules, free-tier quota |
| [`review-09-travel-domain.md`](./review-09-travel-domain.md) | Vietnam travel domain expert — realism of nights, transport, costs |
| [`review-10-edge-cases.md`](./review-10-edge-cases.md) | Edge cases / failure modes — 20 stress-test scenarios |

## Why this matters

Most planning tools are built feature-first ("we need an itinerary
builder") and discover their flaws in user testing weeks later. This
folder runs the inverse: a *named, dated, critiqued plan* before any
code lands. Every concrete recommendation below either makes it into
v1 or earns an explicit "deferred to v2" note.

## Big themes across the 10 reviews

1. **The headline number, not the timeline, is the moment of delight.**
   The total ₹/person and "fits/over budget" verdict should be the
   hero of the page, above the fold. The day-cards are supporting
   detail.

2. **"Group plan" should ship before "personal plan."** The site's
   whole pitch is collective decision-making; a personal-only
   itinerary undermines that. v1 should derive the plan from the
   group's combined Results, with per-user customisation as v2.

3. **The naïve auto-generator will be wrong in two specific ways
   Vietnam travellers notice:**
   - North→south by latitude routes you through Ha Giang *before*
     Sapa, which is operationally backwards (no direct road).
   - The Haversine × 1.3 fallback at 60 km/h is wildly optimistic for
     mountain roads (real drive times are 40–60% longer in the north).

4. **Cost model is too averaged.** Five hardcoded ₹ figures across
   places where accommodation alone varies 5× (Pu Luong homestay
   ₹800 vs Hanoi midrange ₹4,000). v1 should show a *range*, not a
   point estimate, and label it "rough."

5. **Calendar dates would unlock the emotional payoff.** "Day 1, Day
   2…" is technically safe (trip dates TBD) but the feature only
   really pays off when a real window is locked in. Plan a date-prompt
   add for v1.5.

6. **Drag-to-reorder is a touch-UX trap.** iOS Safari drag is fiddly;
   ▲▼ buttons covers the same intent with less risk.

7. **Plan stays editable even when votes change.** Once the user has
   touched the plan, Firestore vote updates should not overwrite their
   edits silently — show a "Votes changed — regenerate?" banner.

## What ships in v1 (revised after these reviews)

A short list to be cut from the v0 plan; full revised plan to follow
in `plan-v1.md` once the conversation around these reviews concludes.
