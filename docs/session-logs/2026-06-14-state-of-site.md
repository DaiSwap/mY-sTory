# State of the site — 2026-06-14

**TL;DR**: After 11 merged PRs, the site is **feature-complete for the
core trip-planning loop** (Routes → Travel → Places → Map → Results
with anonymous voting and a live trip-story synthesis). Copy was just
tightened across all pages. The next queued feature is **optional
`startDate` in onboarding** so the trip story can read with concrete
dates. See [`../next-steps/01-day-by-day-dates.md`](../next-steps/01-day-by-day-dates.md).

If you're a fresh LLM picking this up: read this whole doc once
(takes ~5 min), then jump to [`../next-steps/`](../next-steps/) and
pick a plan.

---

## 1. What this product is

**mY'sTory** is a family group trip-planning website. The first trip
planned with it is to Vietnam.

**The premise in one sentence:** the site **chooses like a story**
(an onboarding + voting flow that feels like answering plain
questions) and **reads back as a story** (a single paragraph that
narrates the trip the group ended up with).

**Live URL:** https://daiswap.github.io/mY-sTory/
(hosted on the `DaiSwap` personal GitHub account)

**Repo:** https://github.com/DaiSwap/mY-sTory

The whole arc is **explore → decide together → see the trip you
chose**. The nav order reflects it: Home → Routes → Travel → Places
→ Map → Results.

---

## 2. Hard constraints — never violate

These are durable user-stated boundaries. They have come up across
multiple sessions and are non-negotiable.

### 2.1 Anonymity
- **Voter names are never shown publicly anywhere on the site.**
  Each user sees their own name on their own device only. The group
  sees totals — *"3 yes, 2 maybe, 1 skip"* — never *"Pranav voted
  yes"*.
- This applies to: Results page, place suggestions, the map's "My
  route" overlay (only the current user's picks are coloured;
  others' picks don't appear at all in any per-place view).
- User quote on file: *"i do not want others names to come up on
  the site anywhere, in results place and stuff"*.

### 2.2 Plain English, all-ages
- No jargon, no abbreviations, no technical terms in user-facing
  copy. Examples that ARE fine: "Yes / Maybe / Skip", "₹68,000 per
  person". Examples that ARE NOT fine: "ELO score", "tier",
  "data-page", anything that needs explanation.
- The product is for a family that includes non-technical members.
  Default to writing copy a non-technical 62-year-old can scan and
  understand.

### 2.3 Cost
- Must be **free to operate** at family scale. Cloud Firestore on
  the free Spark tier; never trip into paid territory. GitHub Pages
  for hosting (free).

### 2.4 Clean inspect-view
- The user doesn't want people poking around with browser dev
  tools to find debug logs, internal state, or anything fragile.
- All `console` logging goes through a `Log` helper that gates by
  hostname (only logs on `localhost`).
- No leftover dev banners, dev mode toggles, or "Local mode" UI in
  production.

