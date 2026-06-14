# 01 — Day-by-day calendar dates

**Status:** Plan ready, not started.
**Estimated diff size:** ~80 lines in `app.js`, ~5 in `styles.css`.
**Single PR.**

---

## The idea in one paragraph

Add **one optional field** to the user profile: `startDate`. When set,
the trip-story sentence on the Results page reads with concrete
dates (*"You'll arrive in Hanoi on Saturday, 14 August…"*). When
skipped, the current "12 days across…" copy stays exactly as it is
today. Nobody is forced to lock a date to use the site — but the
emotional payoff is huge for groups who have.

---

## Why optional and not required

This is a planning tool. Most groups using it are still in the
"should we go?" phase, and dates may legitimately be TBC. Forcing a
date as a 6th required step would push those groups away. Instead we
mirror the existing **"Exiting via → Not sure yet"** pattern from the
Travel page: a clear opt-out that returns `null` and falls back to
date-less copy.

---

## Files to touch

| File | What changes |
|---|---|
| `app.js` | 6 small edits — see the section-by-section breakdown below |
| `styles.css` | One small block — date input + skip-button styling for the onboarding step (~5 lines) |
| Everything else | **No changes.** No HTML edits (the onboarding renders steps dynamically from `ONB_STEPS`). No Firestore rules edits (Profile is localStorage-only today). |

---

## Edit 1 — Profile validator (`app.js` ~line 245)

Find the `Profile` object literal. In `Profile.get()` (around line
253–273), after the `originCustom` line, add:

```js
if (typeof raw.startDate === "string"
    && DATE_RX.test(raw.startDate)
    && _isReasonableDate(raw.startDate)) {
  p.startDate = raw.startDate;
}
```

Also add the regex and the helper near the other constants at the
top of the same block:

```js
const DATE_RX = /^\d{4}-\d{2}-\d{2}$/;

function _isReasonableDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const max = new Date(today); max.setMonth(max.getMonth() + 24);
  return d >= today && d <= max;
}
```

**Why this shape:** ISO `YYYY-MM-DD` is what `<input type="date">`
gives you natively, sortable, and locale-neutral. The 24-month
ceiling rejects accidental years-out typos.

---

## Edit 2 — Onboarding step (`app.js` ~line 723, end of `ONB_STEPS`)

Append a 6th step to the array, after `bufferPP`:

```js
{ key:"startDate", q:"When does the trip start?",
  hint:"So your story can read 'You'll arrive on 14 August…' instead of 'Day 1'. Skip if dates aren't locked yet.",
  type:"date",
  optional:true,
  validate:v => v === "" || (DATE_RX.test(v) && _isReasonableDate(v)),
  parse:v => v === "" ? null : v,
  err:"A date between today and 2 years out, or leave blank." }
```

**Important nuance:** the existing `onbNext()` function (~line 807)
currently blocks empty input for every step. Add a single conditional:

```js
function onbNext() {
  const s = ONB_STEPS[_onbIdx];
  const v = document.getElementById("onb-input").value;
  // NEW: optional steps allow blank
  if (s.optional && v.trim() === "") {
    _onbData[s.key] = s.parse(v);
    return _advanceOnb();
  }
  // …existing validate path unchanged…
}
```

Refactor whatever was after the current `validate` check into a tiny
helper `_advanceOnb()` so both branches share the same "advance or
finish" code path. (The existing code that increments `_onbIdx`,
re-renders, and calls `Profile.set` when done.)

---

## Edit 3 — `composeStoryParagraph` (`app.js` ~line 1520)

Add a dated branch. Keep the existing non-dated branch as the
fallback. Pseudocode:

```js
function composeStoryParagraph(stops, mode) {
  const n = stops.length;
  if (n === 0) return "";

  const totalNights = stops.reduce((s, p) => s + _storyNights(p), 0);
  const cost = formatINR(_storyCostPP(stops));
  const coda = _flightCoda();
  const startISO = Profile.get().startDate;

  if (startISO) {
    return _composeDatedStory(stops, startISO, totalNights, cost) + coda;
  }

  // …existing undated body for n=1/2/3/4/5+ unchanged…
  return undatedBody + coda;
}
```

