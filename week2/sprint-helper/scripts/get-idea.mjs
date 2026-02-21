#!/usr/bin/env node
/**
 * Outputs one random build-sprint project idea as JSON for agents to consume.
 * Run: node scripts/get-idea.mjs
 */

const ideas = [
  { theme: 'data-viz', idea: 'Filterable bar chart from a public CSV', scope: '1 day' },
  { theme: 'data-viz', idea: 'Simple line chart with time range slider', scope: '1 day' },
  { theme: 'ai-tools', idea: 'CLI that returns structured JSON for an agent to parse', scope: '1 day' },
  { theme: 'ai-tools', idea: 'Agent Skill that generates a project idea (this skill)', scope: '1 day' },
  { theme: 'ai-tools', idea: 'Tiny HTTP API that returns one random prompt or template', scope: '1 day' },
  { theme: 'general', idea: 'Small API that fetches one public dataset and returns JSON', scope: '1 day' },
  { theme: 'general', idea: 'Script an agent can run to validate a SKILL.md frontmatter', scope: '1 day' },
];

const pick = ideas[Math.floor(Math.random() * ideas.length)];
console.log(JSON.stringify(pick));
