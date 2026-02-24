import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// Token budget: cap per request so competition usage stays predictable.
// Set AI_MAX_TOKENS in Vercel (e.g. 512 or 1024). Default 512.
const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS ?? '512', 10)

const TEMPLATE_LOCI = ['door', 'desk', 'window', 'bed', 'shelf']

export type AssociationsBody = {
  topicOrList: string
  loci?: string[]
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not set' },
      { status: 500 }
    )
  }

  let body: AssociationsBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { topicOrList, loci = TEMPLATE_LOCI } = body
  if (!topicOrList?.trim()) {
    return NextResponse.json(
      { error: 'topicOrList is required' },
      { status: 400 }
    )
  }

  const openai = new OpenAI({ apiKey })
  const locusList = loci.slice(0, 8).join(', ')

  const prompt = `You are helping someone use the Memory Palace (Method of Loci). They want to remember: "${topicOrList}".

Use these locations as loci (in order): ${locusList}.

For each locus, provide one short, vivid association (one sentence). Make it visual, sensory, or silly so it's easy to recall. Output valid JSON only, in this exact shape:
{"associations":[{"locus":"...","item":"...","sentence":"..."}, ...]}

Match the number of associations to the number of loci. If the user gave a list, assign each list item to a locus. If they gave a topic, break it into that many key items and assign each to a locus.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 502 }
      )
    }

    const parsed = JSON.parse(raw) as { associations?: Array<{ locus: string; item: string; sentence: string }> }
    if (!Array.isArray(parsed.associations)) {
      return NextResponse.json(
        { error: 'Invalid AI response shape' },
        { status: 502 }
      )
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Associations API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI request failed' },
      { status: 500 }
    )
  }
}
