export type Skill = {
  name: string
  description: string
  repo: string
  when_to_use: string
  demo?: string
  author?: string
}

export const skills: Skill[] = [
  {
    name: 'sprint-helper',
    description: 'Returns a random build-sprint project idea in JSON. For agents that need to suggest what to build next (e.g. Spring Into AI weekly themes).',
    repo: 'https://github.com/myles-mf/mf-spring-into-ai',
    when_to_use: 'User asks for a project idea, or agent needs a small shippable idea for a build sprint.',
    author: 'myles-mf',
  },
  {
    name: 'azure-sql-dtu-profiler',
    description: 'Pulls Azure SQL Query Store and resource pressure metrics. Renders a compact Markdown report with sparklines, top N slow/expensive queries, wait profiles, and tuning recommendations.',
    repo: 'https://github.com/seabass223/ai-skills',
    when_to_use: 'SQL Server metrics, DTU pressure, monitoring alarms, top offending queries over a time window.',
    author: 'seabass223',
  },
  {
    name: 'crypto-market',
    description: 'Real-time cryptocurrency market data: live prices, market overview, trend analysis, coin comparison. All output is structured JSON for agents to parse.',
    repo: 'https://github.com/JStrait515/crypto-agent-skill',
    when_to_use: 'Crypto prices, market cap, volume, 24h change, top coins, or comparing multiple coins.',
    demo: 'https://crypto-agent-skill.vercel.app',
    author: 'JStrait515',
  },
]
