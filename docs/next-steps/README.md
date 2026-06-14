# next-steps — what to build next

Each `.md` in this folder is a **ready-to-ship plan** for one feature.
They are numbered in priority order. If you're a fresh LLM picking
this up, skim [`../session-logs/`](../session-logs/) first to get the
product context, then come back here and pick the lowest-numbered
open file.

## Currently queued

Two PRs left to finish the UX restructure. PR-02 (quick fixes), PR-A,
and PR-D have shipped — see [`../feedback-log.md`](../feedback-log.md)
for the full shipped history.

| # | Branch label | One-line summary | Plan |
|---|---|---|---|
| **04 (PR-C)** | `feature/curated-routes-redesign` | Replace 3-cards-above-map with tabs + summary + map + horizontal city flow. **Next up.** | [`04-curated-routes-redesign.md`](./04-curated-routes-redesign.md) |
| **03 (PR-B)** | `feature/home-flow-diagram` | Replace the bare Home page with a calligraphic flowing-curve SVG of the trip journey. Single Plan-the-trip CTA. | [`03-home-flow-diagram.md`](./03-home-flow-diagram.md) |

## Shipped

| # | PR | Plan |
|---|---|---|
| 02 | PR #25 | [`02-quick-fixes.md`](./02-quick-fixes.md) |
| 05 (PR-D) | PR #26 | [`05-routepicks-firestore-sync.md`](./05-routepicks-firestore-sync.md) |

## Action item (not code)

Deploy the Firestore rule for `/routePicks/{userId}` — see PR #26 body
for the exact rule block. Until then, RoutePicks writes silently fail
and the group view is local-only.

Also see [`../feedback-log.md`](../feedback-log.md) for the full
chronological list of every piece of user feedback with its current
status — that doc is the source of truth for "what does the user want."

## After PR-D — small follow-ups

| Item | Note |
|---|---|
| Remove the `Scroll ↓` cue arrow under the home hero | Once PR-B's flow diagram is rendering below the hero, the explicit scroll cue is redundant. Wait until the page below the hero feels visually complete (post-D), then drop the `.scrollcue` block. |

## Held back for later

| Idea | Why parked |
|---|---|
| **01 — Day-by-day calendar dates** ([`01-day-by-day-dates.md`](./01-day-by-day-dates.md)) | Plan was ready before the restructure. Paused until B/C/D ship. **Tile already shown on Results as "Soon · Coming next phase".** |
| Photos & food gallery | Tile shown on Results as "Soon · Coming next phase". Build when there's time + content. |
| "X days to departure" countdown badge | Only useful after date feature ships. |
| Per-user displayed names on Results | Explicit user rule: anonymity is non-negotiable. |

## How to pick this up

1. Read the next numbered plan top-to-bottom (or write one if it's a
   queued PR with no plan yet — match the shape of `01-day-by-day-dates.md`).
2. Create a branch following the naming convention from past PRs
   (`feature/<short-slug>` or `tweak/<short-slug>`).
3. Apply the changes in the order the plan suggests.
4. Smoke test (the plan lists the cases).
5. Open a PR using the project's PR-body shape (`## Summary` + change
   list + `## Test plan` checklist).
6. Squash-merge, delete the branch, sync local `main`, mark the plan
   here as **Shipped** and add a dated entry under
   [`../session-logs/`](../session-logs/).

## House rule

Never ship a feature that isn't in this folder first. Plans live here;
session logs capture what landed.
