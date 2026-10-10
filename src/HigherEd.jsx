import React, { useState, useEffect, useRef } from 'react'
import * as HE from './higheredData.js'

const BAR = ["#6D5AE6","#3B6FD4","#2E8B6A","#B07A1A","#8B1A2E","#5A3472","#9E2235"]
const lvlClass = { em:"lvl-em", dev:"lvl-dev", pro:"lvl-pro" }
const lvlText  = { em:"Emerging", dev:"Developing", pro:"Proficient" }
const stClass  = { complete:"st-complete", progress:"st-submitted", notstarted:"st-notstarted" }
const stText   = { complete:"Completed", progress:"In Progress", notstarted:"Not Started" }

export default function HigherEd(){
  const [active,setActive] = useState(null)     // candidate id for full report
  const [filter,setFilter] = useState(null)     // {type:'level'|'status', value}

  const activeCand = HE.candidates.find(c=>c.id===active)
  if (activeCand) return <CandidateReport c={activeCand} onBack={()=>setActive(null)} />

  let roster = HE.candidates
  if (filter?.type==="level") roster = roster.filter(c=>c.level===filter.value)
  if (filter?.type==="status") roster = roster.filter(c=>c.status===filter.value)

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:2}}>
        <h1 className="pg" style={{marginBottom:0}}>Cohort Dashboard — {HE.heProgram.institution}, {HE.heProgram.program} ({HE.heProgram.term})</h1>
        <span className="pill pill-navy">Self-Building · Test Data</span>
      </div>
      <p className="pg-sub">This dashboard builds itself from participant simulation usage and AI analysis of saved feedback reports. All data shown is fictional test data. Click a candidate to open their full report.</p>

      {/* clickable stat tiles */}
      <div className="tiles">
        <HeTile v={HE.heStats.candidates} l="Candidates Enrolled" c="var(--navy)" onClick={()=>setFilter(null)} active={!filter}/>
        <HeTile v={HE.heStats.simsPlayed} l="Simulations Played" c="var(--purple)"/>
        <HeTile v={HE.heStats.reportsSaved} l="Feedback Reports Saved" c="var(--green)"
          onClick={()=>setFilter({type:"status",value:"complete"})} active={filter?.type==="status"&&filter.value==="complete"}/>
        <HeTile v={HE.heStats.frameworks} l="Standards Frameworks" c="var(--blue)"/>
        <HeTile v={HE.heStats.engagement+"%"} l="Cohort Engagement" c="var(--gold)"/>
      </div>

      {filter && (
        <div className="note" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>Filtered: {filter.type==="level"?lvlText[filter.value]:stText[filter.value]} · {roster.length} candidate{roster.length!==1?"s":""}</span>
          <button className="btn btn-ghost btn-sm" onClick={()=>setFilter(null)}>Clear filter</button>
        </div>
      )}

      <div className="two">
        <div className="card">
          <h3>Standards Alignment — Cohort Average</h3>
          <div className="src" style={{marginBottom:12}}>Auto-scored from AI analysis of feedback reports, by framework</div>
          <div style={{position:"relative",height:250}}><RadarChart/></div>
        </div>
        <div className="card">
          <h3>Proficiency Distribution</h3>
          <div className="src" style={{marginBottom:12}}>Click a bar to filter the roster</div>
          <div style={{position:"relative",height:250}}><BarChart onPick={(lvl)=>setFilter({type:"level",value:lvl})}/></div>
        </div>
      </div>

      <div className="card">
        <h3>Simulation Engagement Over Time</h3>
        <div className="src" style={{marginBottom:12}}>Simulations played per week — updates as candidates engage</div>
        <div style={{position:"relative",height:200}}><LineChart/></div>
      </div>

      <div className="card">
        <h3>Candidate Standards Snapshots</h3>
        <div className="src" style={{marginBottom:12}}>Each snapshot auto-generates from saved feedback reports. Click a candidate's name to open their full report. <i>All names &amp; emails are fictional.</i></div>
        <table className="grid">
          <thead><tr><th>Candidate</th><th>Program</th><th>Sims</th><th>Status</th><th>Alignment Snapshot</th></tr></thead>
          <tbody>
            {roster.map(c=>(
              <tr key={c.id}>
                <td>
                  <button className="lnk" style={{fontWeight:700}} onClick={()=>setActive(c.id)}>{c.name}</button>
                  <div className="src">{c.email}</div>
                </td>
                <td>{c.prog.replace(" Candidate","")}</td>
                <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{c.sims.length}</td>
                <td><span className={"st "+stClass[c.status]}>{stText[c.status]}</span></td>
                <td>
                  {c.level && <span className={"lvl "+lvlClass[c.level]} style={{marginRight:6}}>{lvlText[c.level]}</span>}
                  <span style={c.level?undefined:{color:"var(--muted)",fontStyle:"italic"}}>{c.snap}</span>
                  {c.detail && <div style={{marginTop:6}}><button className="btn btn-ghost btn-sm" onClick={()=>setActive(c.id)}>Open full report →</button></div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>🤖 AI Cohort Narrative</h3>
        <div className="src" style={{marginBottom:12}}>Plain-English synthesis grounded in saved feedback reports only</div>
        <div style={{background:"var(--bg)",borderLeft:"4px solid var(--purple)",borderRadius:9,padding:"16px 18px",fontSize:14,lineHeight:1.8}}>
          {HE.cohortNarrative} <span className="src">(Illustrative — generated from fictional test data.)</span>
        </div>
      </div>
    </div>
  )
}

function HeTile({v,l,c,onClick,active}){
  return (
    <div className="tile" onClick={onClick}
      style={{borderLeftColor:c, cursor:onClick?"pointer":"default", outline:active?`2px solid ${c}`:"none"}}>
      <div className="v" style={{color:c}}>{v}</div>
      <div className="l">{l}{onClick && <span style={{color:c,marginLeft:4}}>›</span>}</div>
    </div>
  )
}

/* ---------- Full candidate report (click-through) ---------- */
function CandidateReport({c,onBack}){
  return (
    <div className="fade">
      <div className="crumb"><button className="lnk" onClick={onBack}>Cohort Dashboard</button> › Full Report</div>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <h1 className="pg" style={{marginBottom:0}}>{c.name}</h1>
        {c.level && <span className={"lvl "+lvlClass[c.level]}>{lvlText[c.level]}</span>}
        <span className={"st "+stClass[c.status]}>{stText[c.status]}</span>
      </div>
      <p className="pg-sub" style={{marginTop:6}}>{c.prog} · {c.email} · {HE.heProgram.institution} {HE.heProgram.program}</p>

      <div className="tiles">
        <div className="tile"><div className="v" style={{color:"var(--navy)"}}>{c.sims.length}</div><div className="l">Simulations Played</div></div>
        <div className="tile" style={{borderLeftColor:"var(--purple)"}}><div className="v" style={{color:"var(--purple)"}}>{c.detail?HE.FRAMEWORKS.length:0}</div><div className="l">Frameworks Assessed</div></div>
        <div className="tile" style={{borderLeftColor:"var(--green)"}}><div className="v" style={{color:"var(--green)"}}>{c.status==="complete"?"Yes":c.status==="progress"?"Partial":"No"}</div><div className="l">Feedback Report Saved</div></div>
      </div>

      <div className="card">
        <h3>Simulations Played</h3>
        {c.sims.length===0
          ? <div className="src">No simulations played yet. The report generates once the candidate plays a simulation and a feedback report is saved.</div>
          : <ul style={{margin:0,paddingLeft:18,fontSize:14,lineHeight:1.9}}>{c.sims.map((s,i)=><li key={i}>{s}</li>)}</ul>}
      </div>

      <div className="card">
        <h3>Professional Standards — Full AI Alignment Analysis</h3>
        <div className="src" style={{marginBottom:12}}>Narrative evidence per framework, auto-generated from the candidate's saved feedback reports</div>
        {c.detail
          ? HE.FRAMEWORKS.map(f=>(
              <div key={f} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{minWidth:80,flexShrink:0}}><span className="tag" style={{background:"var(--blue-l)",color:"var(--blue)",border:"1px solid #B9D2EE"}}>{f}</span></div>
                <div style={{fontSize:13.5,lineHeight:1.65}}>{c.detail[f]||"—"}</div>
              </div>
            ))
          : <div className="src">No analysis yet — a standards snapshot generates once a feedback report is saved.</div>}
      </div>
    </div>
  )
}

/* ---------- Charts (Chart.js from CDN on window.Chart) ---------- */
function useChart(makeConfig, deps=[]){
  const ref = useRef(null)
  useEffect(()=>{
    if (!window.Chart || !ref.current) return
    const ch = new window.Chart(ref.current, makeConfig())
    return ()=>ch.destroy()
  }, deps) // eslint-disable-line
  return ref
}

function RadarChart(){
  const ref = useChart(()=>({
    type:"radar",
    data:{ labels:HE.FRAMEWORKS, datasets:[{ label:"Cohort Avg",
      data:HE.FRAMEWORKS.map(f=>HE.cohortAlignment[f]),
      backgroundColor:"rgba(109,90,230,.18)", borderColor:"#6D5AE6", borderWidth:2, pointBackgroundColor:"#6D5AE6" }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      scales:{ r:{ suggestedMin:0, suggestedMax:100, ticks:{stepSize:25,font:{size:9}}, pointLabels:{font:{size:11}} } } }
  }))
  return <canvas ref={ref}/>
}

function BarChart({onPick}){
  const levels = ["Emerging","Developing","Proficient"]
  const keys = ["em","dev","pro"]
  const ref = useChart(()=>({
    type:"bar",
    data:{ labels:levels, datasets:[{ data:[HE.proficiency.Emerging,HE.proficiency.Developing,HE.proficiency.Proficient],
      backgroundColor:["#A0620A","#2E6DB4","#2E6B50"] }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      onClick:(e,els)=>{ if(els.length&&onPick) onPick(keys[els[0].index]) },
      scales:{ y:{ beginAtZero:true, ticks:{stepSize:4,font:{size:10}} }, x:{ ticks:{font:{size:11}} } } }
  }))
  return <canvas ref={ref} style={{cursor:"pointer"}}/>
}

function LineChart(){
  const ref = useChart(()=>({
    type:"line",
    data:{ labels:HE.engagementSeries.map(x=>x[0]), datasets:[{ label:"Sims",
      data:HE.engagementSeries.map(x=>x[1]), borderColor:"#1E2D6B",
      backgroundColor:"rgba(30,45,107,.12)", fill:true, tension:.35, pointBackgroundColor:"#1E2D6B" }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      scales:{ y:{beginAtZero:true,ticks:{font:{size:10}}}, x:{ticks:{font:{size:10}}} } }
  }))
  return <canvas ref={ref}/>
}