`_composeDatedStory` walks the nights forward to compute arrival and
finish dates, then renders one of these shapes:

| n | Shape |
|---|---|
| 1 | *"You'll be in **Hanoi from Saturday, 14 August to Tuesday, 16 August** — 2 nights, around ₹52,000 per person."* |
| 2 | *"You'll arrive in **Hanoi on Saturday, 14 August** and finish in **Hue on Sunday, 22 August** — 8 days, around ₹65,000 per person."* |
| 3 | *"**Hanoi (Sat 14 Aug) → Phong Nha → Hoi An (Tue 26 Aug)** — 12 days across 3 places, around ₹68,000 per person."* |
| 4+ | *"You'll start in **Hanoi on Sat 14 Aug** and end in **Hoi An on Tue 26 Aug** — 12 days, 4 places, around ₹68,000 per person."* |

Each shape preserves the bold-highlight pattern used by the existing
undated copy so the visual rhythm stays consistent.

---

## Edit 4 — Date helpers (`app.js`, place near `_storyCostPP`)

Two helpers, both pure:

```js
function _addDays(iso, n) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const _STORY_DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  weekday: "long", day: "numeric", month: "long"
});
function _formatStoryDate(iso) {
  return _STORY_DATE_FMT.format(new Date(iso + "T00:00:00"));
}
```

The `"en-IN"` locale gives *"Saturday, 14 August"* — day-month order
matching how the rest of the site reads.

**Why instantiate the formatter once at module scope:** `Intl`
formatter construction is non-trivial and the function is called
many times per render. Cheap optimisation, no downside.

---

## Edit 5 — `renderStoryStrip` (`app.js` ~line 1553)

Add a dated branch. Walk the nights forward across stops:

```js
function renderStoryStrip(stops) {
  const startISO = Profile.get().startDate;
  let cursor = startISO;
  let html = "";

  stops.forEach((p, i) => {
    const nights = _storyNights(p);

    if (cursor) {
      const end = _addDays(cursor, nights);
      const dateRange = _formatStoryDateRange(cursor, end); // "14–16 Aug"
      html += `<span class="story-chip"><b>${escapeHTML(p.name)}</b>
               &middot; ${dateRange} <span class="chip-dim">(${nights} ${nights === 1 ? "night" : "nights"})</span></span>`;
      cursor = end;
    } else {
      // existing undated chip
      html += `<span class="story-chip"><b>${escapeHTML(p.name)}</b>
               &middot; ${nights} ${nights === 1 ? "night" : "nights"}</span>`;
    }

    if (i < stops.length - 1) {
      const km = haversineKm(p.lat, p.lng, stops[i+1].lat, stops[i+1].lng);
      html += `<span class="story-leg">${Math.round(km)} km</span>`;
    }
  });
  return html;
}
```

`_formatStoryDateRange(startISO, endISO)` returns a compact
human-friendly string: if same month, *"14–16 Aug"*; if cross-month,
*"30 Aug – 2 Sep"*.

---

## Edit 6 — Styles (`styles.css`)

The onboarding `<input>` already exists. The only addition is a
small block for the optional-skip affordance:

```css
.onb-skip {
  display: inline-block;
  margin-left: 12px;
  font-size: 14px;
  color: var(--muted, #888);
  text-decoration: underline;
  cursor: pointer;
}
.story-chip .chip-dim { color: var(--muted, #888); font-weight: 500; }
```

The onboarding HTML in `renderOnbStep()` needs a "Skip — not sure yet"
link next to the input when `s.optional === true`. Same effect as
typing empty + pressing Next, but more discoverable.

---

## Test plan

Smoke-test in this order:

- [ ] **New user, with date.** Onboard from scratch, set startDate
  to today + 30 days, finish. Vote on 3 places. Open Results. Story
  reads dated. Strip chips show date ranges.
- [ ] **New user, skip date.** Same as above but press Skip on step
  6. Story reads the existing "X days…" copy. Strip chips show
  "N nights" only.
