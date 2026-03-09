# Week 4 Soundwave: Plan + Above-and-Beyond Ideas

No implementation yet — this doc is the idea and the plan, plus three options that take the competition to a new level.

---

## Part 1: Palace Radio — The Plan (Blow Everyone Away)

**Goal:** Make Memory Palace the standout Week 4 submission by turning it into a **broadcast**. Not “we added TTS,” but “you’re tuning in to the Voice of the Palace.”

### What “blow everyone away” means here

- **One identity:** A single, named voice (the Keeper / Voice of the Palace). Every spoken line is that voice — intro, tour, quiz, feedback. No generic “Read aloud”; it’s a *show*.
- **Framing as transmission:** The experience feels like receiving a signal: you press “Palace Radio” and the Keeper guides you through the room in order. Quiz becomes “the Keeper asks / the Keeper confirms.”
- **Polish:** Sequential TTS (no overlapping), optional ambient layer, consistent copy. Shareable “broadcast link” so someone else can hear your palace as a single run.
- **Theme alignment:** Soundwave = controlled signal, identity through sound. The write-up makes it obvious: “We didn’t just add audio — we turned the palace into a broadcast.”

### Scope (no code yet — plan only)

1. **TTS queue + Keeper voice**
   - Utility: speak lines in sequence (wait for `end` before next).
   - One chosen voice (from `speechSynthesis.getVoices()`) and a slightly slower rate for gravitas. All Keeper lines use it.

2. **Broadcast page (`/broadcast`)**
   - Load palace from sessionStorage. If none → redirect to create.
   - One button: “Start Palace Radio.”
   - Sequence: **intro** (“You’re listening to the Voice of the Palace. Let’s walk the room.”) → **per locus** (“At the [locus]. [sentence].”) → **outro** (“That was the Palace. Return when you’re ready to quiz.”).
   - UI: “Playing…” + Stop. Optional: very low ambient (room tone or soft pad) during playback.

3. **Explore + Quiz reframed**
   - Explore: “Read aloud” → “Hear the Keeper.” Spoken line in Keeper style (e.g. “[Locus]. [item]. [sentence].”).
   - Quiz: “Read question aloud” → “Hear the Keeper.” Question and feedback in Keeper voice (“Correct. The [locus] held [item]. Well done.”).

4. **Home + nav**
   - Home: “Week 4 — Palace Radio” section. “Tune in. The Voice of the Palace guides you through every room.” CTA to `/broadcast` and to Explore.
   - Footer: mention Soundwave / Palace Radio.

5. **Optional (if time)**
   - Store topic in palace state so intro can say “Tonight we walk through [topic].”
   - “Copy broadcast link” — link that opens `/broadcast` and optionally auto-starts (so you’re “sending” the palace as a transmission).

### Why this plan stands out

- Reuses your strongest asset (Memory Palace + existing TTS).
- Theme is obvious: one voice, one broadcast, transmission of identity.
- Different from “AI radio that reads the market” — yours is “radio that transmits the memory palace.” Same wavelength, different signal.
- Ship fast: same repo, same hosted app, 2× multiplier intact.

---

## Part 2: Three Ideas That Go Above and Beyond

These push past “good Week 4 submission” into “cuts new ground and raises the bar.” Pick one only if you want to aim for maximum impact and have the time/risk appetite.

---

### Idea 1: Spatial Audio Palace

**What:** Each locus has a *position in 3D sound*. You wear headphones; the Keeper’s voice (or a tone) moves: door = left, window = right, desk = center-front, bed = left-back, shelf = right-back. You don’t just hear the tour — you’re *inside* the palace by sound alone. Recall becomes “where did that voice come from?”

**Why it’s cutting edge**
- Web Audio API (PannerNode or AudioWorklet) for spatialization. No one else in the sprint is likely doing binaural / 3D audio for memory.
- Method of Loci is already spatial (places); making the *audio* spatial doubles down on “place” and makes the build instantly demoable (“put on headphones”).

