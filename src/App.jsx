import React, { useState } from 'react'
import * as SAMPLE from './data.js'
import { extractText } from './parse.js'
import { normalize } from './normalize.js'
import HigherEd from './HigherEd.jsx'

const NAV = [
  { grp:"Set Up", items:[["import","📥","Plan Import"],["review","🧠","AI Task Review"]] },
  { grp:"Monitor", items:[["overview","📊","Cohort Overview"],["timeline","📅","Task Timeline"],["competencies","🎯","Competencies"],["heatmap","🔲","Cohort Heat Map"]] },
  { grp:"Drill Down", items:[["participant","👤","Participants"],["narrative","🤖","AI Narrative"]] },
]

let _id = 1
const uid = () => "id" + (_id++)

export default function App(){
  const [mode,setMode] = useState("pd")     // "pd" (PD Guide) | "he" (Higher Ed) — DEMO TOGGLE ONLY
  const [screen,setScreen] = useState("import")
  const [model,setModel] = useState(null)   // normalized extraction result, or null = use sample
  // In-session cohort + participant state (clears on refresh).
  const [cohorts,setCohorts] = useState([])            // [{id,name,term}]
  const [participants,setParticipants] = useState([])  // [{id,cohortId,name,role,school,email}]
  const [selectedCohorts,setSelectedCohorts] = useState([]) // array of cohort ids (multi-select filter)
  const [activeParticipant,setActiveParticipant] = useState(null) // id
  const [showCohortForm,setShowCohortForm] = useState(false)

  const go = (s)=>{ setScreen(s); window.scrollTo({top:0,behavior:"smooth"}) }

  const addCohort = (name,term)=>{
    const c = { id:uid(), name:name.trim(), term:term.trim() }
    setCohorts(prev=>[...prev,c])
    setSelectedCohorts(prev=>[...prev, c.id])
    setShowCohortForm(false)
  }
  const toggleCohort = (id)=> setSelectedCohorts(prev=> prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id])
  const addParticipant = (p)=> setParticipants(prev=>[...prev,{ id:uid(), ...p }])
  const removeParticipant = (id)=> setParticipants(prev=>prev.filter(p=>p.id!==id))

  // participants limited to the selected cohorts (or all if none selected)
  const visibleParticipants = selectedCohorts.length
    ? participants.filter(p=>selectedCohorts.includes(p.cohortId))
    : participants

  return (
    <div>
      <div className="demo-note">⚠ Example toggle below — for demonstration only. The PD Guide / Higher Ed switch will not appear in the final product.</div>
      <div className="nav">
        <div className="nav-left">
          <div className="logo">S</div>
          <span className="nav-title">SchoolSims</span>
          <span className="nav-sub">/ {mode==="he" ? "Cohort Analytics" : "Professional Learning Implementation"}</span>
        </div>
        <div className="toggle-wrap">
          <button className={mode==="pd"?"on":""} onClick={()=>setMode("pd")}>📥 PD Guide</button>
          <button className={mode==="he"?"on":""} onClick={()=>setMode("he")}>🎓 Higher Ed Cohort</button>
        </div>
      </div>

      {mode==="he" ? (
        <div className="shell">
          <main className="main" style={{maxWidth:1200}}><HigherEd/></main>
        </div>
      ) : (
      <div className="shell">
        <nav className="side">
          {NAV.map(g=>(
            <div key={g.grp}>
              <div className="grp">{g.grp}</div>
              {g.items.map(([id,ic,label])=>(
                <button key={id} className={"link"+(screen===id?" active":"")} onClick={()=>go(id)}>
                  <span className="ic">{ic}</span> {label}
                </button>
              ))}
            </div>
          ))}

          {/* Cohorts group */}
          <div className="grp" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingRight:16}}>
            <span>Cohorts</span>
            <button onClick={()=>{setShowCohortForm(v=>!v)}} title="Create cohort"
              style={{background:"var(--purple)",color:"#fff",border:"none",borderRadius:6,width:20,height:20,cursor:"pointer",fontSize:14,lineHeight:1,fontWeight:700}}>+</button>
          </div>
          {showCohortForm && <CohortForm onAdd={addCohort} onCancel={()=>setShowCohortForm(false)} />}
          {cohorts.length===0 && !showCohortForm && (
            <div style={{padding:"4px 22px 8px",color:"#6B7FB0",fontSize:11.5,lineHeight:1.5}}>No cohorts yet. Click + to create one.</div>
          )}
          {cohorts.map(c=>(
            <button key={c.id} onClick={()=>toggleCohort(c.id)}
              className="link" style={{paddingLeft:22,opacity:selectedCohorts.includes(c.id)?1:0.6}}>
              <span style={{width:15,height:15,borderRadius:4,border:"1.5px solid #6B7FB0",flexShrink:0,display:"inline-flex",alignItems:"center",justifyContent:"center",background:selectedCohorts.includes(c.id)?"var(--purple)":"transparent",borderColor:selectedCohorts.includes(c.id)?"var(--purple)":"#6B7FB0"}}>
                {selectedCohorts.includes(c.id) && <span style={{color:"#fff",fontSize:10,lineHeight:1}}>✓</span>}
              </span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
            </button>
          ))}
          {cohorts.length>0 && (
            <div style={{padding:"6px 22px 4px",color:"#6B7FB0",fontSize:11}}>
              {selectedCohorts.length} of {cohorts.length} selected · click to toggle
            </div>
          )}
        </nav>
        <main className="main">
          {screen==="import" && <Import go={go} setModel={setModel}/>}
          {screen==="review" && <Review go={go} model={model}/>}
          {screen==="overview" && <Overview go={go} model={model}/>}
          {screen==="timeline" && <Timeline model={model}/>}
          {screen==="competencies" && <Competencies model={model}/>}
          {screen==="heatmap" && <HeatMap participants={visibleParticipants} cohorts={cohorts} model={model}/>}
          {screen==="participant" && <Participant
              cohorts={cohorts} participants={visibleParticipants} allParticipants={participants}
              selectedCohorts={selectedCohorts} activeParticipant={activeParticipant}
              setActiveParticipant={setActiveParticipant} addParticipant={addParticipant}
              removeParticipant={removeParticipant} go={go} model={model} />}
          {screen==="narrative" && <Narrative model={model}/>}
        </main>
      </div>
      )}
    </div>
  )
}

