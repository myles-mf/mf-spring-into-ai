'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadPalace } from '@/app/lib/palace'
import { speakSequence, stopSpeaking, getKeeperVoice } from '@/app/lib/tts'
import {
  playSpatialSequence,
  stopSpatialPlayback,
  LOCUS_POSITIONS,
  CENTER,
  type SpatialScriptItem,
} from '@/app/lib/spatial-audio'
import { encodeBroadcast, type DecoderEntry } from '@/app/lib/cipher'

type BroadcastMode = 'plain' | 'cipher'

function BroadcastPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [palace, setPalace] = useState<ReturnType<typeof loadPalace>>(null)
  const [playing, setPlaying] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [spatial, setSpatial] = useState(false)
  const [mode, setMode] = useState<BroadcastMode>('plain')
  const [decoder, setDecoder] = useState<DecoderEntry[]>([])
  const [decoderOpen, setDecoderOpen] = useState(true)

  const [autoStart, setAutoStart] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const encoded = searchParams.get('p')
    if (encoded) {
      try {
        const json = atob(decodeURIComponent(encoded))
        const data = JSON.parse(json) as { associations: { locus: string; item: string; sentence: string }[]; loci: string[] }
        if (data.associations?.length && data.loci?.length) {
          sessionStorage.setItem('memory-palace-associations', JSON.stringify(data.associations))
          sessionStorage.setItem('memory-palace-loci', JSON.stringify(data.loci))
          setPalace(loadPalace())
          setMode(searchParams.get('mode') === 'cipher' ? 'cipher' : 'plain')
          setAutoStart(searchParams.get('auto') === '1')
          return
        }
      } catch (_) {
        /* invalid payload */
      }
    }
    const p = loadPalace()
    setPalace(p)
    if (!p || !p.associations?.length) {
      router.replace('/create')
    }
  }, [router, searchParams])

  useEffect(() => {
    if (!autoStart || !palace?.associations?.length) return
    setAutoStart(false)
    setCompleted(false)
    setPlaying(true)
    const onDone = () => {
      setPlaying(false)
      setCompleted(true)
    }
    if (mode === 'cipher') {
      const { spoken, decoder: dec } = encodeBroadcast(palace.associations)
      setDecoder(dec)
      if (spatial) {
        const items: SpatialScriptItem[] = [
          { line: spoken[0], position: CENTER },
          ...palace.associations.map((a, i) => ({
            line: spoken[i + 1],
            position: LOCUS_POSITIONS[a.locus.toLowerCase()] ?? CENTER,
          })),
          { line: spoken[spoken.length - 1], position: CENTER },
        ]
        playSpatialSequence(items, { onDone })
      } else {
        speakSequence(spoken, { rate: 0.92, voice: getKeeperVoice(), onDone })
      }
      return
    }
    const intro = "You're listening to the Voice of the Palace. Let's walk the room."
    const locusLines = palace.associations.map((a) => `At the ${a.locus}. ${a.sentence}.`)
    const outro = "That was the Palace. Return when you're ready to quiz."
    if (spatial) {
      const introItem: SpatialScriptItem = { line: intro, position: CENTER }
      const locusItems: SpatialScriptItem[] = palace.associations.map((a) => ({
        line: `At the ${a.locus}. ${a.sentence}.`,
        position: LOCUS_POSITIONS[a.locus.toLowerCase()] ?? CENTER,
      }))
      const outroItem: SpatialScriptItem = { line: outro, position: CENTER }
      playSpatialSequence([introItem, ...locusItems, outroItem], { onDone })
    } else {
      speakSequence([intro, ...locusLines, outro], { rate: 0.92, voice: getKeeperVoice(), onDone })
    }
  }, [autoStart, palace, spatial, mode])

  const done = () => {
    setPlaying(false)
    setCompleted(true)
  }

  function startBroadcast() {
    if (!palace?.associations?.length) return
    setCompleted(false)
    setPlaying(true)

    if (mode === 'cipher') {
      const { spoken, decoder: dec } = encodeBroadcast(palace.associations)
      setDecoder(dec)
      if (spatial) {
        const items: SpatialScriptItem[] = [
          { line: spoken[0], position: CENTER },
          ...palace.associations.map((a, i) => ({
            line: spoken[i + 1],
            position: LOCUS_POSITIONS[a.locus.toLowerCase()] ?? CENTER,
          })),
          { line: spoken[spoken.length - 1], position: CENTER },
        ]
        playSpatialSequence(items, { onDone: done })
      } else {
        speakSequence(spoken, { rate: 0.92, voice: getKeeperVoice(), onDone: done })
      }
      return
    }

    const intro = "You're listening to the Voice of the Palace. Let's walk the room."
    const locusLines = palace.associations.map(
      (a) => `At the ${a.locus}. ${a.sentence}.`
    )
    const outro = "That was the Palace. Return when you're ready to quiz."

    if (spatial) {
      const introItem: SpatialScriptItem = { line: intro, position: CENTER }
      const locusItems: SpatialScriptItem[] = palace.associations.map((a) => ({
        line: `At the ${a.locus}. ${a.sentence}.`,
        position: LOCUS_POSITIONS[a.locus.toLowerCase()] ?? CENTER,
      }))
      const outroItem: SpatialScriptItem = { line: outro, position: CENTER }
      playSpatialSequence([introItem, ...locusItems, outroItem], { onDone: done })
    } else {
      const script = [intro, ...locusLines, outro]
      speakSequence(script, {
        rate: 0.92,
        voice: getKeeperVoice(),
        onDone: done,
      })
    }
  }

  function stopBroadcast() {
    if (spatial) stopSpatialPlayback()
    else stopSpeaking()
    setPlaying(false)
  }

  if (!palace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading…</p>
      </div>
    )
  }

  if (!palace.associations?.length) {
    return null
  }

  function copyBroadcastLink() {
    if (!palace) return
    const payload = { associations: palace.associations, loci: palace.loci }
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
    let url = `${window.location.origin}/broadcast?p=${encodeURIComponent(encoded)}`
    if (mode === 'cipher') url += '&mode=cipher'
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  const decoderEntries = mode === 'cipher' && palace?.associations?.length
    ? encodeBroadcast(palace.associations).decoder
    : decoder

  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-900/50 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-amber-400">
            ← Memory Palace
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-amber-100">Palace Radio</h1>
          <p className="mt-1 text-slate-400">
            Tune in. The Voice of the Palace will guide you through every locus.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-xl border border-amber-800/40 bg-slate-900/50 p-8 text-center">
          {!playing && !completed && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
                <div className="flex rounded-lg border border-slate-600 p-0.5">
                  <button
                    type="button"
                    onClick={() => setMode('plain')}
                    className={`px-3 py-1.5 text-sm rounded-md transition ${mode === 'plain' ? 'bg-amber-600 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Plain
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('cipher')}
                    className={`px-3 py-1.5 text-sm rounded-md transition ${mode === 'cipher' ? 'bg-amber-600 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Cipher (numbers station)
                  </button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={spatial}
                    onChange={(e) => setSpatial(e.target.checked)}
                    className="rounded border-slate-600"
                  />
                  <span className="text-slate-300 text-sm">Spatial audio (headphones)</span>
                </label>
              </div>
              <p className="text-slate-300 mb-6">
                One broadcast. Intro, then each spot in order, then outro.
                {mode === 'cipher' && ' In cipher mode the Keeper speaks in code; use the decoder below.'}
                {spatial && ' With spatial: a tone from each direction before the line.'}
              </p>
              <button
                type="button"
                onClick={startBroadcast}
                className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-slate-900 hover:bg-amber-500 transition"
              >
                ▶ Start Palace Radio
              </button>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={copyBroadcastLink}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition"
                >
                  {linkCopied ? 'Copied!' : 'Copy broadcast link'}
                </button>
                <p className="mt-2 text-xs text-slate-500">
                  Share the link — anyone can load this palace and play the tour.
                  {mode === 'cipher' && ' Link includes cipher mode.'}
                </p>
              </div>
              {mode === 'cipher' && decoderEntries.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700 text-left">
                  <button
                    type="button"
                    onClick={() => setDecoderOpen(!decoderOpen)}
                    className="text-sm font-medium text-amber-200 hover:text-amber-100"
                  >
                    {decoderOpen ? '▼' : '▶'} Decoder
                  </button>
                  {decoderOpen && (
                    <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="px-3 py-2 text-left text-slate-400 font-medium">Code</th>
                            <th className="px-3 py-2 text-left text-slate-400 font-medium">Locus</th>
                            <th className="px-3 py-2 text-left text-slate-400 font-medium">Item</th>
                          </tr>
                        </thead>
                        <tbody>
                          {decoderEntries.map((d, i) => (
                            <tr key={i} className="border-b border-slate-700/50 last:border-0">
                              <td className="px-3 py-2 text-amber-300 font-mono">{d.code}</td>
                              <td className="px-3 py-2 text-slate-300 capitalize">{d.locus}</td>
                              <td className="px-3 py-2 text-slate-200">{d.item}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {playing && (
            <>
              <p className="text-amber-200 font-medium mb-4">Playing…</p>
              <button
                type="button"
                onClick={stopBroadcast}
                className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800 transition"
              >
                Stop
              </button>
            </>
          )}
          {completed && !playing && (
            <>
              <p className="text-amber-200 font-medium mb-2">Tour complete.</p>
              <p className="text-slate-400 text-sm mb-6">
                Explore the room or take the quiz.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/explore"
                  className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500"
                >
                  Explore
                </Link>
                <Link
                  href="/quiz"
                  className="rounded-lg border border-amber-600 px-4 py-2 font-medium text-amber-200 hover:bg-amber-900/30"
                >
                  Quiz
                </Link>
                <button
                  type="button"
                  onClick={startBroadcast}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
                >
                  Play again
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Week 4: Soundwave — one voice, one signal.
        </p>
      </main>
    </div>
  )
}

export default function BroadcastPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <p className="text-slate-400">Loading…</p>
        </div>
      }
    >
      <BroadcastPageContent />
    </Suspense>
  )
}
