# Final testing checklist — Memory Palace + Palace Radio

**Prereq:** `OPENAI_API_KEY` in `.env.local` (required for Create). Dev server: `npm run dev` → http://localhost:3000.

---

## 1. Create a palace

- [ ] Open http://localhost:3000
- [ ] Click **Try the template room** or **Create your palace**
- [ ] Enter a topic (e.g. `quadratic formula` or `first 5 elements`) → **Generate associations**
- [ ] Confirm associations list appears and links to **Explore** / **Quiz**

---

## 2. Explore

- [ ] From Create or home, go to **Explore**
- [ ] Room and loci are visible; click a locus → association text appears
- [ ] Click **▶ Hear the Keeper** → one line reads aloud in Keeper voice
- [ ] **▶ Palace Radio** link/button goes to `/broadcast`

---

## 3. Quiz

- [ ] From Explore or home, go to **Quiz**
- [ ] Question appears with 4 options; **▶ Hear the Keeper** reads the question aloud
- [ ] Answer (click or 1–4 / Enter) → feedback appears and is spoken in Keeper voice
- [ ] **▶ Palace Radio** link in header goes to `/broadcast`

---

## 4. Palace Radio — Plain

- [ ] Go to **Palace Radio** (home or `/broadcast`) with a palace in session
- [ ] **Spatial audio** off. Click **▶ Start Palace Radio**
- [ ] Intro → each locus line → outro play in order (one voice)
- [ ] **Stop** cancels playback
- [ ] After completion: **Explore** / **Quiz** / **Play again** work

---

## 5. Palace Radio — Spatial

- [ ] On `/broadcast`, check **Spatial audio (headphones)**
- [ ] **▶ Start Palace Radio** (headphones recommended)
- [ ] Short tone before each spoken line; tone direction varies by locus (door left, window right, etc.)
- [ ] **Stop** cancels

---

## 6. Palace Radio — Cipher

- [ ] On `/broadcast`, select **Cipher (numbers station)**
- [ ] Decoder panel appears (Code → Locus → Item)
- [ ] **▶ Start Palace Radio** → “Numbers station. Decode the following.” then call signs + number phrases, then “End of transmission.”
- [ ] Spoken code matches decoder (e.g. Alpha = door, numbers = item encoding)

---

## 7. Copy broadcast link

- [ ] On `/broadcast` with a palace loaded, click **Copy broadcast link**
- [ ] UI shows “Copied!”
- [ ] Open the URL in a new tab (or incognito) → same palace loads; no redirect to Create
- [ ] **▶ Start Palace Radio** plays the same tour
- [ ] With **Cipher** on, copy link again → open in new tab → URL contains `mode=cipher` and page opens in Cipher mode

---

## 8. No palace / empty state

- [ ] Clear sessionStorage (or use a new incognito window), go directly to http://localhost:3000/broadcast
- [ ] Redirects to `/create`
- [ ] Go directly to `/explore` or `/quiz` with no palace → appropriate empty message and link to Create

---

## 9. Build & lint

- [ ] `npm run build` completes with no errors
- [ ] `npm run lint` (if present) passes

---

**Quick smoke:** Create → Explore (Hear the Keeper) → Palace Radio (Plain Start/Stop) → Copy broadcast link → open link and Start. If all pass, core flow is good.
