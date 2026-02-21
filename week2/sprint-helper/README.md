# Sprint Helper — Agent Skill (Week 2)

A small **Agent Skill** for the [Agent Skills](https://agentskills.io/home) format. It gives an AI agent a tool to suggest a random, shippable build-sprint idea in JSON.

Built for Week 2 of the Spring Into AI Build Sprint (theme: *build something for AI to use*).

## What it is

- A folder with `SKILL.md` (instructions for the agent) and `scripts/get-idea.mjs` (runnable script).
- An agent (e.g. Cursor, Copilot, Claude Code) can load this skill and run the script when the user needs a project idea.
- Output is one JSON object: `{ "theme", "idea", "scope" }`.

## How to run the script (for humans or agents)

From this directory:

```bash
node scripts/get-idea.mjs
```

Example output:

```json
{"theme":"ai-tools","idea":"Tiny HTTP API that returns one random prompt or template","scope":"1 day"}
```

## How an agent uses it

1. Load the skill (read `SKILL.md`).
2. When the user needs a build idea, run `scripts/get-idea.mjs`.
3. Parse stdout as JSON and use the fields to suggest what to build.

## Repo

Part of [mf-spring-into-ai](https://github.com/myles-mf/mf-spring-into-ai) — Week 2: tools for AI.

## Screenshot / example

Example terminal output:

```
$ node scripts/get-idea.mjs
{"theme":"data-viz","idea":"Filterable bar chart from a public CSV","scope":"1 day"}
```
