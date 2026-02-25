/**
 * Loci and palace state. Template room has fixed hotspots; custom room uses same keys for sessionStorage.
 */
export const TEMPLATE_LOCI = ['door', 'desk', 'window', 'bed', 'shelf'] as const

/** Hotspot positions as % of image (for template room SVG). Order: door, desk, window, bed, shelf */
export const TEMPLATE_HOTSPOTS: Record<string, { left: number; top: number; width: number; height: number }> = {
  door: { left: 5, top: 43, width: 18, height: 36 },
  window: { left: 37, top: 9, width: 25, height: 23 },
  desk: { left: 70, top: 36, width: 24, height: 27 },
  bed: { left: 6, top: 70, width: 28, height: 25 },
  shelf: { left: 65, top: 70, width: 30, height: 16 },
}

export type Association = { locus: string; item: string; sentence: string }

/** Bounding box as % of image (0-100) for highlighting a locus in a photo */
export type LocusRegion = { locus: string; left: number; top: number; width: number; height: number }

export type PalaceState = {
  associations: Association[]
  loci: string[]
  /** base64 data URL if user uploaded their room */
  imageDataUrl?: string
  /** Where each locus is in the image (for custom room highlight) */
  regions?: LocusRegion[]
}

const KEY_ASSOCIATIONS = 'memory-palace-associations'
const KEY_LOCI = 'memory-palace-loci'
const KEY_IMAGE = 'memory-palace-image'
const KEY_REGIONS = 'memory-palace-regions'

export function savePalace(state: PalaceState) {
  try {
    sessionStorage.setItem(KEY_ASSOCIATIONS, JSON.stringify(state.associations))
    sessionStorage.setItem(KEY_LOCI, JSON.stringify(state.loci))
    if (state.imageDataUrl) sessionStorage.setItem(KEY_IMAGE, state.imageDataUrl)
    else sessionStorage.removeItem(KEY_IMAGE)
    if (state.regions?.length) sessionStorage.setItem(KEY_REGIONS, JSON.stringify(state.regions))
    else sessionStorage.removeItem(KEY_REGIONS)
  } catch (_) {}
}

export function loadPalace(): PalaceState | null {
  try {
    const rawA = sessionStorage.getItem(KEY_ASSOCIATIONS)
    const rawL = sessionStorage.getItem(KEY_LOCI)
    if (!rawA || !rawL) return null
    const associations = JSON.parse(rawA) as Association[]
    const loci = JSON.parse(rawL) as string[]
    if (!Array.isArray(associations) || !Array.isArray(loci)) return null
    const imageDataUrl = sessionStorage.getItem(KEY_IMAGE) ?? undefined
    const rawR = sessionStorage.getItem(KEY_REGIONS)
    const regions = rawR ? (JSON.parse(rawR) as LocusRegion[]) : undefined
    return { associations, loci, imageDataUrl, regions }
  } catch (_) {
    return null
  }
}
