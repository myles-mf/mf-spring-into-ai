# Memory Palace — Week 3

AI-powered **Memory Palace** (Method of Loci): remember anything by placing it in a space. You choose what to remember; AI generates vivid associations for each locus. Then explore and quiz (with optional audio).

**Spring Into AI · Week 3: Interactive Tutorials**

## What it is

- **Create:** Pick a template room (or later: upload a photo of your room). Enter what you want to remember (a topic or list). AI assigns items to loci and generates one vivid association per spot.
- **Explore:** Walk through the palace; click each locus to see the association.
- **Quiz:** Answer “What’s at [locus]?” or “Where is [item]?” — with optional text-to-speech for questions and feedback.

## How to run

```bash
cd week3/memory-palace-app
cp .env.example .env.local
# Edit .env.local: set OPENAI_API_KEY (and optionally AI_MAX_TOKENS)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Token budget (competition)

For the competition we keep usage predictable:

- Set **`AI_MAX_TOKENS`** in `.env.local` (or in Vercel env) to cap tokens per AI request (e.g. `512` or `1024`). Default is `512` if unset.
- The app uses **one model** (e.g. `gpt-4o-mini`) and passes `max_tokens` on every call.

## Live app

*(Add your Vercel production URL here after deploy for the 2× multiplier.)*

## Deploy with Vercel and configure the key

1. **Log in (if needed):**  
   `npx vercel login`  
   Follow the browser link to log in or link your token.

2. **Deploy from the app directory:**  
   ```bash
   cd week3/memory-palace-app
   npx vercel
   ```  
   Accept defaults (or set root to current dir). You’ll get a preview URL; run `npx vercel --prod` to promote to production.

3. **Add the API key and token budget:**  
   - Open [vercel.com](https://vercel.com) → your project → **Settings** → **Environment Variables**.
   - Add:
     - **`OPENAI_API_KEY`** — your OpenAI API key (required).
     - **`AI_MAX_TOKENS`** — optional, e.g. `512` (default 512).
   - Save. Then **Deployments** → ⋮ on latest → **Redeploy** so the new env vars are used.

4. **Update this README:**  
   Put your production URL in the “Live app” section above and add a screenshot to `screenshots/` for the 2× multiplier.

## Screenshot

Add a screenshot of the app (e.g. Create or Quiz screen) to `screenshots/` and reference it here. Required for 2×.

![Screenshot](screenshots/app.png)

## Repo

Part of [Spring Into AI](https://advisoryhour.substack.com/p/spring-into-ai-competition-rules). Week 3: Interactive Tutorials.
