# Day-by-day Builder — Plan v0

> The initial proposal. **Reviewed by 10 specialists; not yet implemented.**
> See `review-01-product-design.md` through `review-10-edge-cases.md` for critiques.

## What it solves

Right now the site has:
- **Votes** (Yes / Maybe / Skip on each place)
- **Profile** (name, age, group size, ₹ budget, ₹ buffer)
- **Three curated routes** displayed on a map

None of these compose into an itinerary you could hand to a booking
site or family chat. The Day-by-day Builder bridges that gap: it turns
decisions into *"Day 1: arrive Hanoi, Day 2: Ha Giang, …"*.

## What a good output looks like

A vertical timeline. One card per day. Each card answers four
questions:

1. **Where am I?** (Place, region)
2. **What am I doing?** (2–4 activities from the place's `doing[]`)
3. **Where am I sleeping?** (Same place, or "moving on tomorrow")
4. **How do I get to the next place?** (Mode, time, rough ₹ — only on
   the last day at a place)

At the top: total days, total km, total ₹ per person + per group vs.
budget + buffer. At the bottom: Print / Copy as text.

## User journey

1. User has voted Yes / Maybe on places (already exists).
2. User opens the Builder (new tile / nav entry).
3. The page **auto-generates** a draft itinerary from their picks —
   they don't start with a blank canvas, that's intimidating.
4. They can edit: change nights per place (− / + buttons), remove a
   place, reorder via ▲ ▼ buttons.
5. Numbers (days, km, ₹) update live as they edit.
6. They print or copy the plan.

The first version doesn't sync to the group — each person builds their
own. A group-merged plan is a future iteration.

## What the auto-generator does

**Input:** every Yes + Maybe place from the user's votes.

**Logic:**
- **Order** north → south by latitude (matches the "My route" map
  overlay).
- **Nights per place default:** Tier 1 = 3, Tier 2 = 2, Tier 3 = 1
  (Hanoi: 1 if connector, 2 if standalone).
- **Transport between consecutive places:** lookup in a `TRANSPORT_LEGS`
  table that mirrors the Travel page (Hanoi→Ninh Binh: 2 hrs train,
  ₹X). For unknown legs: Haversine × 1.3 (typical road-vs-crow ratio)
  at 60 km/h.
- **Activities per day:** distribute the place's `doing[]` items
  across nights so each day gets 2–4 items; travel days get fewer.
- **Cost per day:** simple model — accommodation ₹2k/person/night,
  food ₹600/person/day, activities tier-weighted (₹1.5k tier-1,
  ₹800 tier-2, ₹400 tier-3), transport from the leg table.

Documented as "rough baseline; verify before booking." Same convention
as the routes page cost estimate.

## What it does *not* do (v1)

- No real flight/hotel booking integration
- No actual calendar dates (Day 1, Day 2 — trip window is still TBD
  per CLAUDE.md's original notes)
- No multi-user merged itinerary (your plan ≠ Pranav's plan)
- No drag-and-drop (use ▲ ▼ buttons — iOS drag is fiddly on a static
  site)
- No PDF export (use a print stylesheet; the browser handles
  "Save as PDF" natively)

## Where it lives

A new page `plan.html`, accessed three ways:

- Home tile (replaces the "Day-by-day builder — Soon" tile, becoming
  active)
- Routes page footer ("Like one of these? **Build your own plan →**")
- Results page footer ("Happy with the picks? **Turn them into days →**")

## Mockup — what a card looks like

```
┌──────────────────────────────────────────────────────────────┐
│ DAY 1                                              Hanoi (1n)│
│                                                              │
│ ✈️  Arrive Hanoi (HAN), transfer to Old Quarter hotel        │
│ 🌙 Settle in, dinner at Bun Cha Huong Lien or similar       │
│ 🌙 Stroll Hoan Kiem lake, train street                       │
│                                                              │
│ ─────  ₹3,200 / person · ₹22,400 group  ─────                │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ DAY 2–4                                          Ha Giang (3n)│
│                                                              │
│ 🛣️  Hanoi → Ha Giang · sleeper bus or private car · 6–7 hrs  │
│     ~₹1,800 / person (private car split between group)       │
│ 🏍️  Day 1: Ma Pi Leng pass + Nho Que river gorge             │
│ 🏍️  Day 2: hill-tribe villages + Lung Cu flag tower          │
│ 🏍️  Day 3: easy loop back via Du Gia                         │
│                                                              │
│ ─────  ₹14,200 / person · ₹99,400 group  ─────              │
└──────────────────────────────────────────────────────────────┘
```

A summary header at the top:

```
Your plan · 14 days · 1,840 km · ₹78,400 per person
                                              ✓ under budget by ₹6,600
```

## Open questions taken to the reviewers

- **Place source:** Yes+Maybe / Yes only / curated route / group top
- **Editing depth:** read-only / edit nights+reorder+remove / drag-drop
- **Numbered days vs. calendar dates**
- **Personal plan vs. group plan vs. both**
- **Output:** on-page only / +copy text / +shareable URL

The 10 review files document the answers we arrived at on each.
