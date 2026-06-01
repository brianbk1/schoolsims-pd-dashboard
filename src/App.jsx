import { useState } from "react";

const COLORS = {
  navy: "#1E2D6B",
  navyDark: "#131E4A",
  maroon: "#8B1A2E",
  maroonLight: "#F6EAEC",
  blue: "#2E6DB4",
  blueLight: "#E8F0FA",
  white: "#FFFFFF",
  bg: "#F4F5FA",
  border: "#D6DAE8",
  text: "#1E2D6B",
  muted: "#6B7A9A",
  success: "#2E6B50",
  warning: "#8B5A1A",
  danger: "#8B1A2E",
  successLight: "#E8F4EF",
  warningLight: "#FBF3E8",
  dangerLight: "#F6EAEC",
};

const COMP_COLORS = {
  "Lead with Courage": "#8B1A2E",
  "Build Culture": "#1E2D6B",
  "Lead Academics": "#2E6DB4",
  "Develop People": "#5A3472",
  "Manage Operations": "#2E6B50",
  "Beliefs & Values": "#8B5A1A",
};

const MONTH_COLORS = ["#8B1A2E","#1E2D6B","#9E2235","#253580","#7A1728","#172560","#8B1A2E","#1E2D6B","#9E2235","#253580"];
const MONTHS_ORDER = ["August","September","October","November","December","January","February","March","April","May"];

const SAMPLE = {
  program: "APS Aspiring Leaders Program",
  organization: "Atlanta Public Schools",
  duration: "August – May",
  participants: 42,
  competencies: ["Lead with Courage","Build Culture","Lead Academics","Develop People","Manage Operations","Beliefs & Values"],
  pillars: ["Professional Development","Hands-On Practice","Community of Practice","Personalized Coaching","70/20/10 Development Plan"],
  overallCompletion: 18,
  pillarProgress: {
    "Professional Development": 20,
    "Essential Experiences": 20,
    "School Improvement Project": 25,
    "Coaching": 15,
    "70/20/10 Plan": 10,
    "Community of Practice": 10,
  },
  competencyScores: {
    "Lead with Courage": 22,
    "Build Culture": 18,
    "Lead Academics": 15,
    "Develop People": 20,
    "Manage Operations": 12,
    "Beliefs & Values": 25,
  },
  narrative: "The APS Aspiring Leaders Program is a comprehensive, year-long leadership development initiative designed to prepare 42 high-potential educators for school leadership roles within Atlanta Public Schools. Structured across the full academic year from August through May, the program integrates five core pillars — Professional Development, Hands-On Practice, Community of Practice, Personalized Coaching, and individualized 70/20/10 Development Plans — to develop leaders across six PSEL-aligned competency domains. Participants engage in monthly coaching sessions, school improvement projects, essential experiences, and simulation-based practice to bridge theory and applied leadership. The program's multi-modal design ensures both accountability and growth, culminating in a formal School Improvement Project presentation and end-of-year reflection.",
  risks: [
    "Early-stage completion rates (10–25%) suggest participants may need proactive outreach and accountability structures to maintain momentum through Q2.",
    "Coaching session completion is the lowest-tracked pillar at 15% — consistent scheduling and coach capacity should be monitored closely.",
    "School Improvement Projects require early charter approval; delays in September could compress milestone timelines in spring months.",
  ],
  recommendations: [
    "Implement bi-weekly cohort check-ins through November to establish habits before holiday disruptions affect momentum.",
    "Assign simulation experiences in October aligned to the Courageous Conversations workshop to reinforce applied learning.",
    "Build a shared digital evidence portfolio system by September to reduce artifact submission friction in April–May.",
  ],
  months: [
    { month: "August", tasks: [
      { title: "Attend Program Orientation", type: "Workshop", competency: "Beliefs & Values" },
      { title: "Review Program Expectations", type: "Planning", competency: "Beliefs & Values" },
      { title: "Meet Assigned Coach", type: "Coaching", competency: "Develop People" },
      { title: "Submit School Improvement Project Charter", type: "Project", competency: "Lead Academics" },
    ]},
    { month: "September", tasks: [
      { title: "Obtain Project Approval", type: "Project", competency: "Lead Academics" },
      { title: "Complete Monthly Essential Experience", type: "Experience", competency: "Lead with Courage" },
      { title: "Coaching Session #1", type: "Coaching", competency: "Develop People" },
      { title: "Create 70/20/10 Plan", type: "Planning", competency: "Beliefs & Values" },
    ]},
    { month: "October", tasks: [
      { title: "Attend Courageous Conversations Workshop", type: "Workshop", competency: "Lead with Courage" },
      { title: "Coaching Session #2", type: "Coaching", competency: "Develop People" },
      { title: "Receive 70/20/10 Plan Approval", type: "Planning", competency: "Beliefs & Values" },
    ]},
    { month: "November", tasks: [
      { title: "Complete Data Analysis Activity", type: "Assessment", competency: "Lead Academics" },
      { title: "Monthly Essential Experience", type: "Experience", competency: "Lead with Courage" },
      { title: "Coaching Session #3", type: "Coaching", competency: "Develop People" },
    ]},
    { month: "December", tasks: [
      { title: "Complete Mock Interview", type: "Assessment", competency: "Lead with Courage" },
      { title: "Upload Reflection and Feedback", type: "Reflection", competency: "Beliefs & Values" },
    ]},
    { month: "January", tasks: [
      { title: "Complete Operations Learning Module", type: "Workshop", competency: "Manage Operations" },
      { title: "Create School Budget Reflection", type: "Reflection", competency: "Manage Operations" },
    ]},
    { month: "February", tasks: [
      { title: "Create School Culture Improvement Plan", type: "Project", competency: "Build Culture" },
      { title: "Submit Community Engagement Action Plan", type: "Project", competency: "Build Culture" },
    ]},
    { month: "March", tasks: [
      { title: "Complete Talent Development Action Plan", type: "Planning", competency: "Develop People" },
      { title: "Document Coaching Cycle Evidence", type: "Reflection", competency: "Develop People" },
    ]},
    { month: "April", tasks: [
      { title: "Complete Supplemental Learning Requirement", type: "Experience", competency: "Lead Academics" },
      { title: "Upload Final Project Artifacts", type: "Project", competency: "Lead Academics" },
    ]},
    { month: "May", tasks: [
      { title: "Present School Improvement Project", type: "Assessment", competency: "Lead Academics" },
      { title: "Complete End-of-Year Reflection", type: "Reflection", competency: "Beliefs & Values" },
    ]},
  ],
};

