# Week 4: Soundwave (Final Week)

**Theme:** Soundwave — transmission, signal, identity through sound.

Not just “sound wave” (audio/waveform/signal processing). **Soundwave** as in: the Decepticon. Controlled signal. Voice that transmits identity. Something that doesn’t just produce sound but uses sound as atmosphere, instruction, dread, delight, threat, memory, pulse. A build that feels like a **broadcast** from your corner of the world.

## Competition reminder

- **Submission deadline:** Sunday 11:59 PM CT
- **Delivery:** Publish on at least one channel and share the link(s) with Eric for scoring.
- **Channels (this run):** Substack, LinkedIn, blog post on [merlinforge](https://github.com/myles-mf/merlinforge) (same content can be reused).

### Scoring (per content piece)

| Channel        | Points |
|----------------|--------|
| LinkedIn post  | 5      |
| YouTube (≥5 min, PiP required) | 15 |
| Personal blog  | 2      |
| Substack post  | 2      |

**Multiplier:** 0× if no public code; 1× public repo (README, how to run, screenshot); 2× if also hosted and linked in README.

**Bonus:** +10 theme alignment (obvious in write-up); +10 referencing another competitor (link/shout-out).

## After you ship

1. **Substack** — Publish post, copy link.
2. **LinkedIn** — Publish post, copy link.
3. **Merlinforge blog** — Add entry in `src/app/blog/posts.ts`, create `SoundwavePostBody.tsx` (or similar), wire slug in `[slug]/page.tsx`, publish.
4. Send all links to Eric for scoring.

---

## Week 1–3 recap (your builds)

| Week | Build | What it does |
|------|--------|---------------|
| **1** | **ChartSlice** | Interactive bar chart, slice by category (All/A/B). React, Vite, Recharts. |
| **2** | **Skill Directory** | Landing + `GET /api/skills` JSON. Humans browse; agents discover sprint-helper, Azure SQL profiler, crypto-market. |
| **3** | **Memory Palace** | Method of Loci: create (room + items → AI loci), explore, quiz. **Already has TTS** (speak/stop) in quiz. |

---

## Competitor idea we know (spin-off source)

- **Jake Strait — CryptoFM:** AI radio station that reads you the (crypto) market — “tune in,” hear a DJ. Strong Soundwave fit: transmission, persona, audio as the product.

The other two links (Kyle’s “The Artifact,” Eric’s “Agentic Companies”) didn’t return full content here; you can open them for more inspiration.

---

## Week 4 ideas

### A. Spin off a competitor (Jake’s “radio” idea, different angle)

- **Skill Radio / Agent Bulletin** — Same data as Skill Directory, but the *interface* is a broadcast: you “tune in” and hear a single voice (AI or curated script) brief you on the skills — “Sprint-helper: when you need a build idea. Azure SQL DTU Profiler: when you need SQL metrics…” Transmission of the directory as a show. No crypto; your own infra. **+10 ref** if you shout out Jake/CryptoFM as inspiration.

### B. Spin off your Week 1 (ChartSlice)

- **ChartSlice Signal / Sonified ChartSlice** — Same (or new) data viz, but you *hear* it: tones map to values, or a spoken summary (“March 55, April 61…”). Soundwave = data as **signal through sound**. Reuse chart + data; add Web Audio or TTS layer.

### C. Spin off your Week 2 (Skill Directory)

- **Skill Radio** (same as A) — Directory becomes a voice briefing. One clear persona. Good for “something for AI to use” meets “broadcast.”

### D. Spin off your Week 3 (Memory Palace)

- **Palace Radio / Loci Broadcast** — Same app, but the *identity* is a single “keeper” voice: a guided tour (“Welcome to the palace. First stop: the window — here we remember…”). Or: quiz and explore framed as a *show* (host reads questions, gives feedback). You already have TTS; add a consistent AI persona and script so it feels like one broadcast from the palace. **Reuse the most code.**

### E. Original (no direct spin-off)

- **Beacon / Numbers station** — Minimal “radio”: ambient + short spoken lines (AI or fixed). Signal in the noise. Very Soundwave.
- **Command-line radio** — Terminal UI that “streams” a broadcast (TTS or clips) with a clear persona. Niche, memorable.

---

## Recommendation

- **Highest reuse + clear theme:** **D — Palace Radio / Loci Broadcast.** Memory Palace already has sound; give it one voice and a “broadcast” frame. Ship fast, 2× with existing hosted app.
- **Strong theme + bonus:** **A — Skill Radio.** Reference Jake’s CryptoFM (“radio that transmits identity”); your spin is “radio that transmits the skill directory.” New small app or page; link to existing API.
- **Clearest “data as signal”:** **B — Sonified ChartSlice.** Good if you want a fresh small app and to lean into “signal” literally (data → sound).

When you pick one, add an app under `week4/` (e.g. `week4/palace-radio-app/` or `week4/skill-radio-app/`) and we can scaffold it.

---

## References

- [Competition rules](https://advisoryhour.substack.com/p/spring-into-ai-competition-rules)
- [FAQ & tips](https://advisoryhour.substack.com/p/faq-and-tips-on-competition)
- Example submissions: [Jake Strait — CryptoFM](https://substack.com/@jakestrait5/note/c-222725182), [The Artifact - Kyle Sebeysten](https://substack.com/home/post/p-190258609), [Agentic Companies - Eric Rhea](https://substack.com/home/post/p-190206284)
