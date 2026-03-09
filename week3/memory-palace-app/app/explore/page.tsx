'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { speakAsKeeper } from '@/app/lib/tts'
import {
  loadPalace,
  TEMPLATE_LOCI,
  TEMPLATE_HOTSPOTS,
  type Association,
} from '@/app/lib/palace'

export default function ExplorePage() {
  const [palace, setPalace] = useState<ReturnType<typeof loadPalace>>(null)
  const [selected, setSelected] = useState<Association | null>(null)
  const [remindCopied, setRemindCopied] = useState(false)

  useEffect(() => {
    setPalace(loadPalace())
  }, [])

  const associations = palace?.associations ?? []
  const loci = palace?.loci ?? []
  const customImage = palace?.imageDataUrl
  const regions = palace?.regions ?? []
  const isTemplate =
    !customImage &&
    loci.length === TEMPLATE_LOCI.length &&
    loci.every((l, i) => l.toLowerCase() === TEMPLATE_LOCI[i])

  const byLocus = new Map(associations.map((a) => [a.locus.toLowerCase(), a]))

  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-900/50 bg-slate-900/50 no-print">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-amber-400">
            ← Memory Palace
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-amber-100">Explore your palace</h1>
          <p className="mt-1 text-slate-400">
            Click each spot to see what you put there. Your brain remembers places easily — that’s why this works.
          </p>
          <div className="mt-3 rounded-lg border border-amber-700/40 bg-amber-950/20 px-3 py-2 text-sm text-amber-200/90">
            <strong>Pro tip:</strong> Use Hear the Keeper when you click a spot — or <Link href="/broadcast" className="text-amber-400 hover:underline">tune in to Palace Radio</Link> for the full tour.
          </div>
        </div>
      </header>
      <div className="hidden print:block print:py-4 print:px-4">
        <h1 className="text-xl font-bold text-slate-900">My Memory Palace</h1>
        <p className="text-sm text-slate-600 mt-1">Use these spots to recall — print and review anytime.</p>
      </div>

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
            {/* Room image with hotspots (template) or custom image + locus list */}
            <div className="relative w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
              {customImage ? (
                <>
                  {/* Wrapper shrinks to image so overlay % match image coordinates */}
                  <div className="relative inline-block max-w-full bg-slate-900">
                    <img
                      src={customImage}
                      alt="Your room"
                      className="block max-h-[320px] w-auto max-w-full"
                    />
                    {regions.length > 0 ? (
                      <>
                        {/* Clickable overlay regions that highlight on select */}
                        {regions.map((reg) => {
                          const a = byLocus.get(reg.locus.toLowerCase())
                          const isSelected = selected?.locus.toLowerCase() === reg.locus.toLowerCase()
                          return (
                            <button
                              key={reg.locus}
                              type="button"
                              onClick={() => setSelected(a ?? null)}
                              className={`absolute rounded-md border-2 transition ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-400/25 ring-2 ring-amber-400'
                                  : 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/70 hover:bg-amber-500/15'
                              }`}
                              style={{
                                left: `${reg.left}%`,
                                top: `${reg.top}%`,
                                width: `${reg.width}%`,
                                height: `${reg.height}%`,
                              }}
                              title={a ? `${reg.locus}: ${a.item}` : reg.locus}
                            />
                          )
                        })}
                      </>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 border-t border-slate-700">
                    {loci.map((locus) => {
                      const a = byLocus.get(locus.toLowerCase())
                      const isSelected = selected?.locus.toLowerCase() === locus.toLowerCase()
                      return (
                        <button
                          key={locus}
                          type="button"
                          onClick={() => setSelected(a ?? null)}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                            isSelected
                              ? 'bg-amber-500 text-slate-900'
                              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          }`}
                        >
                          {locus}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : isTemplate ? (
                <>
                  {/* Template room SVG with clickable overlay */}
                  <div className="relative aspect-[400/280] w-full max-w-lg mx-auto">
                    <img
                      src="/room-template.svg"
                      alt="Template room"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    {TEMPLATE_LOCI.map((locus) => {
                      const a = byLocus.get(locus)
                      const spot = TEMPLATE_HOTSPOTS[locus]
                      if (!spot) return null
                      const isSelected = selected?.locus.toLowerCase() === locus.toLowerCase()
                      return (
                        <button
                          key={locus}
                          type="button"
                          onClick={() => setSelected(a ?? null)}
                          className={`absolute rounded border-2 transition ${
                            isSelected
                              ? 'border-amber-400 bg-amber-400/30'
                              : 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20'
                          }`}
                          style={{
                            left: `${spot.left}%`,
                            top: `${spot.top}%`,
                            width: `${spot.width}%`,
                            height: `${spot.height}%`,
                          }}
                          title={a ? `${locus}: ${a.item}` : locus}
                        />
                      )
                    })}
                  </div>
                </>
              ) : (
                /* Fallback: loci list only */
                <div className="flex flex-wrap gap-2 p-4">
                  {loci.map((locus) => {
                    const a = byLocus.get(locus.toLowerCase())
                    const isSelected = selected?.locus.toLowerCase() === locus.toLowerCase()
                    return (
                      <button
                        key={locus}
                        type="button"
                        onClick={() => setSelected(a ?? null)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${
                          isSelected ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                        }`}
                      >
                        {locus}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {selected && (
              <div className="mt-6 rounded-xl border border-amber-800/40 bg-slate-800/30 p-4">
                <p className="font-medium text-amber-200">{selected.locus}</p>
                <p className="mt-1 text-slate-200">{selected.item}</p>
                <p className="mt-2 text-slate-300 italic">&ldquo;{selected.sentence}&rdquo;</p>
                <button
                  type="button"
                  onClick={() =>
                    speakAsKeeper(`${selected.locus}. ${selected.item}. ${selected.sentence}.`)
                  }
                  className="mt-3 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
                  title="Hear the Keeper"
                >
                  ▶ Hear the Keeper
                </button>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3 no-print">
              <Link
                href="/broadcast"
                className="rounded-lg border border-amber-500 bg-amber-950/40 px-4 py-2 font-medium text-amber-200 hover:bg-amber-900/40"
              >
                ▶ Palace Radio
              </Link>
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
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
              >
                Print / Save as PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = typeof window !== 'undefined' ? window.location.origin : ''
                  const text = `Remind yourself to practice your Memory Palace tomorrow — spacing helps! ${url}`
                  navigator.clipboard.writeText(text).then(() => {
                    setRemindCopied(true)
                    setTimeout(() => setRemindCopied(false), 2500)
                  })
                }}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                {remindCopied ? 'Copied!' : 'Copy reminder for later'}
              </button>
            </div>
            <div className="mt-4 hidden print:block print:mt-0">
              <p className="text-sm text-slate-500">Memory Palace — memory-palace-app.vercel.app</p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
