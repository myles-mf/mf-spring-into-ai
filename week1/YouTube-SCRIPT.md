# Week 1 YouTube Script (5–7 min)

**Use this with Zoom: screen share the app + you in PiP the whole time.**  
Replace `[YOUR NAME]` and `[COMPETITOR NAME/LINK]` before recording.

---

## Script

**[~30 sec] INTRO**

Hey, I'm [YOUR NAME]. I'm in the Spring Into AI Build Sprint — five weeks, ship something every week. This is Week 1, and the theme is data visualization and interactions. I built something called ChartSlice — I'm gonna show you what it is, how it works, and how I built it.

**[~30 sec] WHAT IT IS**

ChartSlice is a single-page app: an interactive bar chart. It shows some sample monthly data, and the main thing is you can filter by category using a dropdown — so you're not just looking at a static chart, you're actually interacting with the data. That's the “data visualization and interactions” piece for this week.

**[~1 min] LIVE DEMO — show the app**

Let me pull it up. [Share screen, open the live app or localhost.]

So here it is. You've got the chart with months on the bottom and values on the side. Up here is the filter: “Filter by category.” Right now it's on “All,” so you see everything. If I switch to “A,” the chart updates and you only see the bars for category A. Switch to “B,” same thing — only B. So the interaction is just this dropdown, but it makes the viz actually useful instead of static.

[Click through All, A, B once or twice so it's clear.]

That's ChartSlice. Simple, but it fits the theme: data on screen and a clear interaction.

**[~1–1.5 min] HOW YOU BUILT IT**

Tech stack: React, Vite, and Recharts. So it's a React app, Vite for the build, and Recharts for the chart component — bars, axes, tooltip. The data right now is just in the code as a small array; you could swap in a CSV or an API later. The filter is a normal HTML select; when you change it, React state updates and we filter the array before passing it to the chart, so the chart re-renders with the filtered data. I deployed it to Vercel so there's a live link — I'll put that and the repo in the description.

One thing I had to get right was making sure the chart had at least one real interaction, not just tooltips — so the dropdown counts as the “interactions” part of the theme.

**[~30 sec] THEME CALLOUT (required for +10)**

So again, Week 1’s theme is **data visualization and interactions**. This app is exactly that: we’re visualizing data in a chart, and we’re interacting with it via the filter. If you’re in the sprint too, I’d love to see what you built — drop a link in the comments or in the group.

**[~30 sec] COMPETITOR SHOUT-OUT (required for +10)**

Quick shout-out to [COMPETITOR NAME] — [e.g. “I saw their post about…” or “they built…” or “check out their take on the theme at…”]. Link in the description. That’s the kind of cross-reference the sprint encourages, so go give their work a look.

**[~15 sec] OUTRO**

That’s it for this one. I’ll put the live app and the repo in the description. See you next week with Week 2. Thanks for watching.

---

## Before you record

- [ ] Replace **[YOUR NAME]** in the intro.
- [ ] Replace **[COMPETITOR NAME/LINK]** with a real competitor — use their post, video, or app and say their name + what they did. Put the link in your video description.
- [ ] Have the **live app** (or localhost) open in a browser tab so you can share screen and demo.
- [ ] Zoom: **Share screen** (browser) + **PiP on** for the **entire** recording. Length: **≥5 min** (this script is ~5–6 min spoken at a normal pace).

## Video description (paste and fill in)

```
ChartSlice — Week 1: Data Visualization & Interactions | Spring Into AI Build Sprint

Interactive bar chart — slice the data by category. React + Vite + Recharts.

Live app: [YOUR LIVE APP URL]
Repo: [YOUR GITHUB REPO URL]

Shout-out: [COMPETITOR NAME] — [one line + link]
```
