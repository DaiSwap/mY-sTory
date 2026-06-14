# Review 07 — Accessibility

> Lens: a11y specialist (WCAG 2.2 AA + practical screen-reader UX).

## Findings

**1. Card list semantics and heading hierarchy**

Use `<ol>` (not `<ul>` or `<div>`), with each day as `<li>`
containing an `<article>`. Inside each article give a visible `<h2>`
(or `<h3>` if there's already an `<h2>` above) — e.g. *"Day 3 — Ha
Giang"*. Without this, VoiceOver / NVDA gives no structural landmark
and the user cannot jump between days with the Headings rotor.

**2. Edit control accessible names**

The Unicode glyphs ▲ ▼ − / + ✕ have no accessible name in any AT.
Every button needs `aria-label` that encodes the *current state*:
- `aria-label="Move Ha Giang up, currently day 3"`
- `aria-label="Increase nights at Ha Giang, currently 3"`
- `aria-label="Remove Ha Giang from plan"`

Recalculate and update these labels on every state change — they
are not static.

**3. Live number updates**

Wrap the cost / nights summary header in a
`<div role="status" aria-live="polite" aria-atomic="true">`. The
existing pattern (e.g. `.res-meta`) updates DOM silently — screen
readers will not notice unless the container is a live region. Do
**not** use `aria-live="assertive"`; that interrupts mid-sentence.

**4. Focus management after reorder**

After ▲ or ▼ moves a card, refocus the same logical button on the
card that moved — since the card's DOM position changed, you must
call `button.focus()` explicitly after the DOM mutation. Add a
visually-hidden `aria-live="polite"` announcement: *"Ha Giang moved
to position 2 of 14."* Without this, keyboard users lose their place
silently.

**5. Reduced-motion coverage**

`styles.css` already has the correct block, but the new plan.html
entrance animations (card slide-in, counter count-up) must be listed
there too. Pattern: add `.day-card, .plan-counter { animation: none;
transition: none; }` inside the existing
`@media (prefers-reduced-motion:reduce)` block — do not create a
second media query.

**6. Colour contrast on bg-2**

- `--yes:#1f9d57` on `--bg-2:#f5f5f7` gives ~4.6:1 (passes AA for
  normal text, tight for 13 px bold).
- `--skip:#c2503a` on `--bg-2` is approximately 3.8:1 — **fails AA**
  for text under 18 px / 14 px bold. Use `--skip:#b33f2a` (darkened
  ~10 %) for the "over budget" text label on `--bg-2` backgrounds.
- The existing `.tier-3` pattern avoids this by pairing `ink-2` with
  the tinted bg.

**7. Tab-stop overload — skip link and grouping**

The existing `.skip-link` pattern only skips to `#main`. For a
14-card plan with 70+ stops, add a **second skip link** *"Skip to
cost summary"* targeting the summary region. More importantly, group
each card's controls with `role="group"` and `aria-labelledby`
pointing to its day heading — this lets AT users navigate by group
rather than tabbing every button.

**8. Print stylesheet — link URLs**

The print stylesheet will hide decorative elements (good), but
transport links and place-name links become invisible text. Add
inside `@media print`:
```css
.day-card a[href]::after {
  content: " (" attr(href) ")";
  font-size: 11px;
  color: #555;
}
.day-card a[href^="#"]::after { content: none; }
```

**9. Copy-as-text format**

The copied text must not use Unicode-only icons (▲, ✕, →) as content
markers — they are read inconsistently across AT and plain-text
email clients. Use ASCII alternatives (`>`, `x`, `->`) or omit
decorative symbols entirely. Structure with labelled lines:

```
Day 3: Ha Giang | 3 nights | Bus | ~₹4,200
```

using pipe separators and label prefixes, not whitespace-only
alignment, so it pastes into screen readers and email clients
legibly.