**Why it fits Soundwave**
- Signal has *position*. Transmission isn’t flat — it comes from somewhere. Very “voice in the static that knows your coordinates.”

**Risks / effort**
- Web Audio spatialization has quirks (browser support, mobile). Scope to 5 fixed positions; no head-tracking. Still impressive.

---

### Idea 2: Palace as Broadcast Protocol

**What:** The palace isn’t only an in-browser experience. It becomes a *transmittable object*:
- **Download:** “Export as audio” → generate one audio file (e.g. via TTS to buffer, or server-side TTS → stream) so the user gets an MP3/OGG of the full Keeper tour. They can listen on a run, in the car, offline.
- **Share:** “Copy broadcast link” → link that, when opened, plays the full tour start-to-finish (or starts at “Start Palace Radio” with palace pre-loaded via query/share token).
- **Optional:** “Palace Radio” as a literal feed — e.g. generate an RSS enclosure or a static page that embeds the audio. So “your memory” is something you can subscribe to or send like a podcast.

**Why it’s cutting edge**
- Most builds stay in the tab. Yours *leaves* the tab: the signal is something you can own, send, replay. That’s transmission in the literal sense.
- Export-as-audio is a clear, shareable hook for the write-up and demo.

**Why it fits Soundwave**
- Soundwave is about *sending* a signal. Here the palace is the signal, and you’re giving people a way to send it and re-broadcast it.

**Risks / effort**
- Export: need a path from “sequence of strings” to “single audio file” (browser recording of TTS, or server-side TTS + concat). Non-trivial but doable. Share link with pre-loaded palace might need a lightweight “palace as JSON in URL” or a short-lived id.

---

### Idea 3: Cipher / Numbers Station Mode

**What:** The Keeper doesn’t speak plain English. They speak in *code*:
- **Numbers station aesthetic:** “Alpha. Seven. Two. Bravo. Door. Formula.” Associations are encoded as numbers, call signs, or a minimal vocabulary. The user (or a second “decoder” view) sees the mapping; listening is “tuning in” to a transmission you have to decode.
- **Or:** The Keeper uses a stylized, ritual language (e.g. short phrases, repeated structure). Recall becomes “cracking the signal” — you remember the code, then the content.
- Optional: static, crackle, or a very low “radio” ambience. One button: “Broadcast mode” vs “Plain mode.”

**Why it’s cutting edge**
- No other submission will feel like a cold-war broadcast or encoded intelligence. It’s a strong aesthetic and a clear story: “memory as encrypted transmission.”
- Fits the Decepticon / “encoded intent” angle of the theme perfectly.

**Why it fits Soundwave**
- Soundwave = “encoded intent,” “signal that survives the noise,” “controlled signal.” A cipher is literally that: the message is there, but you need the key (your palace) to decode it.

**Risks / effort**
- Design the encoding (numbers, call signs, or phrasebook) so it’s decodable and still memorable. Could be a second “mode” on top of Palace Radio so you still have the normal tour for accessibility.

---

## Part 3: Layering All Three Together

Yes — all three can live in one product. They reinforce each other: **one broadcast** that can be heard in 3D, **sent** as a file or link, and **decoded** in cipher mode.

### Unified product: “Palace Radio — full stack”

- **Baseline:** Part 1 (Keeper voice, `/broadcast`, Explore/Quiz reframed). Everything speaks with one identity.
- **Layer 1 — Spatial:** On the broadcast page (and optionally Explore), a toggle: **“Spatial audio”** (headphones). When on, each locus is played from a fixed 3D position. Same script, same Keeper; the voice moves through the room. Works in both Plain and Cipher modes.
- **Layer 2 — Broadcast protocol:** From `/broadcast` (or Explore): **“Export as audio”** (download MP3/OGG of the current tour) and **“Copy broadcast link”** (share URL that loads palace and can auto-play). Export can respect the current mode (Plain or Cipher) so you can share either “normal tour” or “numbers station” version.
- **Layer 3 — Cipher:** A mode toggle: **“Plain”** vs **“Cipher”** (numbers station). When Cipher is on, the Keeper speaks encoded lines (numbers/call signs/phrasebook); the UI shows a “decoder” (mapping of code → locus/item) so the user can follow. Optional: subtle static/crackle during Cipher broadcast. Spatial + Cipher together = “encoded transmission from different points in the room.”

