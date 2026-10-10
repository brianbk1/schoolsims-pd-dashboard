# SchoolSims — Professional Learning Implementation

Vite + React app for the Professional Learning Implementation product
(non–Higher Education scope). Upload a district guide (PDF/DOCX) → Claude extracts
a structured implementation plan → the dashboard populates from the real result.

## Screens
**Set Up:** Plan Import (live upload + AI extraction) · AI Task Review
**Monitor:** Cohort Overview · Task Timeline · Competencies · Cohort Heat Map
**Drill Down:** Participant Detail · AI Narrative

## How extraction works
1. User uploads a PDF or DOCX (or pastes text) on the **Plan Import** screen.
2. The file is parsed to text **in the browser** (pdf.js / mammoth.js from CDN).
3. The text is POSTed to **`/api/extract`**, a Vercel serverless function.
4. That function calls the Anthropic API using the server-side key and returns
   structured JSON (program, activities, competencies, projects, risks, narrative).
5. The result flows into Review + every dashboard screen.

The Anthropic key lives ONLY on the server (env var). It is never in the browser bundle.

## Required: set the API key in Vercel
Vercel → your project → **Settings → Environment Variables**:
- Name: `ANTHROPIC_API_KEY`
- Value: your Anthropic API key (starts with `sk-ant-…`)
- Apply to Production (and Preview if you want preview deploys to work)

Then **redeploy**. Until this is set, uploads return a clear error and the app
falls back to sample data so the dashboard is still explorable.

Optional: edit the `MODEL` constant at the top of `api/extract.js` to match a model
id enabled on your account.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```
Local dev note: `/api/extract` only runs on Vercel (or `vercel dev`). With plain
`npm run dev` the upload call will fail and the app shows sample data — use
`vercel dev` locally if you want the API route live.

## Build
```bash
npm run build      # outputs to /dist
```

## Deploy to Vercel
Standard Vite app; `/api/extract.js` is auto-detected as a serverless function.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Add `ANTHROPIC_API_KEY` (above), then deploy.

## Best-practice enrichment
When a client uploads an imperfect or thin plan, the extraction pass ALSO proposes
anonymized **Suggested Additions** drawn from the strongest district programs
SchoolSims has reviewed (curated in `src/bestPractices.js`). The AI:
1. classifies the document archetype (leadership cohort / district PD system / induction),
2. compares it to the best-practice benchmark for that archetype,
3. proposes the highest-impact missing elements, each with a one-line rationale.

Suggestions render in their own green section on the **AI Task Review** screen,
visually distinct from district-source content and from SchoolSims product
recommendations. They are optional ideas a human accepts, edits, or dismisses —
never presented as the district's own requirements. If the model returns no
suggestions, a local fallback in `src/normalize.js` offers curated ones by archetype.

To expand the library, edit `src/bestPractices.js` (used for the fallback) and the
`BENCHMARKS` block in `api/extract.js` (used in the prompt). Keep everything anonymized.

## Implementation rules honored
- AI output is never auto-published; admin review + explicit publish required.
- District-source items and SchoolSims AI recommendations stay distinct.
- Absent fields are left blank — the extractor is instructed never to fabricate.
- Low-confidence extractions are flagged "needs review."
- Evidence lifecycle, "Competency Progress" wording, generalized Project+Milestones.
- No hard-coded district terminology.

## Files
```
api/extract.js     serverless extraction endpoint (holds the key)
src/App.jsx        app shell + all 8 screens, live-or-sample aware
src/parse.js       PDF/DOCX/text extraction in the browser
src/normalize.js   maps AI JSON → dashboard view-model
src/data.js        sample/fallback data + palette
src/styles.css     brand styles
```
