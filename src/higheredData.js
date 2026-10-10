// Higher Ed cohort — ALL FICTIONAL TEST DATA.
// Models the SchoolSims "Professional Standard Summary Report": per-candidate
// simulation usage + AI-generated alignment narratives across standards frameworks.
// Names and emails are deliberately obvious placeholders.

export const FRAMEWORKS = ["InTASC","PSEL","NELP","CAEP","CPSEL","AAQEP","MCEE"];

export const heProgram = {
  institution: "Example University",
  program: "MAT Program",
  term: "Fall 2026",
};

export const heStats = {
  candidates: 24,
  simsPlayed: 61,
  reportsSaved: 18,
  frameworks: 7,
  engagement: 75, // %
};

// cohort-average alignment per framework (0-100)
export const cohortAlignment = { InTASC:78, PSEL:64, NELP:52, CAEP:61, CPSEL:58, AAQEP:55, MCEE:70 };

// proficiency distribution
export const proficiency = { Emerging:6, Developing:14, Proficient:4 };

// sims played per week
export const engagementSeries = [
  ["Wk 1",3],["Wk 2",5],["Wk 3",8],["Wk 4",7],["Wk 5",11],["Wk 6",9],["Wk 7",10],["Wk 8",8],
];

const sims = ["Managing Classroom Disruptions","Supporting Student Identities","Classroom Challenges: Learning Loss","Navigating a Classroom Crisis","Family Engagement Conference","Data-Informed Planning"];

export const candidates = [
  { id:"c1", name:"Testy McTestface", prog:"Elementary Ed Candidate", email:"testy.mctestface@example-university.test",
    sims:["Managing Classroom Disruptions","Supporting Student Identities","Classroom Challenges: Learning Loss","Navigating a Classroom Crisis"], status:"complete", level:"pro",
    snap:"Proficient alignment with InTASC Standards 2 & 3 — learner differences and learning environments. Feedback reflects consistent de-escalation strategy and inclusive, identity-affirming decision-making.",
    detail:{InTASC:"Proficient — strong, repeated evidence of learner-differences awareness and positive learning environments across four simulations.",PSEL:"Developing — ethical, equity-minded decisions; emerging stakeholder engagement.",NELP:"Emerging — limited leadership-scenario evidence to date.",CAEP:"Developing — reflective practice evident in saved reports.",CPSEL:"Developing — attention to fairness and community context.",AAQEP:"Developing — applied practice forming.",MCEE:"Proficient — clear, consistent ethical reasoning."} },
  { id:"c2", name:"Samwise Sampleton", prog:"Secondary Ed Candidate", email:"samwise.sampleton@example-university.test",
    sims:["Navigating a Classroom Crisis","Managing Classroom Disruptions","Supporting Student Identities"], status:"progress", level:"dev",
    snap:"Partial alignment with InTASC Standard 3. Early responses suggest growth in proactive behavior management and culturally responsive framing.",
    detail:{InTASC:"Developing — growth in behavior management; environment framing improving.",PSEL:"Emerging.",NELP:"Emerging.",CAEP:"Developing — beginning to reflect on practice.",CPSEL:"Emerging.",AAQEP:"Emerging.",MCEE:"Developing — sound early ethical instincts."} },
  { id:"c3", name:"Placeholder Perez", prog:"Special Ed Candidate", email:"placeholder.perez@example-university.test",
    sims:["Data-Informed Planning","Supporting Student Identities","Managing Classroom Disruptions","Family Engagement Conference","Navigating a Classroom Crisis"], status:"complete", level:"pro",
    snap:"Proficient across InTASC 2, 3 & 7. Evidence of individualized intervention and data-informed planning in IEP-focused scenarios.",
    detail:{InTASC:"Proficient — individualized intervention and planning evidence.",PSEL:"Developing.",NELP:"Developing — some systems-level thinking.",CAEP:"Proficient — data-informed planning clearly demonstrated.",CPSEL:"Developing.",AAQEP:"Developing.",MCEE:"Proficient."} },
  { id:"c4", name:"Dummy Dubois", prog:"Elementary Ed Candidate", email:"dummy.dubois@example-university.test",
    sims:["Managing Classroom Disruptions","Classroom Challenges: Learning Loss"], status:"progress", level:"dev",
    snap:"Developing alignment with InTASC Standard 3. Beginning to balance consequences with relationship preservation.",
    detail:{InTASC:"Developing.",PSEL:"Emerging.",NELP:"Emerging.",CAEP:"Emerging.",CPSEL:"Emerging.",AAQEP:"Emerging.",MCEE:"Developing."} },
  { id:"c5", name:"Example Nguyen", prog:"Secondary Ed Candidate", email:"example.nguyen@example-university.test",
    sims:["Supporting Student Identities"], status:"progress", level:"em",
    snap:"Emerging alignment. One simulation played; additional evidence needed to assess standards across frameworks.",
    detail:{InTASC:"Emerging.",PSEL:"Emerging.",NELP:"Insufficient evidence yet.",CAEP:"Emerging.",CPSEL:"Insufficient evidence yet.",AAQEP:"Emerging.",MCEE:"Emerging."} },
  { id:"c6", name:"Sample Student Jr.", prog:"Special Ed Candidate", email:"sample.student.jr@example-university.test",
    sims:[], status:"notstarted", level:null,
    snap:"Standards snapshot will generate once a feedback report is saved.",
    detail:null },
  { id:"c7", name:"Mock Amari", prog:"Elementary Ed Candidate", email:"mock.amari@example-university.test",
    sims:["Managing Classroom Disruptions","Family Engagement Conference","Data-Informed Planning"], status:"complete", level:"dev",
    snap:"Developing-to-proficient alignment with InTASC 3 & CAEP. Strong family-engagement framing in conference scenario.",
    detail:{InTASC:"Developing.",PSEL:"Developing.",NELP:"Emerging.",CAEP:"Developing — family engagement evidence.",CPSEL:"Developing.",AAQEP:"Developing.",MCEE:"Developing."} },
  { id:"c8", name:"Fakename Olsen", prog:"Secondary Ed Candidate", email:"fakename.olsen@example-university.test",
    sims:["Navigating a Classroom Crisis","Data-Informed Planning"], status:"progress", level:"em",
    snap:"Emerging alignment. Crisis-response evidence present; assessment and leadership frameworks not yet demonstrated.",
    detail:{InTASC:"Emerging.",PSEL:"Emerging.",NELP:"Insufficient evidence yet.",CAEP:"Emerging.",CPSEL:"Emerging.",AAQEP:"Emerging.",MCEE:"Emerging."} },
];

export const cohortNarrative = "Across 24 candidates in the Example University MAT cohort, AI analysis of 18 saved feedback reports shows developing-to-proficient practice in ethical decision-making and learning environments (InTASC Standards 2 & 3), with the strongest evidence in de-escalation strategy and inclusive, identity-affirming responses. The cohort is emerging in data-informed instructional planning and family/community engagement, where fewer candidates have yet produced evidence. Simulation engagement is concentrated in classroom-management scenarios; candidates who have not yet played leadership or assessment simulations show gaps in NELP and CAEP alignment. Recommended focus: assign assessment- and family-engagement-oriented simulations to the candidates currently showing emerging alignment, and surface proficient candidates as peer exemplars.";
