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

**https://memory-palace-app.vercel.app**

## Deploy with Vercel CLI

1. **Log in (once):**  
   ```bash
   npx vercel login
   ```  
   Follow the browser link to log in.

2. **Deploy from the app directory:**  
   ```bash
   cd week3/memory-palace-app
   npx vercel
   ```  
   First time: link to existing Vercel account/team and accept defaults (root = current dir). You get a preview URL.

3. **Production:**  
   ```bash
   npx vercel --prod
   ```

4. **Set the API key (required for Create):**  
   - **Option A — CLI:**  
     `npx vercel env add OPENAI_API_KEY`  
     Choose Production (and Preview if you want), paste your OpenAI key when prompted.  
   - **Option B — Dashboard:**  
     [vercel.com](https://vercel.com) → project → **Settings** → **Environment Variables** → add `OPENAI_API_KEY`.  
   Optional: `AI_MAX_TOKENS` (e.g. `512`). Then redeploy so env is applied:  
   `npx vercel --prod` or Deployments → Redeploy in the UI.

5. **README:**  
   Paste your production URL in the “Live app” section above; add a screenshot to `screenshots/` for 2×.

## Screenshot

Add a screenshot of the app (e.g. Create or Quiz screen) to `screenshots/` and reference it here. Required for 2×.

![Screenshot](screenshots/app.png)

## Repo

Part of [Spring Into AI](https://advisoryhour.substack.com/p/spring-into-ai-competition-rules). Week 3: Interactive Tutorials.
