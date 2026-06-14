# Feedback log

A running record of every piece of user feedback in this codebase,
with status. Shipped items reference the PR; open items reference the
plan doc in [`next-steps/`](./next-steps/).

Newest at top. Each entry: **(date) issue → status / plan ref**.

---

## Open — queued

### Bigger PRs (each with its own plan)

| PR | Plan | One-line |
|---|---|---|
| **PR-C** | [`next-steps/04-curated-routes-redesign.md`](./next-steps/04-curated-routes-redesign.md) | Replace 3-cards-above-map with tabs + summary line + map + horizontal flow of city pills. Next up. |
| **PR-B** | [`next-steps/03-home-flow-diagram.md`](./next-steps/03-home-flow-diagram.md) | Calligraphic flowing-curve SVG on home replacing the bare hero. Option A from the brainstorm. |

### Action items (not code, no PR)

| Item | Source | Notes |
|---|---|---|
| **Deploy Firestore rule for `/routePicks/{userId}`** | PR #26 (PR-D) | Paste the rule block from PR #26 body into the Firebase console. Until deployed, RoutePicks writes silently fail and the app falls back to localStorage. The group view ("What most picked") stays local-only. |

### After PR-C / PR-B ship

| Item | Note |
|---|---|
| Drop the `Scroll ↓` cue arrow under the hero | Once PR-B fills the area below, the explicit cue is redundant. |

---

## Open — parked (don't ship)

| Idea | Status / reason |
|---|---|
| Day-by-day calendar dates ([`next-steps/01-day-by-day-dates.md`](./next-steps/01-day-by-day-dates.md)) | Plan ready. Paused until restructure (B/C/D) ships. Tile shown on Results as "Soon · Coming next phase". |
| Photos & food gallery | Tile shown on Results as "Soon · Coming next phase". Build when content exists. |
| "X days to departure" countdown | Useless until dates ship. |
| Per-user displayed names anywhere | **Rejected** — anonymity is a hard constraint. |
| Bar chart on Results | **Rejected** — removed in PR #19. The trip-story synthesis is the single answer to "what did the group decide". |

---

## Shipped

### 2026-06-15

| PR | Title | What landed |
|---|---|---|
| #18 | Phase 1 — Routes is the primary selection page | `RoutePicks` localStorage store + clickable activity matrix |
| #19 | Phase 2 — Map + Results read combined state | `effectiveVote` resolver; default tab → My picks; group tab renamed; bar chart removed |
| #20 | Map labels + curated stops read-only + Routes copy + tiles Home→Results | Bug fixes after live testing |
| #21 | PR-A — Places Optional tag + hero eyebrow + docs | "Optional · for finer control" tag; drop year from eyebrow; new session log |
| #22 | Bring back Soon tiles on Results + queue scroll-cue removal | Day-by-day + Photos tiles back as "Coming next phase" |
| #23 | Fix map label overlap | Selected dots scaled +25%, zoom threshold change (JS edit failed — see PR-25) |
| #24 | Routes copy reorder + comprehensive feedback log + plans for B/C/D | Move "Don't know what each place is like?" to top; drop the redundant "tap again" line; add this log + 4 plan files |
| #25 | PR-02 quick-fixes bundle | Re-applies #23's missed JS threshold + curated marker labels + route stale-state cleanup (initial patch) + suggestions UI count-only + suggestion guardrails with daiswap-contact overflow |
| #26 | **PR-D** — RoutePicks Firestore sync + curated route stale-state fix + travel "in progress" note | Group view now genuinely group-wide once rule deploys. Curated route switching no longer leaves stragglers. Travel page hints at a detailed page coming next phase. |
| #27 | Brand link → My picks (effective state) | mY'sTory brand-click uses `pickedByMe()` (Routes picks count) and forces My picks tab when already on Results |
| #28 (this PR) | Docs sync — feedback log + new session log + next-steps + root README | Reflects everything that shipped through PR #27 |

### Earlier (pre-restructure)

See PR list in [`session-logs/2026-06-15-restructure-shipped.md`](./session-logs/2026-06-15-restructure-shipped.md) — covers PRs 1–#17.

---

## How to use this doc

- **When new feedback comes in**: add a one-line entry under the right section. Link to a plan doc for anything non-trivial.
- **When a plan ships**: move the entry to "Shipped" with the PR number. Don't delete it.
- **When a plan is rejected**: move to "Open — parked" with the reason.
- **When the queue gets long**: review whether anything in "queued" should be parked instead.

This doc is the source of truth for "what does the user want, and where is it in the pipeline." Keep it up to date on every PR.
