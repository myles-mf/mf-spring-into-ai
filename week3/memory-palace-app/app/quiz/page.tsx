'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { speak } from '@/app/lib/tts'

type Association = { locus: string; item: string; sentence: string }

export default function QuizPage() {
  const [associations, setAssociations] = useState<Association[]>([])
  const [question, setQuestion] = useState<{ type: 'locus' | 'item'; locus: string; item: string; options: string[] } | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('memory-palace-associations')
      if (raw) {
        const list = JSON.parse(raw) as Association[]
        if (Array.isArray(list) && list.length > 0) setAssociations(list)
      }
    } catch (_) {}
  }, [])

  function pickQuestion() {
    if (associations.length === 0) return
    const a = associations[Math.floor(Math.random() * associations.length)]
    const type: 'locus' | 'item' = Math.random() < 0.5 ? 'locus' : 'item'
    // "What's at [locus]?" → options are items; "Where is [item]?" → options are loci
    const wrong = associations
      .filter((x) => (type === 'locus' ? x.locus !== a.locus : x.item !== a.item))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => (type === 'locus' ? x.item : x.locus))
    const correctOption = type === 'locus' ? a.item : a.locus
    const options = [correctOption, ...wrong].sort(() => Math.random() - 0.5)
    setQuestion({ type, locus: a.locus, item: a.item, options })
    setFeedback(null)
    setAnswered(false)
  }

  useEffect(() => {
    if (associations.length > 0 && !question) pickQuestion()
  }, [associations])

  function handleAnswer(choice: string) {
    if (!question || answered) return
    setAnswered(true)
    const correct = question.type === 'locus' ? question.item : question.locus
    const isCorrect = choice === correct
    const msg = isCorrect ? `Correct! ${question.locus} → ${question.item}.` : `Not quite. ${question.locus} was for ${question.item}.`
    setScore((s) => ({ ...s, total: s.total + 1, correct: s.correct + (isCorrect ? 1 : 0) }))
    setFeedback(msg)
    speak(msg)
  }

  if (associations.length === 0) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-800/30 p-6 text-center text-slate-400">
          <p>Create and explore a palace first, then come back to quiz.</p>
          <Link href="/create" className="mt-4 inline-block text-amber-400 hover:underline">
            Create your palace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-900/50 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-amber-400">
            ← Memory Palace
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-amber-100">Quiz</h1>
          <p className="mt-1 text-slate-400">
            Score: {score.correct} / {score.total}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {question && (
          <>
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg text-slate-200">
                {question.type === 'locus'
                  ? `What did we put at the ${question.locus}?`
                  : `Where did we put "${question.item}"?`}
              </p>
              <button
                type="button"
                onClick={() =>
                  speak(
                    question.type === 'locus'
                      ? `What did we put at the ${question.locus}?`
                      : `Where did we put "${question.item}"?`
                  )
                }
                className="shrink-0 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
                title="Read question aloud"
              >
                🔊 Read aloud
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {question.options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => handleAnswer(opt)}
                    disabled={answered}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-left text-slate-200 hover:bg-slate-700 disabled:opacity-70"
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
            {feedback && (
              <p className="mt-4 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-200">
                {feedback}
              </p>
            )}
            {answered && (
              <button
                type="button"
                onClick={pickQuestion}
                className="mt-4 rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500"
              >
                Next question
              </button>
            )}
          </>
        )}
      </main>
    </div>
  )
}
