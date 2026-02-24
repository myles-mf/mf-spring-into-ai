'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { speak } from '@/app/lib/tts'

type Association = { locus: string; item: string; sentence: string }

const TEMPLATE_LOCI = ['door', 'desk', 'window', 'bed', 'shelf']

export default function ExplorePage() {
  const [associations, setAssociations] = useState<Association[]>([])
  const [selected, setSelected] = useState<Association | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('memory-palace-associations')
      if (raw) {
        const list = JSON.parse(raw) as Association[]
        if (Array.isArray(list)) setAssociations(list)
      }
    } catch (_) {}
  }, [])

  const byLocus = new Map(associations.map((a) => [a.locus.toLowerCase(), a]))

  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-900/50 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-amber-400">
            ← Memory Palace
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-amber-100">Explore your palace</h1>
          <p className="mt-1 text-slate-400">
            Click each spot to see what you put there.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {associations.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6 text-center text-slate-400">
            <p>No palace yet. Create one first so we can show your associations here.</p>
            <Link href="/create" className="mt-4 inline-block text-amber-400 hover:underline">
              Create your palace
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TEMPLATE_LOCI.map((locus) => {
                const a = byLocus.get(locus)
                const isSelected = selected?.locus.toLowerCase() === locus.toLowerCase()
                return (
                  <button
                    key={locus}
                    type="button"
                    onClick={() => setSelected(a ?? null)}
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-amber-700'
                    }`}
                  >
                    <span className="font-medium capitalize text-amber-200">{locus}</span>
                    {a && (
                      <p className="mt-1 truncate text-sm text-slate-400">{a.item}</p>
                    )}
                  </button>
                )
              })}
            </div>
            {selected && (
              <div className="mt-6 rounded-xl border border-amber-800/40 bg-slate-800/30 p-4">
                <p className="font-medium text-amber-200">{selected.locus}</p>
                <p className="mt-1 text-slate-200">{selected.item}</p>
                <p className="mt-2 text-slate-300 italic">&ldquo;{selected.sentence}&rdquo;</p>
                <button
                  type="button"
                  onClick={() =>
                    speak(
                      `${selected.locus}: ${selected.item}. ${selected.sentence}`
                    )
                  }
                  className="mt-3 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
                  title="Read aloud"
                >
                  🔊 Read aloud
                </button>
              </div>
            )}
            <div className="mt-8 flex gap-3">
              <Link
                href="/quiz"
                className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500"
              >
                Start quiz
              </Link>
              <Link
                href="/create"
                className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
              >
                New palace
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
