# Week 4: Detailed Execution Plan — Win with Palace Radio

**Goal:** Ship Palace Radio (Part 1) + all three layers (Spatial, Export/Share, Cipher), then max points and theme so you win the week.

**Signature idea to lead with:** *“One broadcast, three ways to receive it.”* Demo hook: **spatial audio** (“put on headphones — the voice moves through the room”). Narrative hook: **cipher mode** (“tune in as a numbers station and decode it”). Export is the “send the signal” proof. All three in one product.

---

## Win checklist (scoring)

- [ ] **Theme (+10):** Write-up clearly says “Soundwave = transmission; we turned the palace into a broadcast.”
- [ ] **Competitor ref (+10):** One specific shout-out (e.g. Jake’s CryptoFM, Kyle’s Artifact, or Eric’s reflection).
- [ ] **2× multiplier:** Public repo (README, how to run, screenshot) + hosted app URL in README.
- [ ] **Channels:** Substack + LinkedIn + merlinforge blog (same post, reuse). Optional: YouTube (15 pts, 5 min, PiP).
- [ ] **Send Eric** all links so it’s scored.

---

## Phase 1: Palace Radio base (must ship first)

**Outcome:** One Keeper voice, sequential broadcast at `/broadcast`, Explore/Quiz reframed, home/nav updated. No spatial/cipher/export yet — just “tune in and hear the tour.”

### 1.1 TTS queue + Keeper voice

**File:** `week3/memory-palace-app/app/lib/tts.ts`

**Tasks:**
1. Add `speakSequence(lines: string[], options?: { rate?: number; voice?: SpeechSynthesisVoice; onDone?: () => void }): void`.  
   - For each line: create `SpeechSynthesisUtterance`, set `rate` (e.g. 0.92 for gravitas), `voice` if provided, `lang: 'en-US'`.  
   - Use `utterance.onend` to start the next line; when last line ends, call `onDone()` and clear any internal queue state.
2. Add `getKeeperVoice(): SpeechSynthesisVoice | null`.  
   - On client: `speechSynthesis.getVoices()` — pick first preferred (e.g. name includes “Google” or “Daniel” or “Samantha”) or fallback to first English voice. Call after `voiceschanged` if list is empty.
3. Export `stopSpeaking()` (already exists) and ensure it clears the queue so Stop during broadcast works.
4. Keep existing `speak(text, options)` for single lines; use same rate/voice when “Hear the Keeper” is used so all Keeper lines are consistent.

**Acceptance:**  
- `speakSequence(['Line one.', 'Line two.'])` speaks one after the other with no overlap.  
- Stop button cancels mid-sequence.  
- One chosen voice used for all Keeper lines.

---

### 1.2 Broadcast page

**New file:** `week3/memory-palace-app/app/broadcast/page.tsx`

**Tasks:**
1. Client component: on mount, `loadPalace()`. If null → redirect to `/create` (e.g. `useRouter().push('/create')`).
2. Build script array:  
   - Intro: `"You're listening to the Voice of the Palace. Let's walk the room."`  
   - For each association (in order): `At the ${a.locus}. ${a.sentence}.`  
   - Outro: `"That was the Palace. Return when you're ready to quiz."`
3. State: `playing: boolean`, `stopped: boolean`.  
   - Primary CTA: “Start Palace Radio” → set `playing true`, call `speakSequence(script, { rate: 0.92, voice: getKeeperVoice(), onDone: () => setPlaying(false) })`.  
   - “Stop” → `stopSpeaking()`, set `playing false`.
4. UI: header “Palace Radio” + back link to home. When `playing`: show “Playing…” and Stop. When not playing and script ran: “Tour complete. Explore or Quiz.”
5. Optional: store `topic` in palace state (see 1.5) and use in intro: “Tonight we walk through [topic]. Let’s begin.”

**Acceptance:**  
- From `/broadcast`, with a palace in sessionStorage, “Start Palace Radio” plays intro → each locus → outro in order.  
- Stop cancels playback.  
- No palace → redirect to create.

