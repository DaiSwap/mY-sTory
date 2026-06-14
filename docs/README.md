# docs — context, plans and session history

This folder is the project's institutional memory. It exists so that
the next person (human, Claude, or any other LLM) picking up the
codebase can get **oriented in minutes, not hours**.

## Where to start

| If you want to… | Read… |
|---|---|
| Understand what this product *is* and the constraints to respect | [`session-logs/`](./session-logs/) — start with the newest |
| See what's planned next and pick a feature to ship | [`next-steps/`](./next-steps/) |
| Understand the day-by-day builder review process (historical) | [`day-by-day-builder/`](./day-by-day-builder/) |

## Subfolder map

```
docs/
├── README.md                ← you are here
├── session-logs/            current state of the site + what's been
│                            built, in chronological order
├── next-steps/              detailed, ready-to-ship plans for the
│                            next features (each one is its own .md
│                            with file paths, line numbers, code
│                            skeletons, test plan, risks)
└── day-by-day-builder/      historical 10-reviewer critique of the
                             original day-by-day plan v0 and the
                             smaller v1 synthesis block that shipped
                             instead. Useful background but not
                             needed for day-to-day work.
```

## House style for these docs

- Plain English. Same constraint as the user-facing site.
- File paths absolute from repo root (`app.js`, `docs/next-steps/...`),
  never from `/Users/...`.
- When quoting code, include the file path **and the line number** if
  the reader will need to find it.
- Date all session logs in `YYYY-MM-DD` ISO format in the filename.
- One feature per file in `next-steps/`. Number them so reading
  order is obvious.
