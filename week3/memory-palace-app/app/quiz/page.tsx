'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { speak } from '@/app/lib/tts'

type Association = { locus: string; item: string; sentence: string }

const CHALLENGE_SECONDS = 60

export default function QuizPage() {
  const [associations, setAssociations] = useState<Association[]>([])
  const [question, setQuestion] = useState<{ type: 'locus' | 'item'; locus: string; item: string; options: string[] } | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [challengeMode, setChallengeMode] = useState(false)
  const [challengeActive, setChallengeActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_SECONDS)
  const [challengeResult, setChallengeResult] = useState<{ correct: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const challengeCorrectRef = useRef(0)
  const [remindCopied, setRemindCopied] = useState(false)

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

  useEffect(() => {
    if (!question) return
    const opts = question.options
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (answered) {
        if (e.key === 'Enter') {
          e.preventDefault()
          pickQuestion()
        }
        return
      }
      const n = parseInt(e.key, 10)
      const choice = n >= 1 && n <= 4 ? opts[n - 1] : e.key === 'Enter' ? opts[0] : undefined
      if (choice) {
        e.preventDefault()
        handleAnswer(choice)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [question, answered])

  function handleAnswer(choice: string) {
    if (!question || answered) return
    setAnswered(true)
    const correct = question.type === 'locus' ? question.item : question.locus
    const isCorrect = choice === correct
    const msg = isCorrect
      ? `Correct! ${question.locus} → ${question.item}. Keep going — you're building the palace in your head.`
      : `Not quite. ${question.locus} was for ${question.item}.`
    setScore((s) => ({ ...s, total: s.total + 1, correct: s.correct + (isCorrect ? 1 : 0) }))
    setFeedback(msg)
    if (!challengeActive) speak(msg)
    if (challengeActive && isCorrect) challengeCorrectRef.current += 1
    if (challengeActive) {
      setTimeout(() => pickQuestion(), 600)
    }
  }

  function startChallenge() {
    setChallengeMode(true)
    setChallengeActive(true)
    setChallengeResult(null)
    setTimeLeft(CHALLENGE_SECONDS)
    challengeCorrectRef.current = 0
    setScore({ correct: 0, total: 0 })
    setQuestion(null)
    setFeedback(null)
    setAnswered(false)
    setTimeout(pickQuestion, 0)
  }

  useEffect(() => {
    if (!challengeActive || timeLeft <= 0) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setChallengeActive(false)
          setChallengeResult({ correct: challengeCorrectRef.current })
          setQuestion(null)
          setFeedback(null)
          setAnswered(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [challengeActive])

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
          {challengeActive ? (
            <p className="mt-2 text-lg font-semibold text-amber-300">
              ⏱ {timeLeft}s left — answer fast!
            </p>
          ) : challengeResult !== null ? (
            <p className="mt-2 text-lg font-semibold text-amber-200">
              Challenge over! You got {challengeResult.correct} correct in {CHALLENGE_SECONDS} seconds.
            </p>
          ) : (
            <p className="mt-1 text-slate-400">
              Score: {score.correct} / {score.total}
            </p>
          )}
          <p className="mt-0.5 text-xs text-slate-500">
            Recalling by location strengthens the memory.
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            Shortcuts: 1–4 to answer, Enter for next.
          </p>
          {!challengeMode && !challengeActive && (
            <button
              type="button"
              onClick={startChallenge}
              className="mt-3 rounded-lg border border-amber-500 bg-amber-950/40 px-3 py-1.5 text-sm font-medium text-amber-200 hover:bg-amber-900/40"
            >
              60-second challenge
            </button>
          )}
          {challengeResult !== null && (
            <button
              type="button"
              onClick={() => {
                setChallengeResult(null)
                setChallengeMode(false)
                setScore({ correct: 0, total: 0 })
                setQuestion(null)
                setTimeout(pickQuestion, 0)
              }}
              className="mt-3 rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              Back to normal quiz
            </button>
          )}
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
            className="mt-2 text-xs text-slate-500 hover:text-amber-400"
          >
            {remindCopied ? 'Copied reminder!' : 'Copy reminder for later'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {challengeResult !== null && !challengeActive && (
          <div className="mb-6 rounded-xl border border-amber-700/40 bg-amber-950/20 p-4 text-center">
            <p className="text-amber-200">Nice run! Spacing out practice (e.g. again tomorrow) helps long-term retention.</p>
            <button
              type="button"
              onClick={startChallenge}
              className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-500"
            >
              Try challenge again
            </button>
          </div>
        )}
        {question && !challengeResult && (
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
            {answered && !challengeActive && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={pickQuestion}
                  className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-slate-900 hover:bg-amber-500"
                >
                  Next question
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScore({ correct: 0, total: 0 })
                    setQuestion(null)
                    setFeedback(null)
                    setAnswered(false)
                    setTimeout(pickQuestion, 0)
                  }}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Practice again (reset score)
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