---

### 1.3 Explore reframed

**File:** `week3/memory-palace-app/app/explore/page.tsx`

**Tasks:**
1. Change button label from “Read aloud” to “Hear the Keeper” (or “▶ Hear the Keeper”).
2. On click, speak with Keeper options: `speak(\`${selected.locus}. ${selected.item}. ${selected.sentence}.\`, { rate: 0.92 })` and, if you added voice in 1.1, pass the same voice (e.g. from `getKeeperVoice()`).
3. Optional: add a small “Open Palace Radio” link to `/broadcast` so users can jump to the full tour.

**Acceptance:**  
- Clicking “Hear the Keeper” on a locus speaks that line in the same style as the broadcast.

---

### 1.4 Quiz reframed

**File:** `week3/memory-palace-app/app/quiz/page.tsx`

**Tasks:**
1. Change “Read question aloud” to “Hear the Keeper.”  
   - Question text: keep “What did we put at the [locus]?” / “Where did we put [item]?” — optionally prefix with “The Keeper asks: ” when speaking.
2. Feedback when correct: e.g. `Correct. The ${locus} held ${item}. Well done.` (or keep existing and just ensure `speak()` uses Keeper rate/voice).
3. Ensure `speak(feedback)` and question read-aloud use the same rate (and voice if available).

**Acceptance:**  
- Quiz read-aloud and feedback feel like the same voice as the broadcast.

---

### 1.5 Home + nav + optional topic

**File:** `week3/memory-palace-app/app/page.tsx`

**Tasks:**
1. Add a “Week 4 — Palace Radio” section:  
   - Headline: e.g. “Tune in. The Voice of the Palace.”  
   - Short line: “One broadcast guides you through every room. Start Palace Radio, or explore and quiz with the Keeper.”  
   - CTA button/link to `/broadcast`.  
   - Link to Explore.
2. Footer: add “Soundwave · Palace Radio” or “Week 4: Soundwave — Palace Radio” so theme is visible.

**Optional (topic for intro):**  
- **File:** `app/lib/palace.ts` — add `KEY_TOPIC = 'memory-palace-topic'`; in `savePalace`, accept `topic?: string` and write/remove it; in `loadPalace`, return `topic` from sessionStorage.  
- **File:** `app/create/page.tsx` — when saving palace after associations, call `savePalace(..., topic: topicOrList.trim())` so topic is stored.  
- **File:** `app/broadcast/page.tsx` — if `palace.topic` exists, intro: “You’re listening to the Voice of the Palace. Tonight we walk through [topic]. Let’s begin.”

**Acceptance:**  
- Home clearly promotes Palace Radio and links to `/broadcast`.  
- Footer mentions Soundwave/Palace Radio.

---

### 1.6 Layout / nav

**File:** `week3/memory-palace-app/app/layout.tsx` (if you have a shared nav)

If there’s no nav yet, at least ensure:
- Explore and Quiz pages have a link back to home and, where it makes sense, “Palace Radio” → `/broadcast`.

**Acceptance:**  
- From any main page you can get to `/broadcast` and back.

---

## Phase 2: Spatial audio

**Outcome:** On `/broadcast`, a “Spatial audio (headphones)” toggle. When on, each locus line is played from a fixed 3D position (door left, window right, etc.) using Web Audio.

### 2.1 Spatial playback utility

**New file:** `week3/memory-palace-app/app/lib/spatial-audio.ts`

