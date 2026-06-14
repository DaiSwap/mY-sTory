# State of the site — 2026-06-15 (evening, follow-ups + PR-D)

**TL;DR**: Five more PRs after the restructure log (#23–#27). Mobile
overlap fix, comprehensive docs (feedback log + plans for B/C/D),
the quick-fixes bundle (PR-02), the RoutePicks Firestore sync
(PR-D), and a brand-link tweak that uses effective state. **Group
view is now genuinely group-wide once the Firestore rule is deployed.**

Read [`2026-06-15-restructure-shipped.md`](./2026-06-15-restructure-shipped.md)
first for the unchanged architecture overview. This log only covers
what changed in the second half of 2026-06-15.

---

## 1. What's different now

### Group view actually reflects the group

`RoutePicks` mirrors to Firestore at `/routePicks/{userLower}` (PR #26 /
PR-D). The `pickedByGroup` function now combines:
- Every user's Places votes (via `ALL_VOTES`)
- Every user's Routes picks (via `RoutePicks.everyoneByUser()`)
- Places-overrides-Routes inside each user (so an explicit Skip on
  Places wins over a Routes pick by the same user)

**Action item before this fully works in production:** deploy the
Firestore rule for `/routePicks/{userId}` via the Firebase console
(see PR #26 body for the exact rule block). Until then, writes silently
fail and the app falls back to localStorage-only — same UX it had
before, just without the group sync.

### Curated routes feel stable when switching options

PR-D also bundled the long-running "route behaves differently" bug fix.
`showRoute()` now sweeps every `FeatureGroup` off the map before adding
the new one — no more straggler markers or half-drawn polylines under
rapid switching. `fitBounds` runs with `animate:false` and the polyline
draw-in animation is gone (it was the third source of the visual
confusion).

### mY'sTory brand link is smarter

Clicking the brand in the top-left now uses `pickedByMe()` (effective
state) to decide. Routes picks count as "data" — not just Places votes.
When the user is already on Results, the brand click forces the
trip-story toggle to **My picks** before scrolling.

### Map and curated map labels stay clean

Main map: labels appear after a single zoom-in step (threshold 7, not 9
— the JS edit that silently dropped in PR #23 is re-applied in PR #25).
Selected dots are 25% larger so picks read at a glance even without
labels.

Curated route map: marker labels now hide by default with the same
hover/zoomed-in pattern. Default view shows just the numbered chip;
hover or zoom in reveals the city name.

### Suggestions are now count-only

Places page no longer renders individual suggestion entries. Just a
count: `N suggestions received. Names and details stay private.` The
guardrails were tightened too — min 2 chars, max 100 chars, max 2
sentence-ending punctuation marks. Beyond the upper bounds, errors
nudge users to message daiswap directly.

### Routes page copy is cleaner

The "Don't know what each place is like? Read about each one on Places."
link moved from the bottom of the activity matrix to the top
(immediately under the heading). The redundant "Tap again to remove.
The same place across rows toggles together." is dropped.

### Travel page hints at a detailed page

End of the "Getting around — distances & times" section now shows a
small `Soon · Coming next phase` note acknowledging that a more detailed
page is in the works.

---

## 2. PR history since the last log

| PR | Title | Notes |
|---|---|---|
| #23 | Fix map label overlap | Selected dots scaled +25%, zoom threshold drop (JS edit dropped silently — re-applied in #25) |
| #24 | docs: feedback log + 4 plans + routes copy reorder | Establishes feedback-log.md as the source of truth |
| #25 | PR-02 quick-fixes bundle | Re-applied #23's JS edit + curated marker labels + route cleanup + suggestions UI + guardrails |
| #26 | PR-D — RoutePicks Firestore sync | Bundled curated route stale-state fix + travel "in progress" note |
| #27 | Brand link → My picks (effective state) | Small tweak |
| #28 | this docs sync (you are here) | Reflects all of the above |

---

## 3. What's queued

See [`../next-steps/README.md`](../next-steps/README.md) — two items
remain:

- **PR-C** ([`04-curated-routes-redesign.md`](../next-steps/04-curated-routes-redesign.md))
  — replaces the 3-cards-above-map with tabs + summary + map +
  horizontal city flow. Marker-label fix in PR-02 was a patch; this is
  the real fix.
- **PR-B** ([`03-home-flow-diagram.md`](../next-steps/03-home-flow-diagram.md))
  — calligraphic flowing-curve SVG on the home page.
- **Post-PR-D:** drop the `Scroll ↓` cue arrow once PR-B fills the
  area below the hero.

---

## 4. Nothing in the constraints layer changed

The 2026-06-14 log's section 2 hard constraints (anonymity, plain
English, free tier, clean inspect view, story tone, mobile-first)
still apply verbatim. Same for the architecture, key code patterns,
and branch-per-task workflow.
