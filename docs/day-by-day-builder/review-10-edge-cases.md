# Review 10 — Edge Cases / Failure Modes

> Lens: senior engineer specialising in failure modes. Asked to predict
> 20 ways the v0 plan will break and the symptom each produces.

For each scenario: predicted failure + user-visible symptom +
mitigation.

**1. User opens plan.html before voting on anything.**
Builder reads `myVotes()` → empty object. `PLACES.filter(p =>
mv[p.id]==="yes"||...==="maybe")` returns `[]`. Symptom: blank plan
with no explanation. Mitigation: render an empty-state CTA linking
to map / places.

**2. Exactly 1 Yes vote.**
One-place itinerary renders but transport legs between stops can't
fire — there is no "to" stop. Any `TRANSPORT_LEGS[a][b]` lookup
silently returns `undefined`. Symptom: missing travel info, possible
crash. Mitigation: guard on `picked.length < 2`; show single-stop
plan with a *"you need at least 2 stops"* nudge.

**3. 0 Yes, 5 Maybe.**
If the builder includes Maybe places, same as above but the user
never explicitly committed. Symptom: a "tentative" plan rendered as
final — user confusion. Mitigation: clearly badge Maybe-sourced rows;
don't mix them into hard cost totals.

**4. 12 Yes votes (everything).**
`picked.sort()` produces a 12-stop plan with likely absurd day counts
(default 2 nights × 12 = 24-day trip). No total-days overflow guard.
Symptom: *"your trip is 28 days"* with no warning. Mitigation: cap or
warn when total nights exceed a configurable max (e.g. 21).

**5. No Profile (direct link).**
`Profile.isComplete()` returns false → `openOnboarding()` fires,
blocking plan.html. BUT plan.html must also boot `initPlan()` which
reads `Profile.get().groupSize` for *"easy-rider for {n}"* text —
returns `{}`, `groupSize` is `undefined`, `applyProfileTokens` falls
back to *"the group"*. Cost-per-person totals divide by `undefined`
→ `NaN` rendered as *"₹NaN"*. Mitigation: treat onboarding as
prerequisite before rendering plan, OR guard every numeric use with
`|| 1`.

**6. groupSize = 1.**
*"easy-rider for {n} of you"* → *"easy-rider for 1 of you"* —
grammatically wrong. Nav shows *"1p"* which is fine, but the copy
grates. Mitigation: add a singular branch in `applyProfileTokens`:
`n === 1 ? "just you" : "${n} of you"`.

**7. budgetPP = 0 or huge.**
`budgetPP = 0` passes validation in places (`>= 0`) but the
onboarding step requires `> 0`. A developer setting it to 0 via
DevTools / direct `Profile.set` gets through. `formatINR(0)` renders
*"₹0"* — visually odd. `budgetFit(cost)` with `budgetPP = 0` marks
every route "over budget". Absurdly high values produce very long
strings. Mitigation: clamp display; `budgetFit` is already guarded.

**8. Firestore updates mid-edit.**
`TripVotes.subscribe` fires `applyVoteUI()` on every snapshot. If
plan.html wires into the same callback and re-renders the plan, all
in-progress edits (reorders, night counts) are silently overwritten
by a remote revote. Symptom: drag-drop changes vanish. Mitigation:
separate plan state from live-vote state; only offer a manual
"Refresh from votes" button.

**9. Revote while mid-edit (same user).**
Same as #8 but self-inflicted. User flips a place to "skip" on
map.html (same tab or different) — `ALL_VOTES` updates,
`applyVoteUI` fires. If plan re-renders on every `applyVoteUI`, the
removed place disappears mid-edit with no undo. Mitigation: snapshot
votes into plan localStorage at "Generate" time; make the plan
independent of live `ALL_VOTES`.

**10. localStorage write fails (quota / privacy mode).**
`_setLocal` wraps in `try/catch` and calls `Log.error` — silently
swallows. Symptom: user edits the plan, closes tab, reopens — plan
is gone. No UI feedback. Mitigation: after every plan save, verify
the write succeeded (read back and compare); show a persistent
banner if storage is unavailable.

**11. Offline mid-edit.**
Plan data is entirely local. Editing while offline works fine if it
was already loaded. Firebase listener throws; already logged.
Symptom: no group-vote updates, but the plan stays editable. The
graceful path — but the user sees no "offline" indicator.
Mitigation: show an *"Offline — changes saved locally"* badge.