- [ ] **Existing user, edit profile.** Open `whoBtn` in the nav,
  step through to step 6, add a date, save. Results page should
  re-render dated on next visit.
- [ ] **All `n` branches.** Vote 1, 2, 3, 4, 5+ places. Each branch
  formats the dated sentence correctly.
- [ ] **Edge: past date.** Try typing 2025-01-01. Step should
  reject with the error message.
- [ ] **Edge: far future date.** Try 2030-01-01. Should reject.
- [ ] **Edge: cross-month range.** Set startDate so a 4-night Hanoi
  stay straddles August → September. Chip should read "30 Aug – 3 Sep".
- [ ] **iOS Safari.** Native date picker opens, accepts a value, no
  layout breakage. Test on iOS 17+ minimum.
- [ ] **Android Chrome.** Same.
- [ ] **Story locale format.** Sentence reads "Saturday, 14 August"
  not "8/14/2026" and not "Sat Aug 14 2026".
- [ ] **localStorage round-trip.** Refresh the page after setting a
  date. Profile.get().startDate still has the ISO string. Then
  manually edit localStorage to set startDate to an invalid value
  (e.g. `"banana"`) — Profile.get() should silently drop it.

---

## Risks and what could go wrong

1. **iOS Safari date picker variability.** Works on iOS 14+ but the
   picker UI differs by version. Mitigation: the input falls back to
   plain text when `type="date"` isn't supported; the validator still
   catches malformed input. Acceptable.

2. **`null` round-trip in localStorage.** `Profile.set` serializes
   the whole profile JSON. If we explicitly write `startDate: null`,
   then `Profile.get` reads it back as `null` and the `typeof ===
   "string"` check naturally drops it. Verified by reading the
   existing validator pattern. No code change needed.

3. **Different group members see different dates.** Each person's
   own `startDate` drives their own view. Friend A and Friend B
   could see different dated stories on their own devices. **This is
   intentional for v1.** A shared group date would require Firestore,
   write rules, and sync logic — explicitly out of scope (see
   `next-steps/README.md` "Held back for later").

4. **DST / time-zone edge cases.** Vietnam observes no DST. We use
   `Date` constructor with `"T00:00:00"` suffix (local midnight).
   Adding days via `setDate(d.getDate() + n)` handles month and year
   boundaries correctly in all JS engines. Safe.

5. **Story sentence overflow on small screens.** Dated sentence is
   longer than the undated version. Test on 360px Android widths.
   `.story-paragraph` already wraps cleanly per the existing CSS;
   no expected regressions, but include in the smoke test.

---

## Out of scope for this PR

| Item | Why deferred |
|---|---|
| "X days to departure" countdown badge | UI surface decision; revisit after dates ship and we see how they read in context. |
| Dates on map markers | Map is for spatial sense; conflating with schedule muddies both. |
| Shared **group** start-date | Needs Firestore + rules + sync. Materially larger PR. |
| Per-stop date editing on the strip | The strip is a story summary, not an editor. |
| Travel-page "lock dates early" callout becoming a live countdown | Same as item 1. |

---

## How to ship this

1. `git checkout -b feature/day-by-day-dates`
2. Make Edits 1–6 above.
3. Run the smoke test on `http://localhost:8765`
   (`python3 -m http.server 8765` from repo root).
4. Test on a real iPhone and Android (at minimum: open the URL on
   your phone, run through new-user onboarding with a date, vote 3
   places, open Results).
5. Commit. Per project policy: **no `Co-Authored-By` trailer**
   unless this turns into a much bigger change than planned.
6. Push, open PR with the standard structure (`## Summary`, file
   changes, `## Test plan` checklist), squash-merge,
   `--delete-branch`, pull `main`, mark this plan **Shipped** in
   `next-steps/README.md`, write a new entry in `session-logs/`.

---

## Why this fits the product

The whole site's tagline is **"chooses like a story, reads back as
a story."** Dates are the difference between *"a 12-day trip"* (a
hypothetical) and *"you'll arrive in Hanoi on Saturday, 14 August"*
(a real plan). Shipping this turns the synthesis paragraph from a
verdict into an invitation.
