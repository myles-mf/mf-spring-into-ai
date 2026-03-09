/**
 * Spatial audio for Palace Radio: a short tone at each locus position before the spoken line.
 * Listener at origin; sources at fixed positions (door left, window right, etc.).
 * Use with headphones for best effect.
 */
import { speakWithEnd, stopSpeaking, getKeeperVoice } from './tts'

/** Locus name (lowercase) -> [x, y, z]. x: -1 left, +1 right. z: +1 front, -1 back. y: 0. */
export const LOCUS_POSITIONS: Record<string, [number, number, number]> = {
  door: [-1, 0, 0.5],
  desk: [0, 0, 1],
  window: [1, 0, 0.5],
  bed: [-0.7, 0, -0.5],
  shelf: [0.7, 0, -0.5],
}

/** Center position for intro/outro (no directional cue). */
export const CENTER: [number, number, number] = [0, 0, 0]

let audioContext: AudioContext | null = null
let spatialAborted = false

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioContext) audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return audioContext
}

/**
 * Play a short soft tone at the given position (for spatial cue), then call onEnd.
 */
export function playToneAtPosition(
  position: [number, number, number],
  durationMs: number,
  onEnd: () => void
): void {
  const ctx = getContext()
  if (!ctx) {
    onEnd()
    return
  }
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const panner = ctx.createPanner()
  panner.panningModel = 'HRTF'
  panner.distanceModel = 'inverse'
  panner.refDistance = 1
  panner.maxDistance = 10
  panner.setPosition(position[0], position[1], position[2])
  osc.type = 'sine'
  osc.frequency.setValueAtTime(220, ctx.currentTime)
  osc.connect(gain)
  gain.connect(panner)
  panner.connect(ctx.destination)
  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + durationMs / 1000)
  setTimeout(onEnd, durationMs + 50)
}

export type SpatialScriptItem = { line: string; position: [number, number, number] }

/**
 * Play a sequence: for each item, play tone at position then speak line. Calls onDone when all complete or when stopped.
 */
export function playSpatialSequence(
  items: SpatialScriptItem[],
  options?: { onDone?: () => void }
): void {
  if (items.length === 0) {
    options?.onDone?.()
    return
  }
  spatialAborted = false
  const voice = getKeeperVoice()
  let index = 0

  function next() {
    if (spatialAborted || index >= items.length) {
      options?.onDone?.()
      return
    }
    const item = items[index]
    index += 1
    playToneAtPosition(item.position, 280, () => {
      if (spatialAborted) {
        options?.onDone?.()
        return
      }
      speakWithEnd(
        item.line,
        { rate: 0.92, voice },
        () => {
          if (spatialAborted) {
            options?.onDone?.()
            return
          }
          next()
        }
      )
    })
  }

  next()
}

export function stopSpatialPlayback(): void {
  spatialAborted = true
  stopSpeaking()
}