### How they interact

| Feature        | Plain mode     | Cipher mode    |
|----------------|----------------|----------------|
| Spatial audio  | Voice moves by locus (door left, window right, …). | Same. Code “broadcasts” from each position. |
| Export audio   | One file: intro + loci (plain) + outro. | One file: intro + encoded loci + outro. |
| Broadcast link | Link opens tour, optional auto-play (plain). | Same; link can include `?mode=cipher` for encoded run. |
| Quiz           | Keeper asks in plain English. | Optional: Keeper asks in code; user answers with decoded content (or keep quiz plain for accessibility). |

### UX in one place (e.g. `/broadcast`)

- **Start Palace Radio** (primary CTA).
- **Mode:** [ Plain | Cipher ]. Affects script and (for Cipher) shows decoder panel.
- **Audio:** [ Stereo | Spatial (headphones) ]. Spatial only matters when “Start” is used or when playing the tour.
- **After / during:** **Stop** · **Export as audio** · **Copy broadcast link**.
- Explore page: same mode toggle and “Hear the Keeper” (stereo or spatial if we add it there); optional “Open in Palace Radio” that jumps to `/broadcast` with same mode.

### Suggested build order

1. **Part 1 (Palace Radio)** — TTS queue, Keeper voice, `/broadcast` page, Explore/Quiz copy, home/nav. Ship and test. This is the base.
2. **Spatial** — Add Web Audio spatialization to the broadcast sequence (and optionally to single-locus “Hear the Keeper” on Explore). One position per locus; stereo fallback. Toggle on `/broadcast`: “Spatial (headphones).”
3. **Broadcast protocol** — “Export as audio” (record TTS to buffer → export file, or server-side TTS → stream/download). “Copy broadcast link” (URL with palace in query or id; landing page can auto-play). Both work in Plain and Cipher.
4. **Cipher** — Encode script (numbers/call signs or phrasebook); decoder view (code → locus/item); mode toggle Plain/Cipher. Apply to broadcast sequence and to export/link. Optional: crackle/static when Cipher is on. Decide whether quiz stays plain or has “Keeper asks in code” as an option.

This order keeps each layer testable and avoids blocking: you can demo “Palace Radio + Spatial” before export or cipher exist.

### Scope / constraints

- **Cipher + Export:** Export produces one file; that file is either plain or encoded depending on mode at export time. No need to export “both” in one file.
- **Spatial + Export:** Export is typically stereo (the mixed-down tour). True “spatial export” would require a binaural mix or multi-channel file; optional later. For v1, “Export as audio” = stereo mix of the Keeper tour (plain or cipher).
- **Accessibility:** Keep “Plain” mode and plain quiz as the default so the product stays usable for everyone. Cipher is “for the vibe” and for the write-up; Plain is always one click away.

### One-line pitch with all three

“Palace Radio: tune in to the Voice of the Palace. Hear the tour in **3D** (spatial audio), **send it** (export or share link), or **decode it** (numbers-station mode). One broadcast, three ways to receive it.”

---

## How to use this doc

- **Baseline:** Implement **Part 1 (Palace Radio)** first. Then add **Part 2** in this order: **Spatial → Broadcast protocol → Cipher** (Part 3 above).
- **All three layered:** Use **Part 3** as the integration spec: one product with mode toggles (Plain/Cipher, Stereo/Spatial) and actions (Export, Copy link). Same repo, same hosted app, 2× multiplier.
- **Write-up:** “Soundwave is transmission. We turned the Memory Palace into a broadcast: one voice, one signal — and you can hear it in 3D, send it as a file or link, or tune in as a numbers station and decode it.”

