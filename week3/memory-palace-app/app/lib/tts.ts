/**
 * Browser Text-to-Speech. Use after a user gesture (click) for best support.
 * Palace Radio: sequential queue + Keeper voice for broadcast.
 */
let currentUtterance: SpeechSynthesisUtterance | null = null
let queueAborted = false

const KEEPER_RATE = 0.92

export function speak(text: string, options?: { rate?: number; voice?: SpeechSynthesisVoice | null }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  queueAborted = true
  const u = new SpeechSynthesisUtterance(text)
  u.rate = options?.rate ?? KEEPER_RATE
  u.lang = 'en-US'
  if (options?.voice) u.voice = options.voice
  currentUtterance = u
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  queueAborted = true
  currentUtterance = null
}

/**
 * Speak lines one after another (Keeper broadcast). Calls onDone when finished or when stopped.
 */
export function speakSequence(
  lines: string[],
  options?: {
    rate?: number
    voice?: SpeechSynthesisVoice | null
    onDone?: () => void
  }
) {
  if (typeof window === 'undefined' || !window.speechSynthesis || lines.length === 0) {
    options?.onDone?.()
    return
  }
  window.speechSynthesis.cancel()
  queueAborted = false
  const rate = options?.rate ?? KEEPER_RATE
  const voice = options?.voice ?? null
  let index = 0

  function speakNext() {
    if (queueAborted || index >= lines.length) {
      options?.onDone?.()
      return
    }
    const text = lines[index]
    index += 1
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate
    u.lang = 'en-US'
    if (voice) u.voice = voice
    currentUtterance = u
    u.onend = () => speakNext()
    u.onerror = () => speakNext()
    window.speechSynthesis.speak(u)
  }

  speakNext()
}

/** Pick a consistent "Keeper" voice for Palace Radio. Call after user gesture (e.g. on broadcast page). */
export function getKeeperVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Karen'))
  )
  const en = voices.find((v) => v.lang.startsWith('en'))
  return preferred ?? en ?? voices[0]
}

/** Use with Keeper styling (rate + optional voice). For single-line "Hear the Keeper" buttons. */
export function speakAsKeeper(text: string, voice?: SpeechSynthesisVoice | null) {
  speak(text, { rate: KEEPER_RATE, voice: voice ?? getKeeperVoice() })
}

/**
 * Speak one line and call onEnd when done. Does not cancel other speech — for use in custom sequences (e.g. spatial).
 */
export function speakWithEnd(
  text: string,
  options: { rate?: number; voice?: SpeechSynthesisVoice | null },
  onEnd: () => void
) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd()
    return
  }
  const u = new SpeechSynthesisUtterance(text)
  u.rate = options?.rate ?? KEEPER_RATE
  u.lang = 'en-US'
  if (options?.voice) u.voice = options.voice
  u.onend = () => onEnd()
  u.onerror = () => onEnd()
  window.speechSynthesis.speak(u)
}
