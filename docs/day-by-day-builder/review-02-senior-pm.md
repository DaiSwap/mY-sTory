# Review 02 — Senior Product Manager

> Lens: senior PM (Stripe / Linear / Vercel calibre). Asked to focus on
> MVP scope, sequencing, and the single metric the feature should move.

## Findings

**1. Is v1 actually MVP or already feature-creep?**
It is creep. Auto-generate + editable nights + reorder + remove + cost
model + print stylesheet in one ship is four separate features. True
week-1 MVP is: read my Yes votes, list them north-to-south with
tier-default nights, show a rough total. That is it. Editing,
reordering, and the print stylesheet are week 4.

**2. Which deferred item will users complain about most?**
Calendar dates. Numbered days ("Day 1, Day 2…") without anchoring to
an actual window is almost useless for coordination — users will
immediately ask *"but when ARE we going?"* The trip window being TBD
blocks the whole feature's emotional payoff. This is the loudest
missing piece, not drag-drop or PDF.

**3. Personal plan vs. group plan — which first?**
The site's entire thesis is collective decision-making. A personal
itinerary is architecturally incoherent as v1. The natural completion
of the voting funnel is: *"Here is the plan the group converged on."*
Ship one read-only group plan derived from the Results tally (places
where yes-score is above some threshold, ordered north-to-south).
Personal tweaks — change my nights, drop a place — are a natural v2
layer on top.

**4. Does auto-generate from 4–5 votes look sad?**
Yes. With 12 places in the dataset and a typical voter clicking Yes
on 4–5, the generated plan covers maybe 10–12 days, skipping obvious
connective tissue. The group-plan approach actually saves this:
aggregate Yes+Maybe across all 7 family members and the threshold
likely produces 7–9 places, which fills a real itinerary.
Personal-only plans will frequently look thin and discouraging.

**5. How brittle is the cost model?**
Very brittle. Five hardcoded rupee figures for a trip where
accommodation in Ha Giang (homestay ₹800/person) and Hoi An (beach
resort ₹4,000/person) differ by 5×. The right level of credibility:
one "rough range" band per tier (e.g. *budget / mid / splurge*
toggles the multiplier), clearly labelled "our estimate, not a
quote." Showing a single precise number like ₹2,34,500 will erode
trust the moment someone checks a real hotel.

**6. Where in the funnel does plan.html sit?**
Definitively at the end — after Results. The flow should be: vote →
see results → "see your itinerary." Placing it before Places (as a
goal that votes feed into) is theoretically appealing but would
require explaining the system before anyone has context. End of
funnel is correct.

**7. Sequencing — which ships first among plan.html, user-suggested
places, and anonymised vote names?**
**Anonymise vote names first.** It costs almost nothing (a
display-name hash or "Member 1/2/3" toggle) and it unblocks real
voting behaviour — family members are currently self-conscious about
their votes being visible by name. That is a voting-funnel fix, not
a new feature. **User-suggested places second:** it enriches the
dataset that the itinerary builder depends on. **plan.html third,**
and only after the group plan framing is decided.

**8. Single metric this feature should move?**
**Session completion rate** — the share of users who land on Results
and also generate (or view) a plan. Right now the funnel ends at
Results with no next action. A "Build the plan" CTA on Results page
is the conversion event worth measuring.

## Recommendation — the actual MVP

Ship a **read-only group itinerary view** — call it `plan.html` —
that takes every place with a combined group score above a simple
threshold (e.g. 2+ yes-votes), sorts them north-to-south using the
existing region ordering already implied by `PLACES`, applies
tier-based default nights (already in the plan), and renders a
numbered-day timeline with a single "rough budget band" (low / mid /
high toggle, no fake precision).

Surface it as a prominent CTA on `results.html`: *"See the group's
itinerary."* No editing, no personal plan, no print stylesheet in v1.
This is ~150 lines of new JS and one thin HTML page with no new
dependencies — fully consistent with the no-framework philosophy.

Before shipping this, spend 30 minutes on **vote-name anonymisation**
so people actually vote honestly, because the group plan is only as
good as the group's real votes.
