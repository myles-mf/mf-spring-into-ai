import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-900/50 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-amber-100">
            Memory Palace
          </h1>
          <p className="mt-2 text-slate-400">
            Use the Method of Loci to remember anything. AI builds your palace and vivid associations — you explore and quiz.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Spring Into AI · Week 3: Interactive Tutorials
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border border-amber-800/40 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-amber-100">Get started</h2>
          <p className="mt-2 text-slate-300">
            Choose a template room, tell us what you want to remember, and we’ll generate vivid associations for each spot. Then explore and quiz.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-block rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-slate-900 hover:bg-amber-500"
          >
            Create your palace
          </Link>
        </div>

        <footer className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>
            <Link
              href="https://advisoryhour.substack.com/p/spring-into-ai-competition-rules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              Spring Into AI
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}
