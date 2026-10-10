// Vercel serverless function: POST /api/extract
// Receives { text } (document text) and returns structured implementation-plan JSON
// extracted by Claude — PLUS anonymized best-practice "suggested additions" that
// enrich a thin or imperfect plan toward the quality of the strongest guides.
// The Anthropic API key is read from the server-side env var ANTHROPIC_API_KEY and
// is NEVER exposed to the browser.

const MODEL = "claude-sonnet-4-6"; // model id enabled on this account (verified via /v1/models)

// Anonymized best-practice reference (distilled from top district programs).
// Kept inline so this serverless file has no imports. Never name a real district.
const BENCHMARKS = `ANONYMIZED BEST-PRACTICE REFERENCE (from the strongest district programs SchoolSims has reviewed; NEVER name a district):
- leadership_cohort: Month-by-month "Year at a Glance" activity map (Aug–Jul); a named leadership competency framework (lead with courage, build culture, develop people, manage operations, lead academics, beliefs & values); monthly 1:1 coaching logged as evidence; an individual 70/20/10 growth plan; a multi-milestone improvement project (charter → approval → mid-point → presentation → reflection); recurring monthly job-embedded experiences; per-activity evidence requirements; leadership readiness criteria; end-of-year reflection; simulation practice aligned to each competency.
- district_pd_system: a defined professional-learning cycle (plan → learn → implement → evaluate); vision/mission/beliefs; a needs-assessment process using multiple data sources; roles and responsibilities for providers and participants; in-service credit/hours tracking and approval; implementation-level evaluation (not just satisfaction); alignment to recognized PD standards; individual/school/district plans that ladder up; a central online system of record.
- induction: a two-year mentor model with a named mentor; a scheduled 1:1 mentoring cadence logged as evidence; first-year milestones (orientation, observation cycles, reflection); competency growth tracked to a teaching framework; clear completion requirements; coordinator visibility into who is behind.`;

const SYSTEM_PROMPT = `You are the SchoolSims AI Guidebook Ingestion Engine.

You convert a district professional-learning / leadership / induction / accreditation
document into a STRUCTURED implementation plan, AND you enrich thin plans with
anonymized best-practice suggestions. Follow these rules exactly:

EXTRACTION (district-authored content):
- Extract only what the document supports. If a field is absent, use null or an empty
  array — NEVER fabricate dates, owners, competencies, or evidence requirements.
- Mark each extracted activity's "origin" as "district_source".
- Flag low-confidence or ambiguous extractions with "needs_review": true and a short note.
- Generalize any "School Improvement Project" style item as a Project with milestones.

CLASSIFY:
- Set "program_archetype" to one of: "leadership_cohort", "district_pd_system",
  "induction", or "other", based on what the document actually is.

ENRICH (suggested additions — clearly separate from district content):
- Compare the uploaded plan against the ANONYMIZED BEST-PRACTICE REFERENCE below for
  the matching archetype.
- For proven elements the plan is MISSING or thin on, propose "suggested_additions".
- Each suggestion must be anonymized (never name a district), marked
  "origin": "best_practice_suggestion", and include a one-sentence "rationale"
  explaining why strong programs include it.
- Do NOT duplicate something the plan already has. Prefer the few highest-impact gaps
  (max 8 suggestions). Suggestions are optional ideas a human will review — never
  presented as the district's own requirements.

${BENCHMARKS}

Return ONLY valid minified JSON (no markdown, no backticks, no commentary) with this shape:
{
  "program": { "name": string|null, "organization": string|null, "term": string|null, "audience": string|null, "participants": number|null },
  "program_archetype": "leadership_cohort"|"district_pd_system"|"induction"|"other",
  "pillars": [ { "name": string, "source": string|null } ],
  "competencies": [ string ],
  "activities": [ { "title": string, "category": string, "month": string|null, "due": string|null, "required": boolean|null, "recurrence": string|null, "evidence": string|null, "competency": string|null, "origin": "district_source", "source_reference": string|null, "needs_review": boolean, "review_note": string|null } ],
  "projects": [ { "title": string, "milestones": [ string ], "source_reference": string|null } ],
  "suggested_additions": [ { "title": string, "category": string, "month": string|null, "recurrence": string|null, "evidence": string|null, "competency": string|null, "origin": "best_practice_suggestion", "rationale": string } ],
  "gaps_summary": [ string ],
  "risks": [ string ],
  "narrative": string
}`;

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY. Add it in Vercel → Settings → Environment Variables, then redeploy." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const text = (body && body.text ? String(body.text) : "").trim();
  if (text.length < 40) { res.status(400).json({ error: "Document text is empty or too short to extract from." }); return; }

  const docText = text.slice(0, 60000);

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Extract and enrich the implementation plan from this document:\n\n${docText}` }],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      res.status(502).json({ error: "Upstream model error", detail: errText.slice(0, 500) });
      return;
    }

    const data = await r.json();
    const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    const clean = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { res.status(502).json({ error: "Model did not return valid JSON.", raw: clean.slice(0, 800) }); return; }

    res.status(200).json({ ok: true, result: parsed });
  } catch (e) {
    res.status(500).json({ error: "Extraction failed", detail: String(e).slice(0, 300) });
  }
}