**Tasks:**
1. Create an audio context (on user gesture): `new AudioContext()`.
2. For a given text and position `{ x, y, z }` (listener at origin, source at x,y,z):  
   - Use `SpeechSynthesis` to speak the text (same as now), but **OR** use a pre-recorded approach. Actually: browser TTS doesn’t give us a raw buffer to spatialize. So two options:  
   - **Option A (simpler):** Use `MediaRecorder` to capture the output of `speechSynthesis` into a blob, then decode to `AudioBuffer`, play through `AudioContext` with `PannerNode` at position. That’s heavy (record each phrase then play).  
   - **Option B (recommended):** Use `PannerNode` with a **short tone or click** at each locus position before speaking the line (so “the voice comes from that direction” is implied by the tone), then play the TTS in stereo. So: “beep from the left” + “At the door. [sentence].” in center. Less work than full spatialized speech; still reads as “position.”  
   - **Option C (full spatial TTS):** Play TTS in stereo normally; use a **convolution or delay** per ear to fake position (e.g. delay left channel for “right” source). More involved.  
3. **Pragmatic scope:** Implement **Option B**: for each locus, (1) play a short sine or soft tone from `PannerNode` at that locus’s coordinates, (2) then `speak(locusLine)` in stereo. Define positions: e.g. door = (-1, 0, 0.5), window = (1, 0, 0.5), desk = (0, 0, 1), bed = (-0.7, 0, -0.5), shelf = (0.7, 0, -0.5) (left/right/front/back).
4. Export: `playSpatialSequence(script: { line: string; position: [number, number, number] }[], options?: { onDone?: () => void })` that, for each item, plays tone at position then speaks line (reuse `speak` and wait for `end`), then next; `onDone` when all complete. And `stopSpatialPlayback()` to cancel.

**Acceptance:**  
- With headphones, a tone (or the line) appears to come from different directions per locus; then the spoken line plays.  
- Stop cancels.

---

### 2.2 Locus positions

**File:** `week3/memory-palace-app/app/lib/palace.ts` (or keep in `spatial-audio.ts`)

**Tasks:**
1. Export a map `LOCUS_POSITIONS: Record<string, [number, number, number]>` for door, desk, window, bed, shelf (and any other template loci). Use same positions in 2.1.

---

### 2.3 Broadcast page: spatial toggle

**File:** `week3/memory-palace-app/app/broadcast/page.tsx`

**Tasks:**
1. Add state: `spatial: boolean` (default false). Toggle: “Spatial audio (headphones)”.
2. When starting broadcast: if `spatial`, build array `{ line, position }[]` for intro (e.g. center), each locus (from LOCUS_POSITIONS), outro (center). Call `playSpatialSequence(...)`. Else call existing `speakSequence(...)`.
3. Stop calls either `stopSpatialPlayback()` or `stopSpeaking()`.

**Acceptance:**  
- Toggle on → tones/lines feel directional (headphones). Toggle off → same as Phase 1.

---

## Phase 3: Broadcast protocol (export + share link)

**Outcome:** “Export as audio” downloads a single file of the tour (stereo). “Copy broadcast link” gives a URL that opens the app with palace loaded (and optionally auto-starts broadcast).

### 3.1 Export as audio (client-side)

**Approach:** Use browser `MediaRecorder` to capture `speechSynthesis` output (or capture the tab’s audio).  
**Caveat:** Many browsers don’t let you capture `speechSynthesis` directly into a stream. Fallback: play the sequence and record from `getUserMedia` with a “virtual” audio device, or use a **server-side** TTS route that returns audio (e.g. OpenAI TTS or similar), then concat and serve as one file.

**Pragmatic v1:**  
- **Option A:** Server route `POST /api/export-audio` with body `{ script: string[] }`. Server uses a TTS API (e.g. OpenAI `audio/speech`) to generate per-phrase audio, concat (e.g. with `ffmpeg` or a Node audio lib), return as single MP3/OGG. Client downloads via `fetch` + blob + `<a download>`.  
- **Option B:** Client-only: play the full sequence with `speakSequence` and use `MediaRecorder` on an AudioContext that’s fed by… actually we can’t easily pipe `speechSynthesis` into a track. So for “no backend” we could: “Open Palace Radio in a new tab and hit Start; use your system/browser to record” (instructions). Not as slick.  
**Recommendation:** If you have or can add one server route, do **Option A** (server TTS → concat → download). Else, ship “Copy broadcast link” first and document “Export: record the tab while Palace Radio plays” as v1; add real export in a follow-up if time.