**12. Two tabs open.**
Tab A edits the plan → `localStorage.setItem("tripPlan", ...)`.
Tab B's `window.addEventListener("storage", ...)` fires if wired
(the current `_lk` handler in TripVotes does this for votes, but
there's no analogous plan listener). Symptom: the two tabs diverge
silently — whichever tab closes last wins. Mitigation: listen for
`storage` events on the plan key and prompt *"Plan was updated in
another tab — reload?"*.

**13. User clears localStorage on the page.**
`localStorage.clear()` removes `tripPlan`. Plan re-read returns
`null`. If `initPlan` only reads on load and doesn't subscribe to
storage events, the rendered DOM is now stale but shows no sign of
it. Symptom: stale plan visible, any save overwrites with good data
— actually recoverable, but confusing. Mitigation: subscribe to
`storage` events; detect the key removal and show a "Plan cleared"
empty state.

**14. Stale place IDs in stored plan.**
Developer removes `"danang"` from `PLACES`. Stored plan has
`{ id:"danang", nights:2 }`. `byId("danang")` returns `undefined`.
If the renderer does `byId(s.id).name` it throws immediately →
entire plan fails to render. The existing `initRoutes` code already
guards with `if(!p) return` — plan.html must replicate this.
Mitigation: filter out unresolved IDs on load and warn the user
(*"1 place was removed from the trip data and has been dropped from
your plan"*).

**15. Missing TRANSPORT_LEGS entry.**
No `TRANSPORT_LEGS` table exists yet — it would be new code. If a
plan is built assuming every adjacent pair has a defined route, a
lookup for an undefined pair (`TRANSPORT_LEGS["hagiang"]["quynhon"]`)
returns `undefined`. Symptom: transport card renders blank or
*"undefined km, undefined hrs"*. Mitigation: always provide a
fallback (*"no direct route — check manually"*) and compute
straight-line distance via the existing `haversineKm` as a floor.

**16. ▲ ▼ at boundary positions.**
Standard naïve array-swap implementations do `arr[i]` and
`arr[i-1]` without a bounds check. At index 0, pressing ▲ does
`arr[-1]` → `undefined`, potentially splicing `undefined` into the
plan. At last position, ▼ does a no-op only if guarded. Mitigation:
disable the ▲ button when `i === 0` and ▼ when
`i === arr.length - 1` via `disabled`; also add a guard in the
handler.

**17. Removing the last place.**
`filtered = plan.filter(p => p.id !== id)` → `[]`. If the renderer
has no empty-state guard it renders an empty container. Cost /
nights totals become 0 / NaN. Symptom: blank plan, possibly *"₹NaN"*
totals floating in a header. Mitigation: detect `plan.length === 0`
and show the empty-state CTA.

**18. Rendering throws.**
No `try / catch` around `initPlan` in the boot sequence (mirroring
how `initMap`, `initPlaces`, etc. are called). An uncaught exception
in a template literal (e.g. `byId(id).name` when `id` is stale) will
silence the entire page — grey screen. `Log.error` is never reached.
Mitigation: wrap `initPlan()` in `try { initPlan(); } catch(e) {
Log.error("plan", "render failed", e); /* show error banner */ }`.

**19. iOS Safari with content blockers.**
Firebase SDK loaded from `gstatic.com` is frequently blocked by
aggressive content blockers (1Blocker, AdGuard). `FB_READY` becomes
false → `TripVotes.live = false`. The plan falls back to
localStorage correctly. BUT `injectChrome()` still injects the
onboarding modal which reads `Profile.get()` — that works fine. The
plan itself is fully localStorage-based, so it survives. The only
symptom is the nav tally won't reflect other group members' votes.
Mitigation: already handled by the fallback; add a subtle
*"sharing disabled"* badge when `!TripVotes.live`.

**20. Print dialog opened mid-edit.**
`document.body.style.overflow = "hidden"` is set by `openSheet`. If
the print dialog is triggered while a sheet (or onboarding) is open,
the scrim remains visible in the print preview and `overflow:hidden`
prevents page-height from being calculated correctly. The print
stylesheet (not yet written) would need to `display:none` the scrim/
sheet and reset `overflow`. Mitigation: in the print stylesheet add
`.scrim, .onb-wrap, .sheet { display:none !important; }` and
`body { overflow:visible !important; }`.
