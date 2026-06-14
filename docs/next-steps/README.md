# next-steps — what to build next

Each `.md` in this folder is a **ready-to-ship plan** for one feature.
They are numbered in priority order. If you're a fresh LLM picking
this up, skim [`../session-logs/`](../session-logs/) first to get the
product context, then come back here and pick the lowest-numbered
open file.

## Currently queued

| # | Plan | One-line summary | Status |
|---|---|---|---|
| 01 | [day-by-day-dates.md](./01-day-by-day-dates.md) | Optional 6th onboarding step (start date). Trip story reads *"You'll arrive in Hanoi on Saturday, 14 August…"* when set; current "12 days…" copy when skipped. | **Plan ready, not started** |

## Held back for later

These were discussed but consciously not queued. Each has a one-liner
on why, so the rationale isn't lost.

| Idea | Why it's not queued |
|---|---|
| "X days to departure" countdown badge | Adds visual noise. Only useful once `startDate` ships; revisit then. |
| Dates rendered on the map markers | Map is for spatial sense, not schedule. Don't conflate the two views. |
| Shared **group** start-date (one date all members see) | Requires Firestore write + new rules + sync logic. Per-user date is enough for v1. |
| Per-stop date editing on the strip | The strip is a story summary, not an editor. Editing belongs in a future "day-by-day" full builder if we ever revisit v0. |
| Photos & food gallery | Tile says "Soon" on the home page. Worth a separate plan when ready. |
| Live flight prices (vs. ranges today) | Needs an external API + cost analysis. Not a code-only task. |

## How to pick this up

1. Read the numbered plan top-to-bottom.
2. Create a branch following the naming convention from past PRs
   (`feature/<short-slug>` or `tweak/<short-slug>`).
3. Apply the changes in the order the plan suggests.
4. Smoke test (the plan lists the cases).
5. Open a PR using the project's PR-body shape (see any merged PR
   for an example — usually `## Summary`, change list, `## Test plan`).
6. Squash-merge, delete the branch, sync local `main`, mark the plan
   here as **Shipped** and update [`../session-logs/`](../session-logs/)
   with a new dated entry that captures what landed.

## House rule

Never ship a feature that isn't in this folder first. If the user
asks for something new, write a short plan here, get an "OK", then
implement.