**Tasks (Option A — server export):**
1. **New route:** `app/api/export-audio/route.ts`.  
   - POST, body `{ script: string[] }`.  
   - For each line, call OpenAI TTS (or ElevenLabs, etc.) to get audio buffer.  
   - Concat buffers (simple WAV concat or use a lib to output MP3).  
   - Return `Content-Type: audio/mpeg` (or audio/wav) and the file.  
   - Token/cost: keep script short (intro + 5 loci + outro) so cost is small.
2. **Client:** On `/broadcast`, after building `script[]`, add button “Export as audio”. On click: `fetch('/api/export-audio', { method: 'POST', body: JSON.stringify({ script }) })` → blob() → create object URL → `<a download="palace-radio-tour.mp3" href={url}>` and trigger click.  
3. Respect **mode** (Plain vs Cipher): if Cipher is implemented, pass the encoded script when in Cipher mode so the exported file is the numbers-station version.

**Acceptance:**  
- “Export as audio” downloads one file that plays the full tour (or a clear “coming soon” + copy broadcast link).

---

### 3.2 Copy broadcast link (palace in URL)

**Tasks:**
1. **Encode palace in URL:** Option (a) compress `palace` (associations + loci + optional topic) to base64 and put in query, e.g. `?p=<base64>`. Option (b) store server-side with a short id and put `?id=xyz`. Option (a) keeps no server state; use short JSON and optional compression (e.g. pako/lz-string) if needed to keep URL under ~2k.
2. **New page or broadcast behavior:** If `/broadcast?p=...` or `?id=...`, on load decode and write to sessionStorage (same keys as `savePalace`), then optionally set `autoPlay: true` so “Start Palace Radio” runs automatically or show “Broadcast ready. [Start]” with one click.
3. **Copy link:** On `/broadcast`, button “Copy broadcast link”. Build URL: `origin/broadcast?p=<encoded>` (and optionally `&auto=1`). Copy to clipboard.
4. **Create flow:** Optionally after creating a palace, “Copy broadcast link” so they can share before exploring.

**Acceptance:**  
- Copy link → open in new tab → palace is loaded; user can Start (or auto-start) and hear the tour.  
- Shared link works without the creator’s session.

---

## Phase 4: Cipher / numbers station mode

**Outcome:** Toggle “Plain” / “Cipher” on `/broadcast`. In Cipher mode, the Keeper “speaks” encoded lines (numbers/call signs); a decoder panel shows code → locus/item. Optional light static during Cipher.

### 4.1 Encoding scheme

**Design:**
- Each locus gets a **call sign** (e.g. Alpha, Bravo, Charlie, Delta, Echo for door, desk, window, bed, shelf).  
- Each “item” or sentence is encoded as a short **number phrase** (e.g. “Seven. Two. Niner.”) or a fixed phrasebook. Keep it decodable: e.g. “Alpha” = door, “Seven Two” = first two words of item, etc.  
- **Simplest:** Locus = call sign. Item = spelled as words: “Formula” → “Foxtrot Oscar Romeo Mike…” (NATO alphabet). Or item = “Item one: [first three words]” as numbers. So the Keeper says: “Alpha. Seven. Two. Niner. [sentence in numbers/code].” Decoder shows: Alpha → door → [item] → [sentence].

**Tasks:**
1. **New file:** `app/lib/cipher.ts`  
   - `encodeBroadcast(associations: Association[]): { spoken: string[]; decoder: { code: string; locus: string; item: string }[] }`.  
   - spoken = array of strings to speak (intro in plain or coded, then per locus: call sign + encoded item/sentence, outro).  
   - decoder = list of code → locus, item for UI.  
