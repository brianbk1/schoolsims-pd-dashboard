// Anonymized best-practice library.
// Distilled from the strongest professional-learning / leadership guides SchoolSims
// has reviewed across districts. NO district names or identifying details — these are
// generalized patterns used to (a) prompt the extraction model and (b) render
// "Suggested Additions" when a client's uploaded plan is missing proven elements.
//
// Each benchmark names the program archetype it fits, so suggestions are relevant to
// the kind of plan the client uploaded.

export const PROGRAM_ARCHETYPES = {
  LEADERSHIP_COHORT: "leadership_cohort",   // aspiring leaders / principal pipeline
  DISTRICT_PD_SYSTEM: "district_pd_system", // division-wide PD system / manual
  INDUCTION: "induction",                   // new-teacher / new-admin induction
};

// Hallmarks a strong plan of each archetype contains. Used to detect gaps.
export const BENCHMARK_ELEMENTS = {
  leadership_cohort: [
    "Month-by-month 'Year at a Glance' activity map (Aug–Jul)",
    "Named leadership competency framework (e.g., lead with courage, build culture, develop people, manage operations, lead academics, beliefs & values)",
    "Monthly 1:1 coaching sessions with a named coach, logged as evidence",
    "Individual growth plan using a 70/20/10 model (on-the-job / peer / formal)",
    "A multi-milestone improvement project: charter → approval → mid-point → presentation → reflection",
    "Essential/job-embedded experiences recurring monthly",
    "Evidence requirements per activity (attendance, artifact, reflection, coaching note, approval sign-off)",
    "Leadership readiness criteria tied to role progression",
    "End-of-year reflection and next-year planning",
    "Simulation-based practice aligned to each competency",
  ],
  district_pd_system: [
    "A defined professional-learning cycle (plan → learn → implement → evaluate)",
    "Vision, mission, and belief statements",
    "Needs-assessment process using multiple data sources",
    "Roles and responsibilities for providers and participants",
    "In-service credit / hours tracking and approval workflow",
    "Evaluation at the implementation level (not just satisfaction)",
    "Alignment to recognized PD standards (e.g., Learning Forward / state protocol)",
    "Individual, school, and district learning plans that ladder up",
    "A central online system of record for registration and completion",
  ],
  induction: [
    "Two-year structured mentor model with a named mentor",
    "Scheduled 1:1 mentoring cadence (e.g., weekly/biweekly) logged as evidence",
    "First-year milestones: orientation, observation cycles, reflection",
    "Competency growth tracked against a teaching framework",
    "Clear completion / program-exit requirements",
    "Coordinator visibility into participants falling behind",
  ],
};

// Concrete, ready-to-insert suggested activities, anonymized. These are what the
// Review screen offers as "Suggested Additions" when the matching element is missing.
export const SUGGESTED_ACTIVITIES = {
  leadership_cohort: [
    { title:"Program Orientation & Cohort Kickoff", category:"Workshop", month:"August", evidence:"Attendance", competency:"Beliefs & Values", rationale:"Top programs open with a shared kickoff that sets expectations and builds cohort identity." },
    { title:"Monthly 1:1 Coaching Session", category:"Coaching/Mentoring", month:"September", recurrence:"Monthly (Sep–May)", evidence:"Coaching Note", competency:"Develop People", rationale:"A consistent monthly coaching cadence with logged notes is the single most common feature of strong leadership programs." },
    { title:"Create Individual 70/20/10 Growth Plan", category:"Planning", month:"September", evidence:"Artifact/File + Approval", competency:"Beliefs & Values", rationale:"Best-practice programs anchor growth in a 70/20/10 plan (on-the-job, peer, formal) approved early in the year." },
    { title:"Improvement Project — Charter", category:"Project", month:"August", evidence:"Artifact + Approval sign-off", competency:"Lead Academics", rationale:"Strong programs require an authentic improvement project; it starts with an approved charter." },
    { title:"Improvement Project — Mid-Point Review", category:"Project", month:"January", evidence:"Artifact", competency:"Lead Academics", rationale:"A mid-year checkpoint keeps multi-month projects on track." },
    { title:"Improvement Project — Final Presentation", category:"Assessment", month:"May", evidence:"Presentation + Reflection", competency:"Lead Academics", rationale:"Culminating presentation is how leading programs demonstrate applied growth." },
    { title:"Monthly Essential Experience", category:"Experience", month:"September", recurrence:"Monthly", evidence:"Reflection", competency:"Lead with Courage", rationale:"Recurring job-embedded experiences turn theory into practice each month." },
    { title:"End-of-Year Reflection & Next-Year Planning", category:"Reflection", month:"May", evidence:"Reflection", competency:"Beliefs & Values", rationale:"Closing reflection plus forward planning sustains growth into the next cycle." },
  ],
  district_pd_system: [
    { title:"Annual Needs Assessment", category:"Planning", month:"August", evidence:"Artifact/File", competency:null, rationale:"Strong PD systems begin each cycle by analyzing multiple data sources to set priorities." },
    { title:"Individual Professional Learning Plan", category:"Planning", month:"September", evidence:"Artifact + Approval", competency:null, rationale:"Leading systems have each educator maintain an individual plan that ladders up to school/district goals." },
    { title:"PLC / Community of Practice Cycle", category:"PLC/Community of Practice", month:"September", recurrence:"Monthly", evidence:"Attendance + Reflection", competency:null, rationale:"Ongoing collaborative learning cycles are a hallmark of high-quality PD systems." },
    { title:"Implementation-Level Evaluation", category:"Assessment", month:"May", evidence:"Survey + Artifact", competency:null, rationale:"Best practice evaluates whether learning changed practice — not just satisfaction." },
    { title:"In-Service Credit Review & Approval", category:"Meeting", month:"June", evidence:"Approval sign-off", competency:null, rationale:"A clear credit/hours approval workflow keeps completion auditable." },
  ],
  induction: [
    { title:"New-Educator Orientation", category:"Workshop", month:"August", evidence:"Attendance", competency:null, rationale:"Strong induction opens with a structured orientation before the year begins." },
    { title:"Weekly Mentor Check-In", category:"Coaching/Mentoring", month:"September", recurrence:"Weekly", evidence:"Coaching Note", competency:null, rationale:"A consistent, logged mentoring cadence is the backbone of effective induction." },
    { title:"Observation & Feedback Cycle", category:"Observation", month:"October", recurrence:"Quarterly", evidence:"Coaching Note", competency:null, rationale:"Regular observation cycles with feedback drive early-career growth." },
    { title:"End-of-Year Induction Reflection", category:"Reflection", month:"May", evidence:"Reflection", competency:null, rationale:"Closing reflection documents growth and informs year-two support." },
  ],
};

// Compact text block injected into the extraction prompt so the model proposes
// relevant, anonymized gap-fills. Kept short to control token cost.
export function benchmarkPromptBlock(){
  const lines = [];
  lines.push("ANONYMIZED BEST-PRACTICE REFERENCE (from top district programs; never name a district):");
  for (const [arch, els] of Object.entries(BENCHMARK_ELEMENTS)) {
    lines.push(`- ${arch}: ` + els.join("; "));
  }
  return lines.join("\n");
}