/* ---------- PLAN IMPORT (live upload + extraction) ---------- */
function Import({go,setModel}){
  const [files,setFiles] = useState([])
  const [status,setStatus] = useState("idle") // idle|parsing|extracting|done|error
  const [error,setError] = useState("")
  const [pasteOpen,setPasteOpen] = useState(false)
  const [pasteText,setPasteText] = useState("")
  const [resultCount,setResultCount] = useState(0)
  const inputRef = React.useRef()

  async function runExtraction(text, fileLabel){
    setStatus("extracting"); setError("")
    try{
      const res = await fetch("/api/extract",{
        method:"POST", headers:{"content-type":"application/json"},
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      if(!res.ok || !data.ok){
        throw new Error(data.error ? `${data.error}${data.detail?` — ${data.detail}`:""}` : "Extraction failed.")
      }
      const norm = normalize(data.result)
      setModel(norm)
      setResultCount(norm.program.activities)
      setStatus("done")
    }catch(e){
      setStatus("error"); setError(String(e.message||e))
    }
  }

  async function handleFiles(fileList){
    const arr = Array.from(fileList)
    if(!arr.length) return
    setFiles(arr.map(f=>({name:f.name, size:f.size, status:"Parsing"})))
    setStatus("parsing"); setError("")
    try{
      let combined = ""
      for(const f of arr){
        const t = await extractText(f)
        combined += `\n\n===== ${f.name} =====\n${t}`
      }
      setFiles(arr.map(f=>({name:f.name, size:f.size, status:"Ingested"})))
      await runExtraction(combined, arr.map(a=>a.name).join(", "))
    }catch(e){
      setStatus("error"); setError(String(e.message||e))
      setFiles(arr.map(f=>({name:f.name, size:f.size, status:"Error"})))
    }
  }

  return (
    <div className="fade">
      <div className="crumb">Set Up › Plan Import</div>
      <h1 className="pg">Create Implementation Program</h1>
      <p className="pg-sub">Upload one or more planning artifacts. The AI drafts a structured plan you review before anything reaches participants.</p>

      <div className="card">
        <h3>Source Documents <span className="sub">PDF or DOCX — leadership handbooks, PD plans, accreditation plans, principal pipeline docs</span></h3>
        <div className="uz" onClick={()=>inputRef.current?.click()}
             onDragOver={e=>e.preventDefault()}
             onDrop={e=>{e.preventDefault(); handleFiles(e.dataTransfer.files)}}>
          <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.md" multiple style={{display:"none"}}
                 onChange={e=>handleFiles(e.target.files)}/>
          <div style={{fontSize:34,marginBottom:8}}>📄</div>
          <div style={{fontWeight:700,color:"var(--navy)",fontSize:15}}>Drop PDF or DOCX files here, or click to browse</div>
          <div style={{color:"var(--muted)",fontSize:12.5,marginTop:5}}>Multiple files supported · parsed in your browser, text sent securely for extraction</div>
        </div>

        {files.map((d,i)=>(
          <div className="doc-item" key={i}>
            <div className="doc-ic">{d.name.toLowerCase().endsWith(".pdf")?"📕":d.name.toLowerCase().endsWith(".docx")?"📘":"📄"}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13.5}}>{d.name}</div><div className="src">{(d.size/1024).toFixed(0)} KB</div></div>
            <span className={"st "+(d.status==="Ingested"?"st-complete":d.status==="Error"?"st-overdue":"st-progress")}>{d.status}</span>
          </div>
        ))}

        <div style={{marginTop:14}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setPasteOpen(v=>!v)}>
            {pasteOpen?"Hide":"Or paste document text instead"}
          </button>
          {pasteOpen && (
            <div style={{marginTop:10}}>
              <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)}
                placeholder="Paste the guidebook / PD plan text here…"
                style={{width:"100%",height:150,border:"1px solid var(--border)",borderRadius:8,padding:12,fontFamily:"inherit",fontSize:13,resize:"vertical"}}/>
              <button className="btn btn-primary btn-sm" style={{marginTop:8}}
                disabled={pasteText.trim().length<40}
                onClick={()=>runExtraction(pasteText,"Pasted text")}>Generate from Pasted Text</button>
            </div>
          )}
        </div>
      </div>

      {/* status panel */}
      {status==="parsing" && <StatusCard color="var(--blue)" title="Reading your document…" sub="Extracting text in your browser."/>}
      {status==="extracting" && <StatusCard color="var(--gold)" title="AI is drafting the implementation plan…" sub="Extracting goals, activities, dates, evidence, and competencies."/>}
      {status==="error" && (
        <div className="card" style={{background:"var(--maroon-l)",border:"1px solid #E0B9C2"}}>
          <h3 style={{color:"var(--maroon)"}}>Extraction could not complete</h3>
          <div style={{fontSize:13,lineHeight:1.6}}>{error}</div>
          <div className="src" style={{marginTop:8}}>If this mentions a missing API key, add <b>ANTHROPIC_API_KEY</b> in Vercel → Settings → Environment Variables, then redeploy. You can still explore the dashboard with sample data.</div>
          <button className="btn btn-outline btn-sm" style={{marginTop:10}} onClick={()=>go("overview")}>Explore with sample data →</button>
        </div>
      )}
      {status==="done" && (
        <div className="card" style={{background:"var(--navy)",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:16}}>Extraction complete — {resultCount} proposed items + best-practice suggestions</div>
            <div style={{color:"#A0B4CC",fontSize:12.5,marginTop:3}}>Review the extracted plan and the anonymized suggestions. Nothing is assigned until you publish.</div>
          </div>
          <button className="btn btn-primary" onClick={()=>go("review")}>Review Proposed Plan →</button>
        </div>
      )}
      {status==="idle" && (
        <div className="note">No document yet? You can <button className="crumb" style={{color:"var(--blue)",background:"none",border:"none",cursor:"pointer",fontSize:12.5,padding:0}} onClick={()=>go("overview")}>explore the dashboard with sample data</button> to see what a generated plan looks like.</div>
      )}
    </div>
  )
}

