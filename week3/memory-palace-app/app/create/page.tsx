'use client'

import { useState } from 'react'
import Link from 'next/link'

const TEMPLATE_LOCI = ['door', 'desk', 'window', 'bed', 'shelf']

type Association = { locus: string; item: string; sentence: string }

export default function CreatePage() {
  const [topicOrList, setTopicOrList] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [associations, setAssociations] = useState<Association[] | null>(null)

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
          loci: TEMPLATE_LOCI,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || res.statusText)
      const list = data.associations ?? []
      setAssociations(list)
      try {
        sessionStorage.setItem('memory-palace-associations', JSON.stringify(list))
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
            We’ll use a template room: door, desk, window, bed, shelf.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-300">
              What do you want to remember?
            </label>
            <p className="mt-1 text-xs text-slate-500">
              A topic (e.g. “quadratic formula”) or a short list (e.g. “apple, ball, cat, dog, egg”).
            </p>
            <textarea
              id="topic"
              value={topicOrList}
              onChange={(e) => setTopicOrList(e.target.value)}
              placeholder="e.g. first 5 elements of the periodic table"
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !topicOrList.trim()}
            className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate associations'}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {associations && associations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-amber-100">Your associations</h2>
            <p className="mt-1 text-sm text-slate-400">
              Walk through each spot in your mind, or go to Explore to see them on the room.
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
            <div className="mt-6 flex gap-3">
              <Link
                href="/explore"
                className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500"
              >
                Explore the room
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAssociations(null)
                  setTopicOrList('')
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
