# Review 01 — Product Design

> Lens: senior product designer (Apple HI / Linear / Notion calibre).
> Asked to focus on mental model, moment of delight, and where real users
> get stuck.

## Findings

1. **Mental model fails in 3 seconds.** "Day-by-day builder" reads like
   a spreadsheet task, not a payoff. The user arriving here has
   already voted and explored routes — they expect resolution, not
   another tool to operate. The page name should communicate the
   output ("Your Trip Plan"), not the mechanism.

2. **Auto-generate is the right default, but the framing is wrong.**
   Don't call it a "draft." Call it "your plan" immediately and let
   the user discover it's editable. Calling it a draft signals
   incompleteness and invites anxiety. Linear does this well — it
   shows you a real artifact, not a wireframe of one.

3. **14-day vertical scroll is a real problem you've underestimated.**
   Each day-card with transport + accommodation + 2–4 activities +
   costs is 150–200 px minimum. Days 1–14 is a 2,500 px page before
   any padding. The delight evaporates around Day 4. Fix: a
   horizontally scrollable day-strip at the top (like a week calendar
   header) that anchors to each card. Cost: ~30 lines of CSS.

4. **The "moment of delight" is not the timeline — it's the budget
   number.** The first time someone sees "14 days Vietnam,
   ₹68,000/person" is the moment this becomes real. That number
   should be the hero of the page, above the fold, before they scroll
   into any cards. You've buried the most emotionally resonant output
   at the bottom.

5. **Daily cost breakdown: hide it by default, behind a chevron.**
   The per-day card already has location, activities, and transport
   to process. Adding ₹2,400 accommodation + ₹600 food + ₹850
   activities as visible line items turns a travel plan into an
   accountant's ledger. Show just the day total; let curious users
   expand.

6. **The north→south auto-ordering will produce wrong routes for the
   actual data.** Ha Giang (lat 22.8) → Sapa (22.3) → Hanoi (21.0)
   → Pu Luong (20.4) → Ninh Binh (20.2) → Cat Ba (20.7). Cat Ba
   breaks the monotonic sort. The existing ROUTES data should be the
   ordering backbone, not raw latitude.

7. **"Nights by tier" defaults are arbitrary and will feel wrong
   immediately.** A Top-pick getting 3 nights might be correct for
   Ha Giang but absurd for Hoi An. This will be the first thing every
   user manually corrects, which means it's generating noise, not
   signal. Default to 2 nights everywhere and let the tier surface as
   a recommendation chip ("Most families spend 3+ nights here").

8. **Missing: the "why" behind each day.** TripIt and Wanderlog both
   show a contextual note per leg — why you're spending 2 days vs 1,
   what the logic is. Without this, the auto-generated plan feels
   arbitrary. One line of copy per place ("Best base for the Ha Giang
   loop — needs 3 days minimum") would do it; we already have this in
   `PLACES.when`.

9. **"Day-by-day builder" is the wrong name.** It describes
   construction, not the result. Better options in order of
   preference: **"My Trip"** (honest, personal, matches the existing
   "My route" naming on the map page), **"Trip Plan"** (clear), or
   **"Itinerary"** (universally understood). "Days" is too bare.
   Consistency with the existing "My route" pattern argues for
   "My Trip."

10. **Premature: the Haversine × 1.3 transport fallback.** The ROUTES
    array with ordered stops already exists. Build the transport
    lookup table for those ~10 legs only and hardcode them. That
    covers 90% of real use. The fallback calculation gives false
    precision for cases that won't occur — a family isn't
    auto-generating a plan with random latitude pairs.

## Single direction change

**Reframe the entire page around one output — the total budget number
— rather than the timeline construction.** Lead with *"Your Vietnam
trip: 12 days, ₹74,000/person."* Make the day cards the supporting
detail beneath that headline. This shifts the mental model from
"builder tool" to "your plan is ready" and moves the moment of delight
above the fold where it lands immediately.
