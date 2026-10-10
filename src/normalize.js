// Maps the AI extraction JSON into the view-model the dashboard screens consume.
// Also surfaces anonymized best-practice "suggested additions" that enrich thin plans.
// Everything degrades gracefully when fields are null/absent — we never fabricate.

import { BAR, COMP_COLORS } from './data.js'
import { SUGGESTED_ACTIVITIES, BENCHMARK_ELEMENTS } from './bestPractices.js'

const MONTH_ORDER = ["August","September","October","November","December","January","February","March","April","May","June","July"];

export function normalize(result) {
  const r = result || {};
  const program = r.program || {};
  const archetype = r.program_archetype || "other";
  const activities = Array.isArray(r.activities) ? r.activities : [];
  const competencies = Array.isArray(r.competencies) && r.competencies.length
    ? r.competencies : inferCompetencies(activities);

  // group activities by month, school-year order, unknowns last
  const byMonth = {};
  activities.forEach(a => { const m = a.month || "Unscheduled"; (byMonth[m] = byMonth[m] || []).push(a); });
  const months = Object.keys(byMonth).sort((a, b) => {
    const ai = MONTH_ORDER.indexOf(a), bi = MONTH_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  }).map(m => [m, byMonth[m].map(a => `${a.title}·${a.category || "Activity"}`)]);

  const typeCounts = {};
  activities.forEach(a => { const c = a.category || "Other"; typeCounts[c] = (typeCounts[c] || 0) + 1; });

  const compCards = competencies.map(name => {
    const n = activities.filter(a => a.competency === name).length;
    return [name, 0, n];
  });

  const pillars = (Array.isArray(r.pillars) && r.pillars.length
    ? r.pillars.map(p => p.name)
    : Object.keys(typeCounts)).slice(0, 8).map(name => [name, 0]);

  const districtItems = activities.map(a => ({
    title: a.title,
    flag: a.needs_review ? (a.review_note || "needs review") : (a.recurrence ? "recurrence detected" : null),
    deets: [
      a.category && `Category: ${a.category}`,
      a.audience && `Audience: ${a.audience}`,
      a.recurrence && `Recurrence: ${a.recurrence}`,
      a.due ? `Due: ${a.due}` : (a.month ? `Month: ${a.month}` : "Due: not found in source — left blank"),
      a.evidence && `Evidence: ${a.evidence}`,
    ].filter(Boolean).join(" · "),
    src: a.source_reference || "source reference unavailable",
  }));

  // SchoolSims simulation recommendations (optional product tie-ins) — kept distinct.
  const aiItems = (Array.isArray(r.ai_recommendations) ? r.ai_recommendations : []).map(x => ({
    title: x.title, deets: `Maps to competency: ${x.maps_to || "—"} · ${x.rationale || ""}`,
    src: "SchoolSims content library",
  }));

  // Best-practice suggested additions — from the model, with a local fallback.
  let suggestions = (Array.isArray(r.suggested_additions) ? r.suggested_additions : []).map(s => ({
    title: s.title,
    deets: [s.category && `Category: ${s.category}`, s.month && `Month: ${s.month}`, s.recurrence && `Recurrence: ${s.recurrence}`, s.evidence && `Evidence: ${s.evidence}`, s.competency && `Competency: ${s.competency}`].filter(Boolean).join(" · "),
    rationale: s.rationale || "",
  }));
  if (suggestions.length === 0) suggestions = fallbackSuggestions(archetype, activities);

  const flagged = activities.filter(a => a.needs_review).length;

  return {
    program: {
      name: program.name || "Imported Program",
      account: program.organization || "Imported from document",
      term: program.term || "Term not specified",
      participants: program.participants || "—",
      activities: activities.length,
      competenciesCount: competencies.length,
      overallCompletion: 0,
      status: "Draft — not yet published",
      archetype,
    },
    months, typeCounts, competencies, compCards, pillars,
    districtItems, aiItems, suggestions,
    gaps: Array.isArray(r.gaps_summary) ? r.gaps_summary : [],
    counts: { district: activities.length, ai: aiItems.length, flagged, published: 0, suggestions: suggestions.length },
    projects: Array.isArray(r.projects) ? r.projects : [],
    risks: Array.isArray(r.risks) ? r.risks : [],
    narrative: r.narrative || "No narrative was generated for this document.",
    raw: r,
  };
}

function inferCompetencies(activities) {
  const set = new Set();
  activities.forEach(a => { if (a.competency) set.add(a.competency); });
  return [...set];
}

// If the model proposes no suggestions, derive them from the curated library:
// offer benchmark activities whose title isn't already present in the plan.
function fallbackSuggestions(archetype, activities) {
  const key = SUGGESTED_ACTIVITIES[archetype] ? archetype
    : (archetype === "other" ? "district_pd_system" : archetype);
  const lib = SUGGESTED_ACTIVITIES[key] || [];
  const have = new Set(activities.map(a => (a.title || "").toLowerCase()));
  return lib
    .filter(s => !have.has(s.title.toLowerCase()))
    .slice(0, 8)
    .map(s => ({
      title: s.title,
      deets: [s.category && `Category: ${s.category}`, s.month && `Month: ${s.month}`, s.recurrence && `Recurrence: ${s.recurrence}`, s.evidence && `Evidence: ${s.evidence}`, s.competency && `Competency: ${s.competency}`].filter(Boolean).join(" · "),
      rationale: s.rationale || "",
    }));
}

export { BAR, COMP_COLORS, BENCHMARK_ELEMENTS };
