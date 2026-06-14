# Review 09 — Travel Domain Expert

> Lens: senior Vietnam-destination travel advisor. Asked to assess
> realism of the auto-generator's geographic, transport, time and cost
> assumptions.

## Findings

**1. North-to-south by latitude mostly works, but Ha Giang breaks
it.** Ha Giang (lat 22.82) sorts above Sapa (22.33) and both sort
above Hanoi (21.02), so the auto-generator would route: *Hanoi →
Ha Giang → Sapa → Ninh Binh → …* That is **backwards operationally**.
You fly into Hanoi, then the generator sends you 300 km north to
Ha Giang, then 200 km southwest to Sapa, then back south past Hanoi
to Ninh Binh. Sapa also requires a separate 5–6 hr leg from Ha Giang
(no direct road; you backtrack through Lao Cai). Latitude alone
cannot model this — the curated ROUTES in `app.js` already prove
this: every route visits Ha Giang without stopping in Sapa, and none
sequences them consecutively.

**2. Tier-based nights are too blunt in two specific cases.**
- **Ha Giang at 3 nights (tier 1) is the most dangerous under-count
  in the list.** The loop is 320–350 km of mountain road. Done
  properly — not rushing — it takes 3 full riding days plus arrival
  and departure nights, meaning **4 nights at minimum, 5 if you
  want to slow down** at Dong Van market or include the Nho Que
  boat. A generator outputting "3 nights Ha Giang" produces an
  itinerary that physically cannot be completed without skipping
  the loop's best sections.
- **Hue at 1 night (tier 3) is the other pressure point:** the
  Hai Van Pass drive, the citadel, a Perfume River boat, and the
  Lang Co stop cannot be squeezed into a single day without one of
  them being a taxi-through. Two nights is the honest minimum.

**3. The Haversine × 1.3 at 60 km/h fallback is the single biggest
unrealistic assumption in the plan.** The Ha Giang loop is the
clearest proof. Hanoi to Ha Giang city is ~300 km straight-line,
approximately 390 km by road — that puts the fallback at 6.5 hours.
Actual time: **7–8 hours** on a good day by sleeper bus, **closer to
9–10 by private car** because the last 100 km climbs into mountains
with hairpin passes. The loop itself (Dong Van circuit) averages
25–35 km/h on a motorbike due to road surface, not 60. Any mountain
leg in the north — Pu Luong to Ha Giang, Sapa to anywhere — will be
underestimated by **40–60%**.

**4. The "fly if over 6 hrs by road" rule from travel.html needs to
be baked into the generator, not just documented.** Hanoi → Phong
Nha by road is ~500 km, roughly 9–10 hours. The Haversine fallback
outputs ~10.8 hrs (384 km × 1.3 / 60), which technically triggers
the threshold — but only if the generator actually checks it and
swaps to a flight suggestion. If it just prints the road time, users
will plan an overland leg that every experienced traveller would
fly (Dong Hoi airport, ~₹3,000–5,000 one-way). The same applies to
Cat Ba → Phong Nha and any leg jumping north to central.

**5. The ₹2k/night accommodation average is too coarse.** The PLACES
data itself acknowledges the range: Pu Luong stilt-house homestays
run ₹600–900/night; Hanoi or Hoi An midrange hotels are ₹1,800–3,500;
a decent Cat Ba boat stay or a nicer Hoi An boutique is ₹4,000+.
Flattening this to ₹2k means the generator will overestimate cost
for the rural north (making those stops look expensive) and
underestimate for Hoi An and Hanoi (where ₹2k buys a fan room in the
old quarter). The output won't match any booking site the user
opens.

**6. The ₹1,500/day tier-1 activity anchor is significantly low.**
The Ha Giang easy-rider — which is the core activity for any tier-1
Ha Giang day — costs **₹2,500–3,500/day per person** for a
guide-driver on a semi-automatic bike. A canyoning / Dark Cave combo
at Phong Nha (also tier 1) runs ₹2,000–2,800 per person. The ₹1,500
figure fits tier-2 places (a Ninh Binh boat + bike day, or a Hoi An
cooking class) better than it fits the genuine adventure days the
tier-1 designation is supposed to represent.

**7. Seasonal warnings are absent from the generator logic.** The
WHEN data exists in `app.js` (indexed by region × month) but the
plan doesn't describe using it to generate warnings. Critical
cases:
- Phong Nha caves close October through December (flooding)
- Central Vietnam typhoon season peaks September–November and can
  strand travellers mid-itinerary
- Northern highlands are cold and misty December–February (Ha Giang
  is 5–10°C and often foggy, making the loop roads dangerous)

A generator that ignores the trip's travel month and produces a
confident day-by-day with no "check seasonal access" flag is a
liability.

**8. Budget headroom is missing.** The cost model produces a point
estimate, but Vietnam travel has well-known variable costs:
motorbike hire day-rates fluctuate, cave permits get added without
warning, private car costs vary 30 % by negotiation, and medical /
emergency spending in a remote place like Ha Giang (nearest hospital
is 4+ hours away) is non-trivial. Showing *"₹X estimated vs ₹Y
budget"* without a buffer column or an explicit "we've left Z%
headroom" line will look naively precise to anyone who has spent a
week in the north.

**9. Notable gaps in the curated PLACES list.**
- **Da Lat** is the most glaring omission for this group's stated
  preference for quiet + active: cool climate, waterfalls, canyoning,
  coffee farms, almost no beach-resort crowd. It sits at lat 11.9
  and would slot cleanly between Quy Nhon and HCMC.
- **Mekong Delta** (Can Tho / Ben Tre) is a full-day to two-day
  detour from HCMC and is already mentioned in the HCMC `doing[]`,
  but has no standalone card — a user who votes Yes on HCMC
  expecting a Mekong overnight will get no days allocated to it.
- Phu Quoc and Con Dao are legitimately popular for the
  beach-end-of-trip pattern but are deliberate omissions given the
  "quiet + active" framing, which is defensible.

**10. Experienced-traveller verdict.** As a starting point, the
output will be genuinely useful for first-time Vietnam planners in
the group. The PLACES data is honest (the descriptions actively push
back on Sapa, Da Nang, Hoi An crowds rather than flattering them),
and the curated ROUTES already show good editorial judgment. What
will feel thin to an experienced traveller is the false precision:
a day-by-day with specific night counts and cost figures that are
visibly wrong the moment you open Google Maps or a booking site.
Framing outputs as *"rough guide, adjust nights for Ha Giang"* and
adding a prominent *"mountain road times are estimates — add 50 %"*
disclaimer would protect the tool's credibility without requiring a
full rework.

## Single biggest unrealistic assumption

**Haversine × 1.3 at 60 km/h for mountain roads.** It produces travel
days for Ha Giang, Pu Luong and the Sapa area that are 40–60 %
shorter than reality, turning what are genuinely full-day transit
days into apparent half-days and causing the entire northern portion
of any generated itinerary to be structurally undeliverable.