No implementation in this repo until you say go.

---

## Part 4: Competitive Landscape (Week 4 Submissions)

Summary of the three known submissions so you can see how the full plan (Part 1 + all three layers) stacks up.

### Jake Strait — CryptoFM

- **What:** AI radio station; you “tune in” and hear a DJ read you the (crypto) market.
- **Theme:** Strong. Transmission, persona, audio as the product.
- **Status:** Working build; clear one-liner.
- **Threat level:** High. Simple, on-theme, memorable.

### Eric Rhea — No-human organizations: Agentic Companies

- **Aspiration:** Agentic org to deliver *Midsummer Night’s Dream* with Mendelssohn + Soundwave NES sprites, or 80s cassette emulation in the browser.
- **What actually shipped:** Both ideas failed. He built a virtual company of AI agents (Paperclip: org chart, roles, handoffs). It burned budget, quotas, and local setup. He wrote a long “field report from the failure zone” — *The Goal*, bottlenecks, management theory, onboarding, wave behavior. Deployed site (soundwave.ericrhea.com) and repo (github.com/arkbuilder/midsummer-web) exist but are broken.
- **Theme:** Soundwave was in the *dream* (NES, cassette); the *delivery* is about agentic-org failure, not a working Soundwave build.
- **Strengths:** Honest narrative, video, visibility (he runs the competition). Points from channels + multiplier if the deployed checkbox counts.
- **Weaknesses:** No working Soundwave product; the build “did not work.”
- **Threat level:** Narrative and points, but not a working theme demo. You beat him on “delivered a Soundwave experience that works.”

### Kyle Sebeysten — The Artifact

- **What:** Point-and-click adventure. Desert at night; you find an object in the sand (the Artifact). It powers up, minimal UI, one path: **“Scan For Signals.”** Scans AI research (arXiv, GitHub, Hugging Face, X) → OpenAI composites/classifies → three-paragraph article → **spoken aloud with text highlights synced to audio** (ElevenLabs TTS). Atmosphere-focused (immersive, “internet has been boring since Flash”).
- **Theme:** “Calm the noise, produce something clear.” Soundwave = signal from noise; the Artifact *scans for signals* and turns research into one clear spoken output.
- **Strengths:** Working product, clear interaction, audio + synced highlights, references Jake (+10). Strong atmosphere.
- **Threat level:** High. Different from yours (research → spoken summary vs memory palace → broadcast), but same “one clear signal” wavelength.

### Your plan vs all three

| | Jake (CryptoFM) | Eric (Agentic) | Kyle (Artifact) | You (Palace Radio + 3 layers) |
|--|------------------|----------------|------------------|---------------------------------|
| **Working build** | Yes | No (broken) | Yes | Yes (builds on shipped Week 3) |
| **Soundwave = transmission** | Yes (radio) | No (narrative) | Yes (scan → signal) | Yes (broadcast, 3D, export, cipher) |
| **Technical ambition** | TTS + radio | Failed complex org | Crawl → summarize → TTS + sync | Sequential broadcast + spatial + export + cipher |
| **Differentiation** | “Crypto radio” | “I failed, here’s why” | “Artifact in desert, scan for signals” | “One broadcast: hear in 3D, send it, or decode it” |
| **Memorability** | One hook | Story + video | One hook + atmosphere | Three hooks in one product |

**Verdict:** Your plan is well placed to **beat Eric** on “working Soundwave build” and on theme alignment. You’re **competitive with Jake and Kyle** on theme and execution; you differentiate by offering three distinct ways to *receive* the signal (spatial, export/share, cipher) in one coherent product, plus continuity from Week 3 (tutorial → transmission). Execution quality (spatial that feels 3D, export that works, cipher that lands) will determine whether you *outright* beat Jake and Kyle; the plan is strong enough to do it if you ship it well.
