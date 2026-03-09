/**
 * Numbers station / cipher mode for Palace Radio.
 * Locus = NATO call sign (Alpha, Bravo, ...). Item = first letters as numbers (A=1 … Z=26).
 */
import type { Association } from './palace'

const LOCUS_CALL_SIGNS: Record<string, string> = {
  door: 'Alpha',
  desk: 'Bravo',
  window: 'Charlie',
  bed: 'Delta',
  shelf: 'Echo',
}

const NUMBER_WORDS: Record<number, string> = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
  16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
  21: 'Twenty-one', 22: 'Twenty-two', 23: 'Twenty-three', 24: 'Twenty-four',
  25: 'Twenty-five', 26: 'Twenty-six',
}

function getCallSign(locus: string): string {
  return LOCUS_CALL_SIGNS[locus.toLowerCase()] ?? locus
}

/** Encode first few characters of item as numbers (A=1 … Z=26), max 4 numbers. */
function itemToNumberPhrase(item: string): string {
  const cleaned = item.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4)
  if (!cleaned) return 'Zero'
  const numbers = cleaned.split('').map((c) => c.charCodeAt(0) - 64).filter((n) => n >= 1 && n <= 26)
  if (numbers.length === 0) return 'Zero'
  return numbers.map((n) => NUMBER_WORDS[n] ?? String(n)).join('. ')
}

export type DecoderEntry = { code: string; locus: string; item: string }

export type CipherBroadcast = {
  spoken: string[]
  decoder: DecoderEntry[]
}

/**
 * Encode a full broadcast for numbers-station mode.
 * Intro/outro stay plain; each locus is spoken as call sign + number phrase.
 */
export function encodeBroadcast(associations: Association[]): CipherBroadcast {
  const intro = 'Numbers station. Decode the following.'
  const locusLines = associations.map((a) => {
    const callSign = getCallSign(a.locus)
    const phrase = itemToNumberPhrase(a.item)
    return `${callSign}. ${phrase}.`
  })
  const outro = 'End of transmission.'
  const spoken = [intro, ...locusLines, outro]
  const decoder: DecoderEntry[] = associations.map((a) => ({
    code: getCallSign(a.locus),
    locus: a.locus,
    item: a.item,
  }))
  return { spoken, decoder }
}