function StatusCard({color,title,sub}){
  return (
    <div className="card" style={{borderLeft:`5px solid ${color}`}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div className="spinner" style={{width:22,height:22,border:`3px solid ${color}33`,borderTopColor:color,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        <div><div style={{fontWeight:800,color:"var(--navy)"}}>{title}</div><div className="src">{sub}</div></div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ---------- helpers to pick live-or-sample ---------- */
const pickBAR = SAMPLE.BAR
const pickMONTHC = SAMPLE.MONTH_COLORS

/* ---------- AI TASK REVIEW ---------- */
function Review({go,model}){
  const districtItems = model ? model.districtItems : SAMPLE.districtItems
  const aiItems = model ? model.aiItems : SAMPLE.aiItems
  const suggestions = model ? model.suggestions : SAMPLE.sampleSuggestions
  const gaps = model ? model.gaps : []
  const counts = model ? model.counts : {district:23,ai:4,flagged:3,published:0,suggestions:(SAMPLE.sampleSuggestions||[]).length}
  const partCount = model ? model.program.participants : 42
  return (
    <div className="fade">
      <div className="crumb">Set Up › AI Task Review</div>
      <h1 className="pg">Review &amp; Publish Proposed Plan</h1>
      <p className="pg-sub">AI drafted these from your documents. Accept, edit, merge, or reject each. District-sourced content, best-practice suggestions, and SchoolSims recommendations stay clearly separated.</p>
      <div className="note">⚠ <b>Nothing here is live.</b> Items publish to participants only after you confirm. Low-confidence extractions are flagged for your attention.</div>
      <div className="tiles">
        <RTile v={counts.district} l="From District Plan" c="var(--district)"/>
        <RTile v={counts.suggestions||0} l="Best-Practice Suggestions" c="var(--green)"/>
        <RTile v={counts.ai} l="SchoolSims AI Recommended" c="var(--ai)"/>
        <RTile v={counts.flagged} l="Flagged — Needs Review" c="var(--gold)"/>
      </div>
      <div className="card">
        <h3>Extracted District Requirements <span className="sub">traceable to source document &amp; page</span></h3>
        {districtItems.length===0 && <div className="src">No activities were extracted from this document.</div>}
        {districtItems.map((it,i)=>(
          <div className="trow district" key={i}>
            <div className="meta">
              <div className="tt">{it.title}{it.flag && <span className="flagwarn">{it.flag}</span>}</div>
              <div className="deets">{it.deets}</div>
              <span className="tag tag-district">From District Plan</span> <span className="src">· {it.src}</span>
            </div>
            <div className="acts">
              <button className="btn btn-ghost btn-sm">Edit</button>
              <button className="btn btn-ghost btn-sm">Reject</button>
              <button className="btn btn-primary btn-sm">Accept</button>
            </div>
          </div>
        ))}
      </div>
      {suggestions.length>0 && (
        <div className="card" style={{background:"var(--green-l)",borderColor:"#B6D8C6"}}>
          <h3 style={{color:"var(--green)"}}>Suggested Additions <span className="sub">anonymized best practices from the strongest district programs — optional, for your review</span></h3>
          {gaps.length>0 && (
            <div style={{fontSize:12.5,color:"#2E6B50",marginBottom:12,lineHeight:1.6}}>
              <b>Gaps detected vs. best-practice programs:</b> {gaps.join(" · ")}
            </div>
          )}
          {suggestions.map((it,i)=>(
            <div className="trow" key={i} style={{borderLeft:"4px solid var(--green)"}}>
              <div className="meta">
                <div className="tt">{it.title}</div>
                <div className="deets">{it.deets}</div>
                {it.rationale && <div style={{fontSize:12,color:"#2E6B50",marginTop:2,marginBottom:6,fontStyle:"italic"}}>Why: {it.rationale}</div>}
                <span className="tag" style={{background:"var(--green-l)",color:"var(--green)",border:"1px solid #B6D8C6"}}>Best-Practice Suggestion</span>
              </div>
              <div className="acts">
                <button className="btn btn-ghost btn-sm">Dismiss</button>
                <button className="btn btn-ghost btn-sm">Edit</button>
                <button className="btn btn-primary btn-sm">Add to Plan</button>
              </div>
            </div>
          ))}
          <div className="src" style={{marginTop:6}}>These are examples drawn from high-performing programs, fully anonymized. Add the ones that fit; build the rest manually.</div>
        </div>
      )}

      {aiItems.length>0 && (
        <div className="card">
          <h3 style={{color:"var(--ai)"}}>SchoolSims AI Recommendations <span className="sub">optional additions — not from the district plan</span></h3>
          {aiItems.map((it,i)=>(
            <div className="trow ai" key={i}>
              <div className="meta">
                <div className="tt">{it.title}</div>
                <div className="deets">{it.deets}</div>
                <span className="tag tag-ai">SchoolSims AI Recommended</span> <span className="src">· {it.src}</span>
              </div>
              <div className="acts">
                <button className="btn btn-ghost btn-sm">Dismiss</button>
                <button className="btn btn-primary btn-sm">Add to Plan</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="card" style={{background:"var(--navy)",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
        <div>
          <div style={{color:"#fff",fontWeight:800,fontSize:16}}>Ready to publish {counts.district} items{partCount!=="—"?` to ${partCount} participants`:""}</div>
          <div style={{color:"#A0B4CC",fontSize:12.5,marginTop:3}}>Preview assignment counts, then confirm. This is the only step that makes items live.</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-outline" style={{borderColor:"#fff",color:"#fff",background:"transparent"}}>Preview Assignment</button>
          <button className="btn btn-primary" onClick={()=>go("overview")}>Publish Plan →</button>
        </div>
      </div>
    </div>
  )
}
function RTile({v,l,c}){ return <div className="tile" style={{borderLeftColor:c}}><div className="v" style={{color:c}}>{v}</div><div className="l">{l}</div></div> }

/* ---------- OVERVIEW ---------- */
function Overview({go,model}){
  const prog = model ? model.program : SAMPLE.program
  const pillars = model ? model.pillars : SAMPLE.pillars
  const alerts = SAMPLE.alerts
  const rollup = SAMPLE.rollup
  return (
    <div className="fade">
      <div className="crumb">Monitor › Cohort Overview</div>
      <h1 className="pg">{prog.name}</h1>
      <p className="pg-sub">{prog.account} · {prog.term} · <span className="st st-progress">{prog.status}</span></p>
      <div className="tiles">
        <div className="tile"><div className="v" style={{color:"var(--navy)"}}>{prog.participants}</div><div className="l">Participants</div></div>
        <div className="tile" style={{borderLeftColor:"var(--purple)"}}><div className="v" style={{color:"var(--purple)"}}>{prog.activities}</div><div className="l">{model?"Proposed":"Published"} Activities</div></div>
        <div className="tile" style={{borderLeftColor:"var(--blue)"}}><div className="v" style={{color:"var(--blue)"}}>{prog.competenciesCount}</div><div className="l">Competencies</div></div>
        <div className="tile" style={{borderLeftColor:"var(--green)"}}><div className="v" style={{color:"var(--green)"}}>{prog.overallCompletion}%</div><div className="l">Overall Completion</div></div>
      </div>
      {model && <div className="note">Showing the plan extracted from your document. Completion and status roll-ups populate once the plan is published and participants begin submitting evidence.</div>}
      {!model && (
        <div className="card">
          <h3>Implementation Status Roll-Up <span className="sub">assignment-level, across all participants × activities</span></h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
            {rollup.map(([l,n,c])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:c}}>{n}</div><div style={{fontSize:11,color:"var(--muted)"}}>{l}</div></div>
            ))}
          </div>
          <div className="src" style={{marginTop:12}}>Click any status to expose the underlying participant/activity records (drill-down).</div>
        </div>
      )}
      <div className="two">
        <div className="card">
          <h3>{model?"Category Coverage":"Pillar / Category Progress"} <span className="sub">{model?"activities per pillar/category":""}</span></h3>
          {model
            ? Object.entries(model.typeCounts).map(([cat,n],i)=>{
                const max = Math.max(...Object.values(model.typeCounts),1)
                return (
                  <div className="prow2" key={cat}>
                    <div className="top"><span>{cat}</span><span className="pct">{n}</span></div>
                    <div className="bar"><div style={{width:(n/max*100)+"%",background:pickBAR[i%6]}}/></div>
                  </div>
                )
              })
            : pillars.map(([p,pct],i)=>(
                <div className="prow2" key={p}>
                  <div className="top"><span>{p}</span><span className="pct">{pct}%</span></div>
                  <div className="bar"><div style={{width:pct+"%",background:pickBAR[i%6]}}/></div>
                </div>
              ))}
        </div>
        <div className="card">
          <h3>AI Action Center <span className="sub">rules-based — every alert shows its trigger</span></h3>
          {model
            ? (model.risks.length
                ? model.risks.map((r,i)=><div className="alert" key={i}><div className="ad"><div className="at">{r}</div><span className="rule">extracted risk</span></div></div>)
                : <div className="src">No risks were flagged in the source document. Live alerts appear once the plan is published and evidence is tracked.</div>)
            : alerts.map((a,i)=>(
                <div className={"alert "+a[0]} key={i}><div className="ad"><div className="at">{a[1]}</div><div className="ax">{a[2]}</div><span className="rule">{a[3]}</span></div></div>
              ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- TIMELINE ---------- */
function Timeline({model}){
  const months = model ? model.months : SAMPLE.months
  return (
    <div className="fade">
      <div className="crumb">Monitor › Task Timeline</div>
      <h1 className="pg">Task Timeline</h1>
      <p className="pg-sub">Chronological view of {model?"extracted":"published"} activities. Recurring activities shown consistently.</p>
      <div className="card">
        {months.length===0 && <div className="src">No scheduled activities were extracted.</div>}
        {months.map(([m,tasks],i)=>{
          const mc = pickMONTHC[i%pickMONTHC.length]
          return (
            <div key={m} style={{display:"flex",gap:16,marginBottom:14}}>
              <div style={{width:92,flexShrink:0,textAlign:"right",paddingTop:4}}>
                <div style={{fontWeight:800,color:mc,fontSize:14}}>{m}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{tasks.length} tasks</div>
              </div>
              <div style={{width:2,background:mc+"33",position:"relative",flexShrink:0}}>
                <div style={{position:"absolute",top:6,left:-4,width:10,height:10,borderRadius:99,background:mc}}/>
              </div>
              <div style={{flex:1,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:8}}>
                {tasks.map((t,ti)=>{
                  const idx=t.lastIndexOf("·"); const n=idx>=0?t.slice(0,idx):t; const c=idx>=0?t.slice(idx+1):"Activity"
                  return (
                    <div key={ti} style={{background:"#fff",border:"1px solid var(--border)",borderLeft:`3px solid ${mc}`,borderRadius:8,padding:"9px 11px"}}>
                      <div style={{fontWeight:700,fontSize:12.5,color:"var(--navy)"}}>{n}</div>
                      <span className="tag" style={{background:mc+"18",color:mc,marginTop:4}}>{c}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- COMPETENCIES ---------- */
function Competencies({model}){
  const cards = model ? model.compCards : SAMPLE.competencies
  return (
    <div className="fade">
      <div className="crumb">Monitor › Competencies</div>
      <h1 className="pg">Competency Progress &amp; Evidence</h1>
      <p className="pg-sub">District-defined competencies mapped to activities. Shown as <b>progress &amp; evidence</b>, not a growth claim, until a defensible growth methodology exists.</p>
      {cards.length===0 && <div className="note">No competencies were found in the source document. You can map competencies to activities during review.</div>}
      <div className="three">
        {cards.map(([name,pct,n],i)=>(
          <div className="card" key={name} style={{marginBottom:0,borderTop:`5px solid ${pickBAR[i%6]}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontWeight:800,color:"var(--navy)",fontSize:15}}>{name}</div>
              <div style={{fontSize:24,fontWeight:900,color:pickBAR[i%6]}}>{pct}%</div>
            </div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:9}}>{n} activities mapped</div>
            <div className="bar"><div style={{width:pct+"%",background:pickBAR[i%6]}}/></div>
            <div className="src" style={{marginTop:10}}>Progress &amp; evidence · not a growth measure</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- COHORT FORM (sidebar) ---------- */
function CohortForm({onAdd,onCancel}){
  const [name,setName] = useState("")
  const [term,setTerm] = useState("")
  const inp = { width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #3A4A7A",background:"#0E1A2E",color:"#fff",fontSize:12,fontFamily:"inherit",marginBottom:6 }
  return (
    <div style={{padding:"4px 16px 10px"}}>
      <input style={inp} placeholder="Cohort name" value={name} onChange={e=>setName(e.target.value)} autoFocus/>
      <input style={inp} placeholder="Term (e.g. 2026–27)" value={term} onChange={e=>setTerm(e.target.value)}/>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>name.trim()&&onAdd(name,term)} disabled={!name.trim()}
          style={{flex:1,background:"var(--purple)",color:"#fff",border:"none",borderRadius:6,padding:"6px",fontSize:12,fontWeight:700,cursor:name.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>Create</button>
        <button onClick={onCancel} style={{background:"transparent",color:"#8A9CC8",border:"1px solid #3A4A7A",borderRadius:6,padding:"6px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
      </div>
    </div>
  )
}

/* ---------- HEAT MAP (data-driven; empty until participants added) ---------- */
function HeatMap({participants,cohorts,model}){
  const cats = model ? Object.keys(model.typeCounts) : ["Workshop","Coaching","Project","Assessment","Reflection"]
  if (!participants.length) {
    return (
      <div className="fade">
        <div className="crumb">Monitor › Cohort Heat Map</div>
        <h1 className="pg">Cohort Heat Map</h1>
        <p className="pg-sub">Implementation gaps across participants and categories.</p>
        <EmptyState icon="🔲"
          title="No participant data yet"
          body="The heat map fills in once you add participants to a cohort and activities are published. Add participants on the Participant Detail screen, then return here." />
      </div>
    )
  }
  return (
    <div className="fade">
      <div className="crumb">Monitor › Cohort Heat Map</div>
      <h1 className="pg">Cohort Heat Map</h1>
      <p className="pg-sub">Rows are your participants; columns are activity categories. Status fills in as evidence is tracked.</p>
      <div className="card heat">
        <table>
          <thead><tr><th className="rowh">Participant</th>{cats.map(c=><th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {participants.map(p=>(
              <tr key={p.id}>
                <td className="cell-name">{p.name}</td>
                {cats.map(c=><td key={c}><span className="cell" style={{background:"#C3CAD9"}} title={`${c}: Not Started`}>NS</span></td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="legend">
          <span><span className="sw" style={{background:"var(--green)"}}/> Complete</span>
          <span><span className="sw" style={{background:"var(--blue)"}}/> In Progress</span>
          <span><span className="sw" style={{background:"var(--gold)"}}/> Submitted</span>
          <span><span className="sw" style={{background:"var(--maroon)"}}/> Overdue</span>
          <span><span className="sw" style={{background:"#C3CAD9"}}/> Not Started</span>
        </div>
        <div className="src" style={{marginTop:8}}>All participants start at “Not Started.” Status updates as evidence is submitted and approved.</div>
      </div>
    </div>
  )
}

function EmptyState({icon,title,body,children}){
  return (
    <div className="card" style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:40,marginBottom:12}}>{icon}</div>
      <div style={{fontWeight:800,color:"var(--navy)",fontSize:17,marginBottom:8}}>{title}</div>
      <div style={{color:"var(--muted)",fontSize:13.5,lineHeight:1.6,maxWidth:460,margin:"0 auto 16px"}}>{body}</div>
      {children}
    </div>
  )
}

/* ---------- PARTICIPANT DETAIL (manage real participants) ---------- */
function Participant({cohorts,participants,selectedCohorts,activeParticipant,setActiveParticipant,addParticipant,removeParticipant,go,model}){
  const [showForm,setShowForm] = useState(false)
  const active = participants.find(p=>p.id===activeParticipant) || null

  // No cohorts at all
  if (cohorts.length===0) {
    return (
      <div className="fade">
        <div className="crumb">Drill Down › Participant Detail</div>
        <h1 className="pg">Participants</h1>
        <p className="pg-sub">Add participants to a cohort to track their progress.</p>
        <EmptyState icon="👥"
          title="Create a cohort first"
          body="Participants belong to a cohort. Use the “+ ” next to Cohorts in the left sidebar to create one, then come back to add participants." />
      </div>
    )
  }

  // Detail view for one participant
  if (active) {
    const cohort = cohorts.find(c=>c.id===active.cohortId)
    return (
      <div className="fade">
        <div className="crumb"><button className="lnk" onClick={()=>setActiveParticipant(null)}>Participants</button> › {active.name}</div>
        <h1 className="pg">{active.name}</h1>
        <p className="pg-sub">{[active.role,active.school,cohort&&cohort.name].filter(Boolean).join(" · ")} · <span className="st st-notstarted">Not Started</span></p>
        <div className="tiles">
          <div className="tile"><div className="v" style={{color:"var(--navy)"}}>0%</div><div className="l">Overall Completion</div></div>
          <div className="tile" style={{borderLeftColor:"var(--maroon)"}}><div className="v" style={{color:"var(--maroon)"}}>0</div><div className="l">Overdue Items</div></div>
          <div className="tile" style={{borderLeftColor:"var(--gold)"}}><div className="v" style={{color:"var(--gold)"}}>0</div><div className="l">Awaiting Approval</div></div>
          <div className="tile" style={{borderLeftColor:"var(--green)"}}><div className="v" style={{color:"var(--green)"}}>0</div><div className="l">Completed</div></div>
        </div>
        <div className="two">
          <div className="card">
            <h3>Assigned Activities &amp; Evidence Lifecycle</h3>
            {model && model.months.length>0 ? (
              <table className="grid">
                <thead><tr><th>Activity</th><th>Status</th></tr></thead>
                <tbody>
                  {model.months.flatMap(([,tasks])=>tasks).slice(0,12).map((t,i)=>{
                    const idx=t.lastIndexOf("·"); const n=idx>=0?t.slice(0,idx):t
                    return <tr key={i}><td>{n}</td><td><span className="st st-notstarted">Not Started</span></td></tr>
                  })}
                </tbody>
              </table>
            ) : (
              <div className="src">Publish a plan (Plan Import → AI Task Review) to assign activities to this participant.</div>
            )}
            <div className="src" style={{marginTop:10}}>All activities start at “Not Started.” Submission ≠ completion; approval-required items wait in the reviewer queue.</div>
          </div>
          <div>
            <div className="card">
              <h3>Contact</h3>
              <table className="grid"><tbody>
                <tr><td style={{color:"var(--muted)",width:90}}>Role</td><td>{active.role||"—"}</td></tr>
                <tr><td style={{color:"var(--muted)"}}>School</td><td>{active.school||"—"}</td></tr>
                <tr><td style={{color:"var(--muted)"}}>Email</td><td>{active.email||"—"}</td></tr>
                <tr><td style={{color:"var(--muted)"}}>Cohort</td><td>{cohort?cohort.name:"—"}</td></tr>
              </tbody></table>
            </div>
            <div className="card">
              <h3>Competency Progress</h3>
              {(model?model.compCards:SAMPLE.competencies).map(([name],i)=>(
                <div className="prow2" key={name}><div className="top"><span>{name}</span><span className="pct">0%</span></div><div className="bar"><div style={{width:"0%",background:pickBAR[i%6]}}/></div></div>
              ))}
              <div className="src" style={{marginTop:6}}>Fills in as evidence is approved.</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Roster list + add form
  return (
    <div className="fade">
      <div className="crumb">Drill Down › Participant Detail</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <h1 className="pg" style={{marginBottom:0}}>Participants</h1>
        <button className="btn btn-primary" onClick={()=>setShowForm(v=>!v)}>+ Add Participant</button>
      </div>
      <p className="pg-sub" style={{marginTop:6}}>
        {selectedCohorts.length
          ? `Showing participants in ${selectedCohorts.length} selected cohort${selectedCohorts.length>1?"s":""}.`
          : "Showing all participants. Select cohorts in the sidebar to filter."}
      </p>

      {showForm && <AddParticipantForm cohorts={cohorts} onAdd={(p)=>{addParticipant(p); setShowForm(false)}} onCancel={()=>setShowForm(false)} />}

      {participants.length===0 ? (
        <EmptyState icon="👤"
          title="No participants yet"
          body="Click “Add Participant” to build your roster. Each participant is assigned to a cohort and will be tracked against the published plan." />
      ) : (
        <div className="card">
          <table className="grid">
            <thead><tr><th>Name</th><th>Role</th><th>School</th><th>Cohort</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {participants.map(p=>{
                const c = cohorts.find(x=>x.id===p.cohortId)
                return (
                  <tr key={p.id}>
                    <td><button className="lnk" onClick={()=>setActiveParticipant(p.id)}>{p.name}</button></td>
                    <td>{p.role||"—"}</td><td>{p.school||"—"}</td>
                    <td>{c?c.name:"—"}</td><td>{p.email||"—"}</td>
                    <td style={{textAlign:"right"}}><button className="btn btn-ghost btn-sm" onClick={()=>removeParticipant(p.id)}>Remove</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AddParticipantForm({cohorts,onAdd,onCancel}){
  const [name,setName]=useState(""), [role,setRole]=useState(""), [school,setSchool]=useState(""), [email,setEmail]=useState("")
  const [cohortId,setCohortId]=useState(cohorts[0]?cohorts[0].id:"")
  const f = { padding:"9px 11px",borderRadius:8,border:"1px solid var(--border)",fontSize:13.5,fontFamily:"inherit",width:"100%" }
  const can = name.trim() && cohortId
  return (
    <div className="card">
      <h3>Add Participant</h3>
      <div className="row" style={{marginBottom:12}}>
        <div style={{flex:1,minWidth:200}}><label style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>Name *</label><input style={f} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoFocus/></div>
        <div style={{flex:1,minWidth:200}}><label style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>Role / Title</label><input style={f} value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Assistant Principal"/></div>
      </div>
      <div className="row" style={{marginBottom:12}}>
        <div style={{flex:1,minWidth:200}}><label style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>School / Site</label><input style={f} value={school} onChange={e=>setSchool(e.target.value)} placeholder="Building or location"/></div>
        <div style={{flex:1,minWidth:200}}><label style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>Email</label><input style={f} value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@district.org"/></div>
      </div>
      <div className="row" style={{marginBottom:14,alignItems:"flex-end"}}>
        <div style={{flex:1,minWidth:200}}>
          <label style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>Cohort *</label>
          <select style={f} value={cohortId} onChange={e=>setCohortId(e.target.value)}>
            {cohorts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-primary" disabled={!can} onClick={()=>can&&onAdd({name:name.trim(),role:role.trim(),school:school.trim(),email:email.trim(),cohortId})}>Add Participant</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

/* ---------- NARRATIVE ---------- */
function Narrative({model}){
  const narrative = model ? model.narrative : SAMPLE.narrative
  const risks = model ? model.risks.map((r,i)=>[`Risk ${i+1}`,r,"extracted from source"]) : SAMPLE.risks
  const recs = model ? (model.aiItems.map(a=>a.title)) : SAMPLE.recs
  const simRecs = SAMPLE.simRecs
  return (
    <div className="fade">
      <div className="crumb">Drill Down › AI Narrative</div>
      <h1 className="pg">Implementation Narrative</h1>
      <p className="pg-sub">Plain-English summary {model?"generated from your uploaded document":"grounded in current dashboard data"}. Distinguishes completion/progress from demonstrated growth.</p>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:40,height:40,background:"var(--navy)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800}}>AI</div>
          <div><div style={{fontWeight:800,color:"var(--navy)"}}>AI Executive Narrative</div><div className="src">{model?"Generated from uploaded document":"Data as of reporting date"} · grounded in available information only</div></div>
        </div>
        <div style={{background:"var(--bg)",borderLeft:"4px solid var(--purple)",borderRadius:9,padding:20,lineHeight:1.85,fontSize:14.5}}>{narrative}</div>
      </div>
      <div className="two">
        <div className="card" style={{background:"var(--maroon-l)",borderColor:"#E0B9C2"}}>
          <h3 style={{color:"var(--maroon)"}}>Risk Areas <span className="sub">{model?"from source":"rule-based, from current data"}</span></h3>
          {risks.length===0 && <div className="src">No risks flagged.</div>}
          {risks.map((r,i)=>(<div key={i} style={{fontSize:13,lineHeight:1.6,marginBottom:10}}><b>{r[0]}:</b> {r[1]} <span className="rule">{model?r[2]:`rule: ${r[2]}`}</span></div>))}
        </div>
        <div className="card" style={{background:"var(--green-l)",borderColor:"#B6D8C6"}}>
          <h3 style={{color:"var(--green)"}}>{model?"AI Recommendations":"Recommendations"}</h3>
          {recs.length===0 && <div className="src">No recommendations generated.</div>}
          {recs.map((r,i)=>(<div key={i} style={{fontSize:13,lineHeight:1.6,marginBottom:10}}><b>#{i+1}</b> {r}</div>))}
        </div>
      </div>
      <div className="card" style={{background:"var(--ai-l)",borderColor:"#D9C19A"}}>
        <h3 style={{color:"var(--ai)"}}>SchoolSims Activity Recommendations <span className="sub">optional · separated from district requirements · admin approves before assignment</span></h3>
        <div className="three">
          {simRecs.map(([n,list])=>(<div key={n}><b style={{color:"var(--navy)"}}>{n}</b><div className="src">{list}</div></div>))}
        </div>
      </div>
    </div>
  )
}
