# Review 08 — Data / Backend

> Lens: senior backend / data engineer. Asked to evaluate schema,
> persistence model, Firestore rules, and free-tier quota.

## Findings

**1. Plan schema and localStorage key shape**

Per day-card: `{ dayNum, placeId (or null for travel days), title,
nights, notes, activities: [] }`. Top-level plan object:
```js
{ version:1, generatedAt, profileSnapshot:{name,groupSize,budgetPP},
  routeId (or null), days:[] }
```
Store under `tripPlan_v1` in localStorage. Keep `profileSnapshot`
so you can detect drift (see #3) without re-reading Profile.

**2. Sharing a plan via URL**

Store a plan doc in Firestore: collection `plans`, doc id = a short
random slug (6–8 chars, e.g. nanoid-style, generated client-side).
Shape:
```js
{ ownerId: name_lower, createdAt, days:[],
  routeId, profileSnapshot:{groupSize,budgetPP} }
```
Share URL: `plan.html?id=abc123`. On load, detect the `?id=` param
and do a single `getDoc` — read-only by id. The author writes once;
everyone else just reads. No continuous listener needed, so quota
cost is minimal.

**3. Editing vs. re-derivation**

**Persist edits.** Once a user reorders or removes a day-card, that
IS their plan — silently re-deriving would trash their work. The
right model: auto-generate once into localStorage on first visit (or
when votes change *and* no manual edits exist), then mark the plan
`edited: true` on first manual change. Show a subtle "regenerate
from votes" button that only appears when `edited: true`. **Never**
auto-overwrite an edited plan.

**4. Where user-suggested places live**

A separate `suggestions` Firestore collection. Never inside `votes`
(different schema, different lifecycle) and never in the
compile-time `PLACES` array. Keep them cleanly apart so
`sanitiseVote` and the voting UI don't need to handle a mixed type.

**5. Suggestion doc schema**

```js
{
  id: "da-lat",                  // normalised lowercase, hyphenated (doc id)
  displayName: "Da Lat",         // raw user input, escaped on render
  suggestedBy: "pranav",         // name, same regex as votes
  suggestedAt: <int timestamp>,
  note: "heard it's cooler..."   // optional, max 200 chars
  count: 1                       // maintained via transaction or recounted on read
}
```

**6. Anti-spam (without adding Auth)**

Three layers:
- Firestore rule: same name regex + length cap as votes;
  `displayName` max 60, `note` max 200, `suggestedBy` must match
  the name regex.
- Rate-limit by doc id: the doc id is the normalised name, so a
  duplicate just hits the same doc — no unbounded writes.
- One suggestion per `(suggestedBy, normalised name)`: enforce at
  the client; accept the race condition for a family-scale site.

**7. Dedup — one entry with count**

Yes. Normalise to lowercase-hyphenated for the doc id (`da-lat`,
`da lat` → same doc). On write, use a Firestore transaction to
increment `count` and append the voter name to a `voters: string[]`
(capped at e.g. 20 in the rule). Render as one card showing *"3
people want to add Da Lat."*

**8. Should suggestions be votable?**

Yes, eventually — it's the natural next step and reuses the exact
`TripVotes` model. For the first cut, just list them as "community
wishlist." In v2, give each suggestion a synthetic id (e.g.
`sug_dalat`) and let `TripVotes.cast` accept it, with `sanitiseVote`
extended to allow `sug_`-prefixed ids.

**9. Anonymity — aggregation not deletion**

Don't just remove the chips. **Aggregated display is more useful:**
*"✓ 3  ~ 2"* (counts only). The per-name chips on results.html are
already absent — `renderResults` only uses counts. On places.html
cards and the detail sheet, the voter chips (if you add them) should
only ever show counts. The `name` field is read but need not be
rendered anywhere publicly.

**10. Privacy — UI-only change**

`name` stays in Firestore as the doc id component
(`pranav__hagiang`) — it must, or you can't upsert/delete a user's
own vote. The privacy change is purely presentational. The mild
concern: anyone who opens DevTools → Network can see raw Firestore
payloads including all names. For a family site this is fine per the
existing trade-off note. If you want stronger privacy, switch the
doc id to `hash(name)__placeId` and store name only locally, but
that breaks multi-device continuity without Auth.

**11. Firestore rules updates needed**

```
match /suggestions/{doc} {
  allow read: if true;
  allow create: if
       request.resource.data.keys().hasOnly(
         ['id','displayName','suggestedBy','suggestedAt','note','count','voters'])
    && request.resource.data.displayName is string
    && request.resource.data.displayName.size() >= 1
    && request.resource.data.displayName.size() <= 60
    && request.resource.data.suggestedBy is string
    && request.resource.data.suggestedBy.matches("^[\\p{L}\\p{N} .'\\-]+$")
    && request.resource.data.suggestedBy.size() <= 24
    && (!('note' in request.resource.data)
        || (request.resource.data.note is string
            && request.resource.data.note.size() <= 200))
    && request.resource.data.count == 1;
  allow update: if
       request.resource.data.count == resource.data.count + 1
    && request.resource.data.voters.size() <= 20;
  allow delete: if false;
}

match /plans/{doc} {
  allow read: if true;
  allow create: if
       request.resource.data.keys().hasOnly(
         ['ownerId','createdAt','days','routeId','profileSnapshot'])
    && request.resource.data.ownerId is string
    && request.resource.data.ownerId.size() <= 24
    && request.resource.data.days is list
    && request.resource.data.days.size() <= 30;
  allow update: if request.resource.data.ownerId == resource.data.ownerId;
  allow delete: if false;
}
```

The existing `/{document=**}` deny-all catch still needs to remain
last and will block everything else.

**12. Quota risk on Spark free tier (50K reads/day)**

Current baseline: one `onSnapshot` listener on `votes` fires once
per page load + on every write. At family scale (5–10 users, ~12
places) this is negligible.

New risks:
- `suggestions` listener on plan.html: +1 read per doc per page load.
  Fine.
- Plan sharing (`getDoc` by id): 1 read per visitor per load. Fine.
- The real risk is if you put a `suggestions` `onSnapshot` on every
  page — each vote cast by anyone re-fires the listener on all open
  tabs. **Keep the suggestions listener only on plan.html or a
  dedicated page**, not on map / places / results.

At family scale none of this threatens the 50K limit, but the
`votes` collection listener already scales as O(docs × open_tabs ×
writes), so the main guard is not having many concurrent open tabs.
