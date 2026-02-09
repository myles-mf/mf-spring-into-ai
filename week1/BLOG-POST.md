# Blog post — ChartSlice (Week 1)

**Use this wherever you decide to put it:** personal blog, Medium, Ghost, or a longer Substack.  
**Scoring:** 2 points (×2 with hosted + repo). Replace `[LIVE APP URL]`, `[REPO URL]`, and `[COMPETITOR NAME/LINK]` before publishing.

---

## Title

**ChartSlice: A Tiny Data Viz for Week 1 of the Spring Into AI Build Sprint**

---

## Body

I’m doing the Spring Into AI Build Sprint — five weeks, ship something every week, no judges, just points. Week 1’s theme was **data visualization and interactions**. So I built something small and called it **ChartSlice**.

### What it is

ChartSlice is a single-page app: a bar chart with a dropdown that lets you filter by category. You see monthly values; you pick “All,” “A,” or “B”; the chart updates. That’s it. The idea was to hit the theme without overbuilding: **data** on screen, **interaction** via the filter. No dashboards, no auth, no database — just a chart and a way to slice the data.

### Why keep it small

The competition rewards shipping. You get a multiplier for having a public repo and a hosted app, and bonus points for staying on theme and referencing other competitors. So the move was: one clear idea, get it live, then write and post. ChartSlice took a few hours. If I’d aimed for “real” product scope, I’d probably still be in the weeds.

### How it’s built

- **React 18 + Vite** for the app, **Recharts** for the chart.
- Data is an array in the component (you could swap in a CSV or API later).
- The filter is a `<select>`. On change, we filter the array and pass the result to the chart; React re-renders. No fancy state — just `useState` and a filtered slice.
- Deployed on Vercel. Repo is public so the build qualifies for the 2× multiplier.

**Try it:** [LIVE APP URL]  
**Code:** [REPO URL]

### What I’d do next

If I extended it: real data (e.g. a public API or CSV), a second chart type (e.g. line), or a date range slider. For Week 1, “one chart, one filter, shipped” was the goal.

### Shout-out

Part of the sprint is cross-referencing other builders. So: shout-out to [COMPETITOR NAME] for [what they did] — [link]. Worth a look if you’re following the competition.

---

If you’re in the sprint too, drop your Week 1 build in the comments or ping me. More next week.

---

**Before you publish:** Replace [LIVE APP URL], [REPO URL], and [COMPETITOR NAME] / [link] with your real values.