2. Pick a simple scheme: e.g. NATO call signs for loci (Alpha=door, Bravo=desk, …). Items: either “number phrase” (e.g. each word → digit string) or “first letter NATO” for first few words. Ensure decoder can show “Alpha → door → quadratic formula” so the user can follow.

**Acceptance:**  
- Given associations, `encodeBroadcast` returns a spoken script (coded) and a decoder list for the UI.

---

### 4.2 Broadcast page: Plain vs Cipher

**File:** `app/broadcast/page.tsx`

**Tasks:**
1. State: `mode: 'plain' | 'cipher'`. Toggle: “Plain” | “Cipher (numbers station)”.
2. When building script: if `mode === 'cipher'`, call `encodeBroadcast(palace.associations)` and use `spoken` for the sequence; show decoder panel (list of code → locus → item) collapsed or beside the player.
3. Optional: when Cipher is on, play a very short/low static loop (e.g. a 2s noise file or oscillator) at low volume during playback. Or a single “static” burst before each encoded line.
4. Export and “Copy broadcast link” respect mode (export uses encoded script when Cipher; link can include `&mode=cipher` so shared link opens in Cipher).

**Acceptance:**  
- Toggle Cipher → Keeper speaks in code; decoder visible.  
- Plain unchanged from Phase 1/2.

---

### 4.3 Optional: Cipher in Explore

Show decoder for current palace (e.g. in a collapsible “Decoder” section on Explore) when in Cipher mode, and “Hear the Keeper” for a locus could speak the encoded line for that locus. Lower priority than broadcast page.

---

## Phase 5: Polish and submission

### 5.1 Repo and deploy

- [ ] README: “What it is” (Palace Radio: tune in, 3D, export, cipher), “How to run” (env, npm install, npm run dev), **Live app** URL, **Screenshot** (e.g. `/broadcast` with toggles).
- [ ] Add screenshot to `screenshots/` and reference in README.
- [ ] Deploy (e.g. Vercel) with env: `OPENAI_API_KEY` (and any TTS key for export). Ensure `/broadcast`, `/create`, `/explore`, `/quiz` work.

### 5.2 Write-up (Substack / LinkedIn / blog)

- **Headline:** E.g. “Palace Radio: One broadcast, three ways to receive it — Week 4 Soundwave.”
- **Theme:** “Soundwave is transmission. We turned the Memory Palace into a broadcast: one voice (the Keeper), and you can hear it in 3D, send it as a file or link, or tune in as a numbers station and decode it.”
- **Competitor ref:** One sentence, e.g. “Inspired by the idea of radio as transmission — shout-out to Jake’s CryptoFM and Kyle’s Artifact for the ‘tune in’ vibe.”
- **Links:** Live app, repo, “Try Palace Radio” → `/broadcast`.

### 5.3 Channels and scoring

- [ ] Publish Substack post → copy link → send to Eric.  
- [ ] Publish LinkedIn post (same content or shortened) → copy link → send to Eric.  
- [ ] Add merlinforge blog post: `posts.ts` + `PalaceRadioPostBody.tsx` (or similar) + slug in `[slug]/page.tsx`.  
- [ ] Send Eric all three links.  
- [ ] Optional: YouTube walkthrough (5 min+, PiP) for 15 pts.

---

## Order of work (summary)

1. **Phase 1** (Palace Radio base) — do first. Ship and test; then add phases 2–4.
2. **Phase 2** (Spatial) — next; biggest “wow” in the room.
3. **Phase 3** (Export + link) — then; “send the signal” proof.
4. **Phase 4** (Cipher) — then; narrative and theme.
5. **Phase 5** (Polish + submission) — final.

If time is short, cut in this order: (1) full spatial (ship “tone per locus” only), (2) server-side export (ship “Copy broadcast link” only), (3) cipher static/ambience. Keep: Palace Radio base, spatial toggle (even simple), broadcast link, and Plain/Cipher mode with decoder. That’s still “one broadcast, three ways to receive it” and enough to win.
