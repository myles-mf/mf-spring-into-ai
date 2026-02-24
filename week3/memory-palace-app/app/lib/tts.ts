/**
 * Browser Text-to-Speech. Use after a user gesture (click) for best support.
 */
let currentUtterance: SpeechSynthesisUtterance | null = null

export function speak(text: string, options?: { rate?: number }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = options?.rate ?? 1
  u.lang = 'en-US'
  currentUtterance = u
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  currentUtterance = null
}
