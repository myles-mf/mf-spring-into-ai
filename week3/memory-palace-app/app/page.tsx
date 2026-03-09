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
            Learn the Method of Loci — then use it to remember anything. AI builds your palace; you explore and quiz.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Spring Into AI · Week 3: Interactive Tutorials · Week 4: Soundwave — Palace Radio
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-10">
        {/* Week 4 — Palace Radio */}
        <section className="rounded-xl border-2 border-amber-600 bg-amber-950/30 p-6">
          <h2 className="text-lg font-semibold text-amber-100">▶ Palace Radio — Week 4: Soundwave</h2>
          <p className="mt-2 text-slate-300">
            Tune in. The Voice of the Palace guides you through every room. One broadcast: intro, each locus, outro.
          </p>
          <Link
            href="/broadcast"
            className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500"
          >
            Start Palace Radio
          </Link>
          <p className="mt-2 text-sm text-slate-500">
            Create a palace first, then open Palace Radio — or go to Explore and click “Palace Radio” after building.
          </p>
        </section>

        {/* Explain the concept — hits "learning" / "tutorial" */}
        <section className="rounded-xl border border-amber-800/40 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-amber-100">What’s the Memory Palace?</h2>
          <p className="mt-3 text-slate-300 leading-relaxed">
            It’s an ancient technique (Method of Loci): you put things you want to remember in <strong className="text-amber-200">places</strong> you can picture — like spots in a room. Your brain is great at remembering <em>where</em> things are, so linking facts to locations makes recall stick. No flashcards, no grinding — just a mental walk through your space.
          </p>
          <p className="mt-3 text-slate-400 text-sm">
            Here, you pick the space (a template room or a photo of your room), tell us what to remember, and AI generates vivid, silly associations for each spot. Then you explore the room and take a quiz. Learning by doing.
          </p>
          <details className="mt-4 rounded-lg border border-slate-700 bg-slate-800/30">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-amber-200 list-none [&::-webkit-details-marker]:hidden">
              Why does this work?
            </summary>
            <p className="px-4 pb-3 pt-0 text-sm text-slate-400 border-t border-slate-700 mt-0 pt-3">
              Your brain is better at remembering <strong className="text-slate-300">places</strong> and <strong className="text-slate-300">images</strong> than raw facts. By tying each fact to a location and a vivid picture, you give it two hooks — spatial + visual — so recall becomes easier. It’s called dual coding, and the Method of Loci has been used for thousands of years.
            </p>
          </details>
        </section>

        {/* How it works — clear flow */}
        <section>
          <h2 className="text-lg font-semibold text-amber-100">How it works</h2>
          <ol className="mt-3 space-y-2 text-slate-300 text-sm">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-600/30 text-amber-200 flex items-center justify-center text-xs font-bold">1</span>
              <span><strong className="text-slate-200">Choose your space</strong> — template room (instant) or upload a photo of your room so the palace is yours.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-600/30 text-amber-200 flex items-center justify-center text-xs font-bold">2</span>
              <span><strong className="text-slate-200">Say what to remember</strong> — a topic (e.g. quadratic formula) or a list. AI assigns each item to a spot and creates a vivid image or story.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-600/30 text-amber-200 flex items-center justify-center text-xs font-bold">3</span>
              <span><strong className="text-slate-200">Explore & quiz</strong> — click through the room, hear associations with audio, then test yourself. Replay anytime.</span>
            </li>
          </ol>
        </section>

        {/* Two clear CTAs — template no longer "bland", both valid */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/create"
            className="block rounded-xl border-2 border-amber-600 bg-amber-950/30 p-6 text-left transition hover:border-amber-500 hover:bg-amber-900/20"
          >
            <h3 className="font-semibold text-amber-200">Try the template room</h3>
            <p className="mt-2 text-sm text-slate-400">
              Walk through a sample room (door, desk, window, bed, shelf). No upload — see the technique in under a minute.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-amber-400">Create your palace →</span>
          </Link>
          <div className="rounded-xl border-2 border-slate-600 bg-slate-800/30 p-6">
            <h3 className="font-semibold text-slate-200">Or use your own room</h3>
            <p className="mt-2 text-sm text-slate-400">
              Upload a photo on the next screen. AI finds spots in your space and highlights them when you explore — best for real recall.
            </p>
            <Link href="/create" className="mt-3 inline-block text-sm font-medium text-amber-400 hover:underline">
              Create your palace →
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-800 pt-8 pb-12 text-center text-sm text-slate-500 space-y-1">
        <p>
          The Method of Loci has been used for millennia — now with AI. Week 4: Soundwave — Palace Radio.
        </p>
        <p>
          <Link
            href="https://advisoryhour.substack.com/p/spring-into-ai-competition-rules"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline"
          >
            Spring Into AI · Week 3: Interactive Tutorials · Week 4: Soundwave
          </Link>
        </p>
      </footer>
    </div>
  )
}
