import Link from 'next/link'
import { skills } from './lib/skills'

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Skill Directory
          </h1>
          <p className="mt-2 text-slate-400">
            Agent Skills from the Spring Into AI Build Sprint — discover what tools AI can use.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            For agents: <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-400">GET /api/skills</code> returns this list as JSON.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <ul className="space-y-6">
          {skills.map((skill) => (
            <li
              key={skill.name}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-cyan-500/50 hover:bg-slate-800/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {skill.name}
                  </h2>
                  {skill.author && (
                    <span className="mt-1 inline-block text-sm text-slate-500">
                      {skill.author}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={skill.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-slate-700 hover:text-cyan-300"
                  >
                    Repo
                  </Link>
                  {skill.demo && (
                    <Link
                      href={skill.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-cyan-500/30"
                    >
                      Demo
                    </Link>
                  )}
                </div>
              </div>
              <p className="mt-3 text-slate-300">{skill.description}</p>
              <p className="mt-3 text-sm">
                <span className="font-medium text-slate-500">When to use:</span>{' '}
                <span className="text-slate-400">{skill.when_to_use}</span>
              </p>
            </li>
          ))}
        </ul>

        <footer className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>
            <Link
              href="https://agentskills.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Agent Skills
            </Link>
            {' · '}
            <Link
              href="https://advisoryhour.substack.com/p/spring-into-ai-competition-rules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Spring Into AI
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}
