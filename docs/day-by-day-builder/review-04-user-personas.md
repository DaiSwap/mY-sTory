# Review 04 — User Personas

> Five mock users react to the v0 plan in their own voice.

---

## Pranav (32, organiser)

Yes, this is exactly the kind of tool I've been building manually in
Sheets. I'd use it mid-planning, after the first round of voting
settles. My main gripe: I need to compare two itinerary variants
side-by-side — 10 days vs 14 days, Ha Giang vs skipping it. One plan
at a time isn't enough. Also, the overnight train to Phong Nha is
17+ hours; I want the builder to flag that as a rough day before I
commit to it.

> *"Finally, something better than my spreadsheet — but I need a
> save-and-compare, not just one draft."*

---

## His parents (62 + 60, first international trip)

We would not open this page ourselves — we'd ask Pranav to show us.
But if he sits with us and walks through it, the day-by-day format
is reassuring. We like knowing where we sleep each night. The ₹
column matters enormously; we'd want a running total at the bottom,
not just per-day. What worries us: "Maybe" votes becoming confirmed
plans without us realising it. We'd want a clear "this is a draft,
nothing is booked" reminder on screen at all times.

> *"Show us the total cost and which nights we have a proper bed —
> that's all we need."*

---

## His sister (28, busy professional)

I'd land on this page exactly once, skim it in 90 seconds, and either
trust it or not. The day-by-day format is good for that — it reads
like an itinerary, not a voting interface. What kills it: if I have
to re-vote or re-configure anything before the plan generates, I'm
gone. It should just show me a default plan the moment I arrive,
built from whatever I've already voted. Don't make me press a
"Generate" button.

> *"Show me a plan immediately — I'll read it, but I won't build it."*

---

## His cousin (24, gap-year traveller)

Honestly the auto-generated route will be the tourist loop and I'll
find it a bit sanitised. Da Lat and Mui Ne aren't in your curated
list and they should be. The edit feature helps — I can at least
reorder and add nights — but if I can't add a custom stop with my own
name, distance, and cost estimate, the tool is half-built for anyone
going off the beaten track. The km and ₹ updates are a nice touch
though; most planners ignore the road time between places.

> *"Let me type in a place that isn't on your list, otherwise this is
> a plan for first-timers."*

---

## Pranav's wife (30, joint decision-maker)

This is the page I'd actually care about most. The per-day cost
breakdown is exactly what I want, and pace visibility — knowing
Day 3 is a 6-hour drive day versus a rest day — is something no
other tool I've seen shows clearly. My ask: a simple "cramming
score" or just total travel hours vs total leisure hours for the
whole trip. I want to see at a glance whether we've accidentally
designed a logistics nightmare. Each-person-builds-their-own is fine
for exploring, but we'll need a merge step eventually.

> *"Show me the pacing and the total ₹ commitment — then I can say
> yes or no to the whole thing."*

---

## What this surfaces

- Two of five personas (sister, parents) **don't want to build —
  they want to read.** They land, skim, decide.
- One persona (cousin) wants to **add custom places** — solved by the
  "Suggest a place" feature shipped separately.
- One persona (wife) wants **pacing visibility** — not budget
  precision, just "are we cramming?"
- Only one persona (organiser) actually wants the builder-as-tool —
  and even he wants compare-two-variants, not single-plan editing.

**The plan should be a story to read, not a tool to operate.**
