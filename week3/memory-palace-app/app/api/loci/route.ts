import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS ?? '512', 10)

export type LocusRegion = { locus: string; left: number; top: number; width: number; height: number }

/** POST { image: "data:image/jpeg;base64,..." } => { loci: string[], regions?: LocusRegion[] } */
export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 })
  }

  let body: { image?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const dataUrl = body.image?.trim()
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return NextResponse.json({ error: 'image (data URL) is required' }, { status: 400 })
  }

  const openai = new OpenAI({ apiKey })
  const prompt = `Look at this room image. Identify 4 to 6 distinct objects or areas that would work as memory "loci" (places to attach memories): e.g. door, desk, window, bed, shelf, chair, lamp, table, bookshelf. Use short lowercase labels.

For each locus, estimate where it appears in the image as a percentage of the image size (0-100). "left" and "top" are the top-left corner; "width" and "height" are the size of the bounding box. Return valid JSON only in this exact shape:
{"loci": ["label1", "label2", ...], "regions": [{"locus": "label1", "left": 10, "top": 20, "width": 25, "height": 30}, ...]}
Every locus must have one region. Keep regions inside 0-100.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 502 })
    }

    const parsed = JSON.parse(raw) as {
      loci?: string[]
      regions?: Array<{ locus: string; left?: number; top?: number; width?: number; height?: number }>
    }
    const loci = Array.isArray(parsed.loci) ? parsed.loci : []
    if (loci.length === 0) {
      return NextResponse.json({ error: 'No loci detected' }, { status: 502 })
    }

    const normalizedLoci = loci.slice(0, 8).map((l) => String(l).toLowerCase().trim())
    const rawRegions = Array.isArray(parsed.regions) ? parsed.regions : []
    const byLocus = new Map(rawRegions.map((r) => [String(r.locus).toLowerCase().trim(), r]))
    const regions: LocusRegion[] = normalizedLoci
      .map((locus) => {
        const r = byLocus.get(locus)
        if (!r) return null
        const left = clamp(Number(r.left), 0, 100)
        const top = clamp(Number(r.top), 0, 100)
        const width = clamp(Number(r.width), 5, 100)
        const height = clamp(Number(r.height), 5, 100)
        if (Number.isNaN(left) || Number.isNaN(top) || Number.isNaN(width) || Number.isNaN(height))
          return null
        return { locus, left, top, width, height }
      })
      .filter((r): r is LocusRegion => r !== null)

    return NextResponse.json(
      regions.length === normalizedLoci.length ? { loci: normalizedLoci, regions } : { loci: normalizedLoci }
    )
  } catch (err) {
    console.error('Loci API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Vision request failed' },
      { status: 500 }
    )
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
