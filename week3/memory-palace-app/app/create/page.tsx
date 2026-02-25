'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { TEMPLATE_LOCI, type LocusRegion } from '@/app/lib/palace'

type Association = { locus: string; item: string; sentence: string }

type Step = 'choose' | 'topic' | 'done'

function CreatePageContent() {
  const [step, setStep] = useState<Step>('choose')
  const [useTemplate, setUseTemplate] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [loci, setLoci] = useState<string[]>([...TEMPLATE_LOCI])
  const [regions, setRegions] = useState<LocusRegion[]>([])
  const [lociLoading, setLociLoading] = useState(false)
  const [lociError, setLociError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [topicOrList, setTopicOrList] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [associations, setAssociations] = useState<Association[] | null>(null)
  const [copied, setCopied] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const tryTopic = searchParams.get('try')
    if (tryTopic && typeof tryTopic === 'string') setTopicOrList(decodeURIComponent(tryTopic).trim())
  }, [searchParams])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setLociError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setUploadedImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  async function analyzeRoom() {
    if (!uploadedImage) return
    setLociLoading(true)
    setLociError(null)
    try {
      const res = await fetch('/api/loci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadedImage }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || res.statusText)
      setLoci(data.loci ?? [])
      setRegions(Array.isArray(data.regions) ? data.regions : [])
      setUseTemplate(false)
      setStep('topic')
    } catch (err) {
      setLociError(err instanceof Error ? err.message : 'Could not analyze room')
    } finally {
      setLociLoading(false)
    }
  }

  function chooseTemplate() {
    setUseTemplate(true)
    setUploadedImage(null)
    setLoci([...TEMPLATE_LOCI])
    setRegions([])
    setStep('topic')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!topicOrList.trim()) return
    setLoading(true)
    setError(null)
    setAssociations(null)
    try {
      const res = await fetch('/api/associations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrList: topicOrList.trim(),
          loci,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || res.statusText)
      const list = data.associations ?? []
      setAssociations(list)
      try {
        const { savePalace } = await import('@/app/lib/palace')
        savePalace({
          associations: list,
          loci,
          imageDataUrl: useTemplate ? undefined : uploadedImage ?? undefined,
          regions: useTemplate ? undefined : regions.length ? regions : undefined,
        })
      } catch (_) {}
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-900/50 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-amber-400">
            ← Memory Palace
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-amber-100">Create your palace</h1>
          <p className="mt-1 text-slate-400">
            {step === 'choose' && 'Use a template room or upload a photo of your room.'}
            {step === 'topic' && (useTemplate ? 'You’ll walk through 5 spots. What do you want to remember?' : `Your room’s spots: ${loci.join(', ')}`)}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {step === 'choose' && (
          <div className="space-y-6">
            <p className="text-slate-400 text-sm">
              Pick a space — template is instant; your room uses a photo so the palace is personally meaningful.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={chooseTemplate}
                className="rounded-xl border-2 border-amber-600 bg-amber-950/30 p-6 text-left transition hover:border-amber-500 hover:bg-amber-900/20"
              >
                <div className="flex gap-4">
                  <img
                    src="/room-template.svg"
                    alt=""
                    className="w-24 h-16 object-cover rounded-lg border border-slate-700 shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-amber-200">Use template room</span>
                    <p className="mt-2 text-sm text-slate-400">
                      Five spots: door, desk, window, bed, shelf. No upload — try the technique in under a minute.
                    </p>
                  </div>
                </div>
              </button>
              <div className="rounded-xl border-2 border-slate-600 bg-slate-800/30 p-6">
                <span className="font-semibold text-slate-200">Use my room</span>
                <p className="mt-2 text-sm text-slate-400">
                  Upload a photo; AI will suggest spots (loci) in your space.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-3 block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-600 file:px-3 file:py-1.5 file:text-slate-900"
                />
                {uploadedImage && (
                  <div className="mt-3">
                    <img
                      src={uploadedImage}
                      alt="Your room"
                      className="max-h-32 rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={analyzeRoom}
                      disabled={lociLoading}
                      className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-amber-500 disabled:opacity-50"
                    >
                      {lociLoading ? 'Analyzing…' : 'Analyze room'}
                    </button>
                  </div>
                )}
                {lociError && (
                  <p className="mt-2 text-sm text-red-400">{lociError}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'topic' && (
          <>
            <div className="mb-6 flex items-center justify-between gap-2 text-sm text-slate-500">
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="text-amber-400 hover:underline"
              >
                ← Change room
              </button>
              <Link href="/" className="text-slate-500 hover:text-slate-400">
                What’s the Memory Palace?
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-300">
                  What do you want to remember?
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  {useTemplate
                    ? 'A topic (e.g. quadratic formula) or a list of 5 items — we’ll put one at each spot in the room.'
                    : 'A topic or a short list. We’ll assign each item to a spot in your room.'}
                </p>
                <p className="mt-2 text-xs text-slate-500">Try one:</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {[
                    'first 5 elements of the periodic table',
                    'quadratic formula',
                    'five Spanish words for colors',
                  ].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setTopicOrList(example)}
                      className="rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:border-slate-500"
                    >
                      {example}
                    </button>
                  ))}
                </div>
                <textarea
                  id="topic"
                  value={topicOrList}
                  onChange={(e) => setTopicOrList(e.target.value)}
                  placeholder="e.g. first 5 elements of the periodic table"
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  disabled={loading}
                />
                {topicOrList.trim() && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = new URL(window.location.href)
                        url.searchParams.set('try', topicOrList.trim())
                        navigator.clipboard.writeText(url.toString())
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      {copied ? 'Copied!' : 'Copy link so someone else can try this topic'}
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !topicOrList.trim()}
                className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500 disabled:opacity-50"
              >
                {loading ? 'Generating…' : 'Generate associations'}
              </button>
            </form>
          </>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {associations && associations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-amber-100">Your associations</h2>
            <p className="mt-1 text-sm text-slate-400">
              Go to Explore to see them on the room.
            </p>
            <ul className="mt-4 space-y-4">
              {associations.map((a, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-amber-800/40 bg-slate-800/30 p-4"
                >
                  <span className="font-medium text-amber-300">{a.locus}</span>
                  <span className="text-slate-400"> → </span>
                  <span className="text-slate-200">{a.item}</span>
                  <p className="mt-2 text-sm text-slate-300 italic">&ldquo;{a.sentence}&rdquo;</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Explore to walk through the room, or jump straight to the quiz.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500"
              >
                Explore the room
              </Link>
              <Link
                href="/quiz"
                className="rounded-lg border border-amber-600 px-4 py-2 font-medium text-amber-200 hover:bg-amber-900/30"
              >
                Jump to quiz
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAssociations(null)
                  setTopicOrList('')
                  setStep('choose')
                }}
                className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
              >
                Create another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function CreatePageFallback() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-900/50 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-amber-400">
            ← Memory Palace
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-amber-100">Create your palace</h1>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 text-slate-400">Loading…</main>
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={<CreatePageFallback />}>
      <CreatePageContent />
    </Suspense>
  )
}
