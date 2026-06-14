# Review 05 — Information Architecture

> Lens: IA specialist. Asked: where does the feature live, what's it
> called, and what existing nav cleanup should accompany it.

## Recommended placement: after Results (position 7, final nav item)

The site's stated philosophy is *"decide together first, build later."*
The arc is: orient (Home) → understand options (Routes, Travel) →
evaluate (Places, Map) → decide (Results) → build. Plan is the
"build" step. Putting it before Results would be premature — the
builder only makes sense once votes have settled. Putting it between
Routes and Places would confuse it with curated route browsing, which
is a different job. End of the sequence is correct.

## Recommended name: "Plan"

Single word, fits the nav bar without crowding. "Itinerary" is too
formal and long on mobile. "Days" is too vague. "My plan" introduces
possessive inconsistency with every other nav label. "Trip plan" is
redundant (the whole site is a trip plan). "Plan" reads as a verb
from Routes/Results ("now plan it") and a noun on the page itself —
that double-reading is an asset.

## On the 7-nav-items question

Six items is already at the comfortable limit for a single-line nav
on a 375px viewport. The burger menu handles overflow but the
tap-target density matters. Seven is survivable because the items
are short (Home, Routes, Travel, Places, Map, Results, Plan) and
the burger pattern is already in place. The real mitigation is
what's below.

## IA cleanups that should accompany this addition

1. **"My route" overlay stays on Map.** Don't move it into Plan.
   The overlay is a spatial visualisation of votes; Plan is a
   temporal/day-by-day builder. Conflating them makes both worse.
   They can link to each other.

2. **Anonymous vote names and user-suggested places both live on
   Places, not Plan.** Anonymous names are a voting-identity feature
   (Places/Results layer). User-suggested places are additions to the
   `PLACES` dataset — they surface on Places, Map and Results
   automatically. Neither belongs on a builder page.

3. **Plan is not a tab within Results.** Results is read-only group
   output; Plan is personal, editable, and write-heavy. Tabs would
   mix two incompletely separate mental models and bury the builder
   where people won't look for it after voting ends.

4. **Routes and Plan are distinct:** Routes shows three pre-authored
   paths with fixed stops and costs, for group comparison *before*
   voting. Plan is a personal day-by-day editor that reads from your
   actual votes *after* voting. The differentiator is "authored vs.
   personalised" and "pre-vote vs. post-vote." No overlap worth
   collapsing.

5. **The two "Soon" home tiles (Photos & food, Day-by-day builder)** —
   only replace the builder tile with a live Plan link. Leave
   "Photos & food" as Soon until Phase C ships. Replacing one tile
   keeps the home grid balanced at 6 active + 1 soon rather than
   going all-active and losing the sense of roadmap.

6. **Add a "Build your plan →" footer link on Results** (pointing to
   plan.html). Routes footer can skip it — Routes is pre-vote
   browsing, not a natural funnel into a personal builder.
