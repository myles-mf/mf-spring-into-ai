---
name: sprint-helper
description: Returns a random build-sprint project idea in JSON for the Spring Into AI Build Sprint. Use when the user or agent needs a quick idea for a weekly theme (data viz, AI tools, etc.) or wants to suggest what to build next.
---

# Sprint Helper Skill

Use this skill when you need a concrete, small project idea for a build sprint (e.g. Spring Into AI) or when the user asks "what should I build?"

## How to use

1. Run the script in `scripts/get-idea.mjs` with Node (no args).
2. It prints one JSON object to stdout: `{ "theme", "idea", "scope" }`.
3. Parse the output and use it to suggest a build or to unblock the user.

## Example

```bash
node scripts/get-idea.mjs
```

Example output:

```json
{"theme":"data-viz","idea":"Small dashboard that filters a CSV by date range","scope":"1 day"}
```

## When to activate

- User says they're in a build sprint or weekly ship challenge.
- User asks for a project idea, or "what can I build for theme X?"
- Agent needs a small, shippable idea to propose.

## Script location

`scripts/get-idea.mjs` — run from the skill root or pass the path to the agent's script runner.