function ProgressBar({ pct, color = COLORS.maroon, height = 8 }) {
  return (
    <div style={{ background: COLORS.border, borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Badge({ label, color = COLORS.maroon }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11,
      fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase",
      background: color + "22", color, border: `1px solid ${color}44`,
    }}>{label}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function StatTile({ label, value, icon, color = COLORS.navy }) {
  return (
    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

const COMP_ICONS = {
  "Lead with Courage": "💪",
  "Build Culture": "🌱",
  "Lead Academics": "📚",
  "Develop People": "🤝",
  "Manage Operations": "⚙️",
  "Beliefs & Values": "🎯",
};

const TYPE_ICONS = {
  Workshop: "🏫", Coaching: "🗣️", Project: "📋", Reflection: "✍️",
  Experience: "🌟", Assessment: "📝", Planning: "🗺️",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const d = SAMPLE;
  const allTasks = d.months.flatMap(m => m.tasks.map(t => ({ ...t, month: m.month })));
  const tasksByType = allTasks.reduce((acc, t) => { acc[t.type] = (acc[t.type] || 0) + 1; return acc; }, {});

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "tasks", label: "📅 Task Timeline" },
    { id: "competencies", label: "🎯 Competencies" },
    { id: "narrative", label: "🤖 AI Narrative" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Georgia', serif" }}>

      {/* ── Nav ── */}
      <div style={{ background: COLORS.navy, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="https://www.schoolsims.com/wp-content/uploads/2025/01/WebsiteLogo.png"
            alt="SchoolSims"
            style={{ height: 38, objectFit: "contain", filter: "brightness(0) invert(1)" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div style={{ display: "none", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: COLORS.maroon, borderRadius: 8, alignItems: "center", justifyContent: "center", fontWeight: 900, color: COLORS.white, fontSize: 16, display: "flex" }}>S</div>
            <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 18 }}>SchoolSims</span>
          </div>
          <span style={{ color: "#8A9CC8", fontSize: 13, marginLeft: 2 }}>/ AI Cohort Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge label="AI Generated" color={COLORS.maroon} />
          <Badge label="Sample Preview" color={COLORS.navy} />
        </div>
      </div>

      {/* ── Program Header ── */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navyDark} 0%, ${COLORS.navy} 55%, #243580 100%)`, padding: "40px 32px 0", color: COLORS.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
            <div>
              <div style={{ color: COLORS.maroon, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                {d.organization}
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>{d.program}</h1>
              <div style={{ color: "#A0B4CC", fontSize: 13, display: "flex", gap: 24, flexWrap: "wrap" }}>
                <span>📅 {d.duration}</span>
                <span>👥 {d.participants} Participants</span>
                <span>📚 {d.months.length} Months</span>
                <span>✅ {allTasks.length} Tasks</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.maroon, lineHeight: 1 }}>{d.overallCompletion}%</div>
              <div style={{ color: "#A0B4CC", fontSize: 12, marginBottom: 8 }}>Overall Completion</div>
              <div style={{ width: 180 }}>
                <ProgressBar pct={d.overallCompletion} color={COLORS.maroon} height={6} />
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "10px 20px", background: activeTab === tab.id ? COLORS.white : "transparent",
                color: activeTab === tab.id ? COLORS.navy : "#A0B4CC", border: "none",
                borderRadius: "8px 8px 0 0", cursor: "pointer",
                fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 13,
                fontFamily: "inherit", transition: "all 0.15s",
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              <StatTile label="Participants" value={d.participants} icon="👥" color={COLORS.navy} />
              <StatTile label="Total Tasks" value={allTasks.length} icon="✅" color={COLORS.maroon} />
              <StatTile label="Competencies" value={d.competencies.length} icon="🎯" color={COLORS.navy} />
              <StatTile label="Program Months" value={d.months.length} icon="📅" color={COLORS.maroon} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
              <Card>
                <h3 style={{ color: COLORS.navy, fontWeight: 800, fontSize: 15, marginTop: 0, marginBottom: 20 }}>Program Pillar Progress</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {Object.entries(d.pillarProgress).map(([pillar, pct], i) => (
                    <div key={pillar}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{pillar}</span>
                        <span style={{ fontSize: 13, color: COLORS.muted, fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <ProgressBar pct={pct} color={Object.values(COMP_COLORS)[i % 6]} />
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card>
                  <h3 style={{ color: COLORS.navy, fontWeight: 800, fontSize: 15, marginTop: 0, marginBottom: 16 }}>Tasks by Type</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {Object.entries(tasksByType).map(([type, count], i) => (
                      <div key={type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 15 }}>{TYPE_ICONS[type] || "•"}</span>
                          <span style={{ fontSize: 13, color: COLORS.text }}>{type}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 5, background: COLORS.border, borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ width: `${(count / allTasks.length) * 100}%`, height: "100%", background: Object.values(COMP_COLORS)[i % 6], borderRadius: 99 }} />
                          </div>
                          <span style={{ fontWeight: 800, color: COLORS.navy, fontSize: 14, minWidth: 16, textAlign: "right" }}>{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card style={{ background: COLORS.warningLight, borderColor: `${COLORS.warning}33` }}>
                  <h3 style={{ color: COLORS.warning, fontWeight: 800, fontSize: 13, marginTop: 0, marginBottom: 12 }}>⚠ AI Action Alerts</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {d.risks.map((r, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#7D5A00", lineHeight: 1.6, paddingLeft: 10, borderLeft: `2px solid ${COLORS.warning}` }}>{r}</div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <Card style={{ background: COLORS.navyLight, borderColor: `${COLORS.navy}44` }}>
              <h3 style={{ color: COLORS.navy, fontWeight: 800, fontSize: 15, marginTop: 0, marginBottom: 16 }}>💡 AI Recommendations</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {d.recommendations.map((rec, i) => (
                  <div key={i} style={{ background: COLORS.white, borderRadius: 10, padding: 16, fontSize: 13, color: COLORS.text, lineHeight: 1.7, borderLeft: `3px solid ${COLORS.navy}` }}>
                    <span style={{ fontWeight: 700, color: COLORS.navy }}>#{i + 1} </span>{rec}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TASK TIMELINE */}
        {activeTab === "tasks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {d.months.map((m, mi) => {
              const mColor = MONTH_COLORS[mi % MONTH_COLORS.length];
              return (
                <div key={m.month} style={{ display: "flex", gap: 0 }}>
                  <div style={{ width: 110, flexShrink: 0, paddingTop: 18, paddingRight: 16, textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: mColor, fontSize: 14 }}>{m.month}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{m.tasks.length} tasks</div>
                  </div>
                  <div style={{ width: 2, background: `${mColor}33`, flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", top: 22, left: -5, width: 12, height: 12, borderRadius: 99, background: mColor, border: `2px solid ${COLORS.white}`, boxShadow: `0 0 0 2px ${mColor}` }} />
                  </div>
                  <div style={{ flex: 1, paddingLeft: 24, paddingBottom: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, paddingTop: 10 }}>
                      {m.tasks.map((task, ti) => (
                        <div key={ti} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${mColor}` }}>
                          <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13, marginBottom: 8, lineHeight: 1.4 }}>
                            {TYPE_ICONS[task.type] || "•"} {task.title}
                          </div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <Badge label={task.type} color={mColor} />
                            {task.competency && <Badge label={task.competency} color={COMP_COLORS[task.competency] || COLORS.muted} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* COMPETENCIES */}
        {activeTab === "competencies" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {d.competencies.map((comp) => {
                const score = d.competencyScores[comp] ?? 0;
                const color = COMP_COLORS[comp] || COLORS.navy;
                const related = allTasks.filter(t => t.competency === comp);
                return (
                  <Card key={comp}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                        {COMP_ICONS[comp] || "🎯"}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 28, color, lineHeight: 1 }}>{score}%</div>
                    </div>
                    <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15, marginBottom: 3 }}>{comp}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>{related.length} tasks aligned</div>
                    <ProgressBar pct={score} color={color} height={6} />
                    {related.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Aligned Tasks</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {related.map((t, i) => (
                            <div key={i} style={{ fontSize: 12, color: COLORS.text, display: "flex", gap: 6, alignItems: "flex-start" }}>
                              <span style={{ color, marginTop: 1, flexShrink: 0 }}>›</span>
                              <span style={{ lineHeight: 1.4 }}>{t.title}</span>
                              <span style={{ color: COLORS.muted, marginLeft: "auto", flexShrink: 0, fontSize: 11 }}>{t.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* NARRATIVE */}
        {activeTab === "narrative" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, background: COLORS.navy, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 16 }}>AI Executive Narrative</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>Auto-generated from uploaded guidebook</div>
                </div>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 10, padding: 24, borderLeft: `4px solid ${COLORS.maroon}` }}>
                <p style={{ color: COLORS.text, lineHeight: 1.9, fontSize: 15, margin: 0 }}>{d.narrative}</p>
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <Card style={{ background: COLORS.dangerLight, borderColor: `${COLORS.danger}33` }}>
                <h3 style={{ color: COLORS.danger, fontWeight: 800, marginTop: 0, marginBottom: 16, fontSize: 15 }}>⚠ Risk Areas</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {d.risks.map((r, i) => (
                    <div key={i} style={{ background: COLORS.white, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                      <span style={{ color: COLORS.danger, fontWeight: 700 }}>Risk {i + 1}:</span> {r}
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ background: COLORS.successLight, borderColor: `${COLORS.success}33` }}>
                <h3 style={{ color: COLORS.success, fontWeight: 800, marginTop: 0, marginBottom: 16, fontSize: 15 }}>✅ Recommendations</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {d.recommendations.map((r, i) => (
                    <div key={i} style={{ background: COLORS.white, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                      <span style={{ color: COLORS.success, fontWeight: 700 }}>#{i + 1}:</span> {r}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <h3 style={{ color: COLORS.navy, fontWeight: 800, marginTop: 0, marginBottom: 20, fontSize: 15 }}>Program Summary</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <tbody>
                  {[
                    ["Program", d.program],
                    ["Organization", d.organization],
                    ["Duration", d.duration],
                    ["Participants", d.participants],
                    ["Total Tasks", allTasks.length],
                    ["Competencies", d.competencies.join(", ")],
                    ["Program Pillars", d.pillars.join(", ")],
                    ["Overall Completion", `${d.overallCompletion}%`],
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: "10px 0", color: COLORS.muted, fontWeight: 600, width: 180 }}>{label}</td>
                      <td style={{ padding: "10px 0", color: COLORS.text }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: COLORS.navy, padding: "20px 32px", marginTop: 40, textAlign: "center" }}>
        <div style={{ color: "#6B8CAE", fontSize: 12 }}>
          SchoolSims AI Guidebook Engine · APS Aspiring Leaders Sample · For demonstration purposes only
        </div>
      </div>
    </div>
  );
}