### 2.5 Story-frame copy
- Headlines and subheads are written in a story voice ("Let's plan
  it together.", "Most selected so far.", "You'll arrive in Hanoi
  on…"). Don't strip them into telegraphic CMS-style labels.
- The story disclaimer line — *"A rough first draft — verify
  before booking."* — stays. It anchors expectations.

### 2.6 Mobile-first
- Test on Android Chrome and iOS Safari at 360–414px widths.
- Don't add features that only work nicely on desktop.

---

## 3. Architecture in 30 seconds

```
Plain HTML / CSS / JS — no framework, no bundler, no build step.

index.html      Home (hero + 7 tiles, 5 live + 2 "Soon")
routes.html     Activities matrix + 3 curated routes on map +
                climate by region
travel.html     Flights from India + visa + transit times
places.html     Compare grid + crowd×activity chart + voting +
                "Got a place we missed?" suggestion form
map.html        Leaflet satellite map of every place + "My route"
                overlay (your yes/maybe picks connected, with km)
results.html    Live bar chart of votes + trip-story synthesis block

styles.css      Single shared stylesheet
app.js          Everything dynamic — see section 4 for landmarks

Hosting:        GitHub Pages on DaiSwap personal account
Sync:           Cloud Firestore (free Spark tier) for votes +
                suggestions. localStorage fallback when Firebase
                isn't reachable.
Maps:           Leaflet + Esri World Imagery / OpenStreetMap tiles
```

**Why so plain:** this is a planning aid, not a portfolio piece.
Every addition should make the *story* clearer, not the codebase.

---

## 4. `app.js` landmarks

`app.js` is a single ~1700-line file. Major sections in roughly the
order they appear:

| Approx line | Section | What's there |
|---|---|---|
| 1–80 | `PLACES` array | Every shortlisted place. Each has `id`, `name`, `lat`, `lng`, `tier` (used for default night counts), short description, etc. |
| 80–230 | `ROUTES` array + utilities | Three curated routes; each has `stops` (an ordered array referencing place IDs). |
| 230–290 | `Profile` module + constants | `NAME_RX`, `CITY_RX`, `VALID_ORIGINS`, `VALID_EXITS`, `ORIGIN_LABEL`, `EXIT_LABEL`. The `Profile` object exposes `get()`, `set()`, `isComplete()`. |
| 290–470 | `TripVotes` module | Vote / suggestion sync with Firestore. localStorage fallback. `sanitiseVote()` drops anything that doesn't match the strict shape on every read. |
| 470–650 | Place rendering (grid + chart) | `buildChart`, vote-button binding, `renderGrid`. |
| 650–830 | Onboarding | `ONB_STEPS` array (currently 5 steps; the dates plan adds a 6th). `openOnboarding`, `closeOnboarding`, `renderOnbStep`, `onbNext`. |
| 830–1080 | Map page | Leaflet init, markers, "My route" overlay (`renderMyRoute`), legend. |
| 1080–1280 | Routes page | Activity matrix, route picker, climate matrix. |
| 1280–1500 | Results page | Bar chart, voter count, story-toggle (Group / My picks). |
| 1500–1670 | **Trip-story synthesis** | `_storyNights`, `_storyCostPP`, `_flightCoda`, `composeStoryParagraph`, `renderStoryStrip`, `renderTripStory`. This is the block the dates plan extends. |
| 1670–end | Boot + page-init dispatch | `initHome`, `initRoutes`, `initTravel`, `initPlaces`, `initMap`, `initResults`. |

If a line number is off by ~20 don't worry — the file evolves. Use
`grep` to find the exact landmark.

---

## 5. Profile schema (current)

Stored in `localStorage` under one key, JSON-serialized.

| Field | Required | Type | Validator |
|---|---|---|---|
| `name` | ✅ | string | `NAME_RX = /^[\p{L}\p{N} .'\-]{1,24}$/u` |
| `age` | ✅ | integer | 13–99 |
| `groupSize` | ✅ | integer | 1–20 |
| `budgetPP` | ✅ | integer (₹) | 1–5,000,000 |
| `bufferPP` | ✅ | integer (₹) | 0–5,000,000 |
| `origin` | optional | enum | `BLR \| DEL \| BOM \| CCU \| MAA \| OTHER` |
| `exit` | optional | enum | `HAN \| DAD \| SGN \| OPEN` |
| `originCustom` | optional (only when `origin === "OTHER"`) | string | `CITY_RX = /^[\p{L}\p{N} .,'\-()]{1,40}$/u` |
| `startDate` | **planned** | ISO `YYYY-MM-DD` string | today ≤ d ≤ today+24 months |

Validator pattern (read `Profile.get()` around line 245):
**unknown / invalid fields are silently dropped** on read, not
errored. This is by design — the schema can evolve forward without
breaking existing localStorage data.

---

## 6. Key code patterns to follow

### 6.1 `escapeHTML` everywhere user data is rendered
Defence-in-depth against stored XSS. Even though Firestore rules
reject malformed writes, every user-supplied value is run through
`escapeHTML(...)` before going into `innerHTML`. See line ~700 for
the `name` example, line ~1500 for `composeStoryParagraph`.

### 6.2 `sanitiseVote` on every Firestore read
Never trust a remote document. The function asserts the exact field
shape and drops anything weird. Add the same pattern for any new
Firestore-read code.

### 6.3 `Log` helper, not raw `console`
`Log.warn`, `Log.info`, etc. gate output by hostname. Production
inspect view stays clean. **Do not use `console.log` directly.**

### 6.4 `Profile.get()` returns a typed object, not the raw blob
Always go through `Profile.get()`. Reading `localStorage` directly
in feature code skips the validation step.

### 6.5 Page-init dispatch via `data-page` body attribute
Each HTML page has `<body data-page="...">`. The boot code reads it
and calls the right `initX()`. When adding a new page (rare), follow
this pattern.

### 6.6 Reveal animations via `.reveal` class
Elements with `class="reveal"` fade/slide in on scroll. Don't fight
this — add the class to new top-level blocks. The animation lives
in `styles.css` and CSS handles the timing.

---

## 7. The branch-per-task workflow

Every change ships through this loop:

1. `git checkout -b <type>/<short-slug>` — types so far: `feature/`,
   `tweak/`, `docs/`, `fix/`.
2. Make the changes.
3. Smoke-test locally (`python3 -m http.server 8765`, open
   `http://localhost:8765`).
4. Commit. Format:
   - **Big / complex code changes:** include
     `Co-Authored-By: Claude <noreply@anthropic.com>` trailer.
   - **Small / docs / copy / single-file tweaks:** no trailer.
5. `git push -u origin <branch>`.
6. `gh pr create --title "..." --body "..."` with the standard PR
   body (`## Summary` bullets + `## Test plan` checklist).
7. `gh pr merge <num> --squash --delete-branch`.
8. `git checkout main && git pull --ff-only origin main`.
9. If the change is material, write a new
   `docs/session-logs/<date>-...md` entry.

---

## 8. Decisions made — why we chose X over Y

This is the section that's most expensive to recover from git
history. Read it before "fixing" something that looks weird — it
might be intentional.

### 8.1 Brand name
- Started as **"Vietnam '26"**. User said it looked unprofessional.
- Renamed to **"mY'sTory"**. The capitalisation is deliberate
  (My + Story). The site title is *"plan our Vietnam trip together"*.
- The `Vietnam '26 · dates to confirm` eyebrow on the home page
  hero is **kept on purpose** as trip context, separate from the
  product brand.

### 8.2 Day-by-day builder
- An original v0 plan (see `../day-by-day-builder/plan-v0.md`)
  proposed a full drag-and-drop itinerary editor.
- 10 specialist reviewers critiqued it; reviews 01–10 are in that
  folder.
- The headline finding: **the verdict matters more than the
  timeline**. Users care about *"will this trip work for us?"* not
  *"can I rearrange day 7?"*.
- Outcome: v0 was rewritten into a much smaller **synthesis block**
  on the Results page — one paragraph + a horizontal strip of
  stop chips. This shipped.
- The full v0 / v1 / reviews are preserved in
  `../day-by-day-builder/` as a record of the reasoning, not a TODO.

### 8.3 Hero animation
- Initial hero had `opacity:0` set by JS, faded in via `requestAnimationFrame`.
  On some devices the JS never fired and the hero stayed invisible.
- Replaced with pure CSS animation using `animation: ... both` fill
  mode so the end state survives regardless of JS state.

### 8.4 Vote-count chips removed
- The bar chart originally had `✓3 ~2 ✕1` chips next to each place.
- User said this was noise. Removed. Each bar now just shows a name
  and a length.

### 8.5 Trip-story block position
- Originally rendered **below** the bar chart on Results.
- User said the hero/story is the moment of delight and should be
  the first thing seen. Moved to **above** the bar chart.

### 8.6 "Group's trip" → "Most selected"
- The trip-story toggle originally said "Group's trip" / "My picks".
- User said "Group's trip" was the wrong framing — it implies a
  decision has been made. Renamed to "Most selected" — descriptive,
  not prescriptive.

### 8.7 No `CLAUDE.md` in the repo
- User asked for the `CLAUDE.md` (which had Claude-specific
  context) to be removed from the public repo.
- It was removed. **Do not recreate it.** The session-logs in this
  folder serve the same purpose now.
- Important commit-message rule from the user: when removing
  Claude-related files or references, **do not mention "removing
  Claude" in the commit message**. Use a neutral message describing
  the actual change (e.g. *"clean up dev notes"*).

### 8.8 Co-Authored-By policy
- User said: *"you can keep claude co-author for very big complex
  code changes, else do not keep"*.
- Practical rule: include the trailer when the change spans
  multiple files / introduces real logic / required research.
  Skip it for copy edits, single-file tweaks, docs, renames.

### 8.9 Anonymous voting — never display names
- See section 2.1 above. The user has reiterated this multiple
  times. Anywhere you're tempted to render a name, ask whether the
  user's *own* device or the *group view* — only the former gets
  a name.

### 8.10 Firebase security posture
- Firestore rules use a strict field whitelist + regex + length
  validation per field.
- Firebase HTTP referrer restriction is set to
  `daiswap.github.io/*` and `daiswap.github.io/mY-sTory/*`.
- API restrictions are at default 25 — the user is comfortable
  with the HTTP referrer as the primary boundary.
- `escapeHTML`, `sanitiseVote`, and `Profile.get`'s drop-on-invalid
  pattern provide defence in depth.

### 8.11 GitHub Pages and the rename
- The repo was renamed from `vietnam-trip` to `mY-sTory`. GitHub
  Pages doesn't auto-redirect after a rename. The README was
  updated to the new URL. Both the old and new origins are in the
  Firebase HTTP referrer whitelist.

---

## 9. PR history

| PR | Title | What it did |
|---|---|---|
| 1 | Initial deploy | First GitHub Pages push from the unzipped local files |
| 2 | Firebase wiring | Firestore project, config, vote sync, suggestion sync |
| 3 | Story-first onboarding | The 5-step `ONB_STEPS` flow + Profile module |
| 4 | Animation pass | Reveal-on-scroll, hero polish, button states |
| 5 | Routes page rebuild | Activity matrix moved here from Travel; 3 curated routes; climate matrix |
| 6 | Places + suggestions | Compare grid, crowd×activity chart, anonymous "Got a place we missed?" form |
| 7 | Map + My-route overlay | Leaflet satellite, markers coloured by vote, line through user's picks with km |
| 8 | Results + trip-story v1 | Live bar chart, voter count, synthesis paragraph + strip, Group/My picks toggle |
| 9 | Brand & layout cleanup | "mY'sTory" rename, hero animation rewrite, story block moved above chart, "Most selected" rename, vote-chip removal |
| 10 | Chennai + custom city | MAA added to flying-in-from radios; "Other…" reveals free-text input with `CITY_RX` validation |
| 11 | Copy consolidation | 5-reviewer audit → 13-line tightening across all pages |

The next PR will be **`feature/day-by-day-dates`** — see
[`../next-steps/01-day-by-day-dates.md`](../next-steps/01-day-by-day-dates.md).

---

## 10. Things explicitly NOT to do

A negative list, because it's faster to enumerate than to discover
the hard way.

1. **Don't show voter names publicly.** See 2.1.
2. **Don't add tracking / analytics.** Not requested, not wanted.
3. **Don't introduce a build step or framework.** Plain HTML / CSS
   / JS is a deliberate choice. The README says so explicitly.
4. **Don't run `console.log` directly.** Use the `Log` helper.
5. **Don't add a "Local mode" banner, dev-mode toggle, or any
   visible debug UI.** The user has called these out as clutter.
6. **Don't write a `CLAUDE.md` or anything mentioning "Claude" in
   the public repo.** Session logs in this folder are the home for
   that context.
7. **Don't commit messages mentioning "removing Claude" when
   removing Claude references.** Use a neutral message.
8. **Don't suggest features that need paid Firestore tier or paid
   external APIs.** Hard cost ceiling.
9. **Don't shorten copy into telegraphic robot voice.** The story
   tone is part of the product. The recent copy-consolidation PR
   trimmed, didn't strip.
10. **Don't add backwards-compat shims** (renamed `_var` exports,
    deprecation wrappers, etc.). If something is unused, delete it.
11. **Don't ship without a smoke test on mobile.** At minimum:
    open the URL on a real phone, run the new flow once.
12. **Don't open a PR without a `## Summary` and `## Test plan`
    section.** Match the shape of recent merged PRs.
13. **Don't ask the user about details that are already settled
    in this folder.** Read the docs first.

---

## 11. What's queued next

See [`../next-steps/README.md`](../next-steps/README.md). At the
time of this log, exactly one feature is queued:

- **01 — Day-by-day calendar dates.** Optional 6th onboarding step.
  Trip story reads with concrete dates when set. See plan for the
  full breakdown.

After that ships, write a new dated entry in this folder and
update the queued list.
