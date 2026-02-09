# Your part only — 4 things (so you can focus on the video)

Everything else is done. You do: **deploy once**, **paste 2 posts**, **record YouTube**, **send Eric one message**.

---

## 1. Deploy (one time, ~2 min)

In a terminal:

```bash
cd week1/data-viz-app
git add -A && git commit -m "ChartSlice Week 1" && git push
```

If this repo isn’t on GitHub yet: create a **public** repo, add the remote, push.

Then deploy (pick one):

**Option A — Vercel website (no CLI):**  
Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo → set **Root Directory** to `week1/data-viz-app` → Deploy. Copy the live URL.

**Option B — Vercel CLI (one command):**  
`cd week1/data-viz-app` then `npx vercel --prod` (first time it will ask you to log in and link the project; use same root `week1/data-viz-app` if prompted). Copy the URL it prints.

Update the README with that URL (one command):

```bash
cd week1/data-viz-app
npm run set-live-url -- https://YOUR-ACTUAL-URL.vercel.app
```

Then commit and push again so the README has the live link:

```bash
git add README.md && git commit -m "Add live URL" && git push
```

---

## 2. LinkedIn + Substack (paste the same text twice)

Replace these **3 things** once, then paste into LinkedIn and Substack:

- `[LIVE]` → your live app URL  
- `[REPO]` → your GitHub repo URL (e.g. `https://github.com/you/SpringIntoAI`)  
- `[COMPETITOR]` → one competitor name + what they did (e.g. “Jane for her dashboard — [link]”)  

**Text to use (short — use for both LinkedIn and Substack):**

```
Week 1 of the Spring Into AI Build Sprint done.

I built ChartSlice — a small interactive bar chart where you slice the data by category. Theme was data visualization and interactions: one chart, one filter, ship it.

Tech: React, Vite, Recharts. Code is public, app is live.

Try it: [LIVE]
Repo: [REPO]

Shout-out to [COMPETITOR] for the +10. If you’re in the sprint too, drop your build in the comments.
```

Paste that into LinkedIn, replace [LIVE] [REPO] [COMPETITOR], publish.  
Paste the same into Substack, replace again, publish.

---

## 3. YouTube (the only real “work”)

- Open **YouTube-SCRIPT.md**. Replace `[YOUR NAME]` and `[COMPETITOR NAME/LINK]`.
- Zoom: solo meeting, **Share screen** (browser with the live app), **you in PiP the whole time**. Record 5–7 min using the script.
- Upload. In the description paste the block from the bottom of YouTube-SCRIPT.md and fill in your live URL and repo URL.
- Make sure your channel has your **first or last name** in the channel name.

---

## 4. Send Eric (one message)

Copy this, fill in the 5 links, send:

```
Week 1 submission:

LinkedIn: [paste your LinkedIn post URL]
YouTube: [paste your video URL]
Substack: [paste your Substack post URL]
Repo: [paste your GitHub repo URL]
Live app: [paste your Vercel/live app URL]
```

Send before **Sunday 11:59 PM CT**.

---

## Checklist (you only)

- [ ] Pushed to GitHub (public repo)
- [ ] Deployed on Vercel, root = `week1/data-viz-app`
- [ ] Ran `npm run set-live-url -- https://...` and pushed again
- [ ] Posted on LinkedIn (with [LIVE] [REPO] [COMPETITOR] replaced)
- [ ] Posted on Substack (same text, replaced)
- [ ] Recorded YouTube (PiP whole time, ≥5 min), uploaded, description with links
- [ ] Sent Eric the 5 links

Done. The video is the only thing that needs your face and time; the rest is paste and send.
