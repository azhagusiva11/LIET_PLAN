import React, { useState, useEffect, useRef } from "react";
import {
  Search, Plus, Mic, Square, Printer, FileText, Clock, ChevronLeft,
  Activity, Heart, Wind, Thermometer, Droplet, Weight, User, Phone,
  Calendar, Lock, Unlock, FlaskConical, CheckCircle2, Circle, AlertTriangle,
  Stethoscope, ClipboardList, Send, Pencil, ChevronRight, Users, Building2,
  Hospital, ArrowRight, Pause, Save, ShieldCheck, History, Layers, Hash,
} from "lucide-react";

/* ============ DESIGN TOKENS ============ */
const C = {
  bg: "#070b0c", surface: "#10171a", surfaceHi: "#18242a", surfaceTop: "#1e2d34",
  border: "#1d2b30", borderHi: "#274049",
  teal: "#15b7a6", tealDim: "#0c7a6e", tealText: "#46d6c5",
  glow: "rgba(21,183,166,0.16)",
  text: "#e9eff1", dim: "#8ba0a7", faint: "#5b6e76",
  amber: "#f5a524", red: "#f0524d", redBg: "rgba(240,82,77,0.12)",
  blue: "#46a0ff", green: "#2dd06e", violet: "#a78bfa",
};
const FONT = "'Inter', -apple-system, system-ui, sans-serif";

/* ============ MOCK DATA ============ */
const VITALS_BLANK = { bp: "", hr: "", spo2: "", temp: "", rr: "", wt: "" };
const QUEUE_SEED = [
  { id: "u1", name: "Lakshmi Narayan", uhid: "APL-26-04821", age: 54, sex: "F", phone: "98450 11234", token: "A-12", arrivedMin: 22, dept: "General Medicine", reason: "DM follow-up", vitals: { bp: "148/92", hr: "84", spo2: "97", temp: "98.4", rr: "16", wt: "71" } },
  { id: "u2", name: "Rahul Mehta", uhid: "APL-26-04822", age: 38, sex: "M", phone: "99860 55421", token: "A-13", arrivedMin: 14, dept: "General Medicine", reason: "Fever 3 days", vitals: { bp: "126/80", hr: "98", spo2: "98", temp: "101.2", rr: "18", wt: "78" } },
  { id: "u3", name: "Fatima Bi", uhid: "APL-26-04823", age: 61, sex: "F", phone: "97400 99001", token: "A-14", arrivedMin: 6, dept: "General Medicine", reason: "BP review", vitals: { bp: "138/86", hr: "76", spo2: "99", temp: "98.1", rr: "15", wt: "64" } },
];
const TIMELINE = [
  { date: "24 Jun 2026", dept: "General Medicine", doc: "Dr. K Karthik", dx: "T2DM — uncontrolled", locked: false, you: true },
  { date: "02 Jun 2026", dept: "Cardiology", doc: "Dr. S Iyer", dx: "HTN, LVH on ECHO", locked: false },
  { date: "18 May 2026", dept: "Psychiatry", doc: "Dr. A Rao", dx: "— restricted —", locked: true },
  { date: "30 Apr 2026", dept: "Nephrology", doc: "Dr. M Banerjee", dx: "CKD stage 2", locked: false },
];
const LABS = [
  { test: "HbA1c", val: "8.9", unit: "%", flag: "H", ref: "<5.7" },
  { test: "Fasting glucose", val: "168", unit: "mg/dL", flag: "H", ref: "70–100" },
  { test: "Creatinine", val: "1.1", unit: "mg/dL", flag: "", ref: "0.6–1.2" },
  { test: "eGFR", val: "74", unit: "", flag: "L", ref: ">90" },
  { test: "LDL", val: "142", unit: "mg/dL", flag: "H", ref: "<100" },
];
const SCRIBE_LINES = [
  { who: "dr", t: "So the sugars have been running high again?" },
  { who: "pt", t: "Yes doctor, especially fasting. And I feel very thirsty at night." },
  { who: "dr", t: "Any tingling in the feet, any blurring of vision?" },
  { who: "pt", t: "Some tingling in both feet since two weeks." },
  { who: "dr", t: "Okay. Your HbA1c is 8.9 so we'll step up the metformin and add a second agent." },
];
const RX_DRAFT = {
  cc: "Polyuria, nocturnal thirst, b/l foot paraesthesia × 2 weeks",
  hpi: "Known T2DM × 6 yrs on Metformin 500 BD. Worsening glycaemic control, fasting hyperglycaemia. No chest pain, no vision changes.",
  exam: "BP 148/92 · afebrile · feet: reduced monofilament sensation b/l · no ulcers",
  dx: ["Type 2 Diabetes Mellitus — uncontrolled", "Early diabetic peripheral neuropathy"],
  rx: [
    { drug: "Tab. Glycomet GP 1", dose: "1 tab", freq: "BD", dur: "30 days", note: "before food" },
    { drug: "Tab. Gabapentin 300mg", dose: "1 tab", freq: "HS", dur: "15 days", note: "" },
    { drug: "Cap. Rosuvas 10", dose: "1 cap", freq: "HS", dur: "30 days", note: "" },
  ],
  advice: ["HbA1c repeat in 3 months", "Diabetic diet, 30 min walk daily", "Daily foot inspection"],
};

/* ============ PRIMITIVES ============ */
const Chip = ({ children, color = C.teal, bg, sm }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: sm ? 10 : 11.5, fontWeight: 600, padding: sm ? "2px 7px" : "3px 9px", borderRadius: 99, color, background: bg || `${color}1f`, letterSpacing: 0.2 }}>{children}</span>
);
const Btn = ({ children, onClick, primary, ghost, full, sm, icon: Icon, danger }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: full ? "100%" : "auto", padding: sm ? "8px 14px" : "13px 18px", borderRadius: 13,
    fontSize: sm ? 13 : 14.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT,
    letterSpacing: 0.2, transition: "transform .12s, filter .12s",
    color: primary ? "#04201d" : danger ? C.red : ghost ? C.dim : C.text,
    background: primary ? `linear-gradient(180deg, ${C.teal}, ${C.tealDim})` : danger ? C.redBg : ghost ? "transparent" : C.surfaceHi,
    border: ghost ? `1px solid ${C.border}` : "none",
    boxShadow: primary ? `0 6px 22px ${C.glow}` : "none",
  }}
    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
    {Icon && <Icon size={sm ? 15 : 18} strokeWidth={2.4} />}{children}
  </button>
);
const Field = ({ label, value, onChange, ph, icon: Icon, w }) => (
  <div style={{ flex: w || 1, minWidth: 0 }}>
    {label && <div style={{ fontSize: 10.5, color: C.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>{label}</div>}
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surfaceHi, border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px 12px" }}>
      {Icon && <Icon size={15} color={C.faint} strokeWidth={2.2} />}
      <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={ph} style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: C.text, fontSize: 14, fontFamily: FONT }} />
    </div>
  </div>
);
const Sec = ({ children }) => <div style={{ fontSize: 11, color: C.faint, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, margin: "4px 0 2px" }}>{children}</div>;

/* ============ STATUS BAR + FRAMES ============ */
const StatusBar = () => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px 6px", fontSize: 13, color: C.text, fontWeight: 600 }}>
    <span>10:15</span><span style={{ letterSpacing: 1 }}>5G ▪ 71%</span>
  </div>
);
const PhoneFrame = ({ children }) => (
  <div style={{ width: 380, background: C.bg, borderRadius: 30, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column", height: 760, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
    <StatusBar />
    <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
  </div>
);
const Desk = ({ children }) => (
  <div style={{ width: 760, background: C.bg, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden", height: 760, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${C.teal}, ${C.tealDim})`, display: "grid", placeItems: "center" }}><Stethoscope size={15} color="#04201d" /></div>
      <span style={{ fontWeight: 800, fontSize: 15 }}>LIET <span style={{ color: C.faint, fontWeight: 600 }}>· Front Desk</span></span>
      <div style={{ marginLeft: "auto" }}><Chip color={C.green}><span style={{ width: 6, height: 6, borderRadius: 99, background: C.green }} />Online</Chip></div>
    </div>
    <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
  </div>
);

const TopBar = ({ title, onBack, right }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
    {onBack && <button onClick={onBack} style={{ background: C.surfaceHi, border: `1px solid ${C.border}`, borderRadius: 10, padding: 7, cursor: "pointer", display: "grid", placeItems: "center" }}><ChevronLeft size={18} color={C.dim} /></button>}
    <span style={{ fontSize: 17, fontWeight: 800, flex: 1 }}>{title}</span>{right}
  </div>
);

/* ============ WAIT TIMER (live, escalating) ============ */
function useTicker() { const [, set] = useState(0); useEffect(() => { const i = setInterval(() => set((n) => n + 1), 1000); return () => clearInterval(i); }, []); }
const waitColor = (m) => (m >= 20 ? C.red : m >= 10 ? C.amber : C.green);

/* ============ DOCTOR DASHBOARD ============ */
function DoctorDash({ tier, today, queue, go }) {
  useTicker();
  const isSolo = tier === "solo";
  return (
    <div>
      <div style={{ padding: "18px 20px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 23, fontWeight: 800 }}>Dr. K Karthik</div>
            <div style={{ color: C.dim, fontSize: 13.5, marginTop: 2 }}>Wed, 24 June 2026 · General Medicine</div>
          </div>
          <Chip color={C.teal}><span style={{ width: 7, height: 7, borderRadius: 99, background: C.teal, boxShadow: `0 0 8px ${C.teal}` }} />LIVE</Chip>
        </div>
      </div>

      <div style={{ padding: "8px 20px 0" }}>
        <Field value="" onChange={() => {}} ph="Search patient name or phone…" icon={Search} />
        <div style={{ height: 14 }} />
        <Btn primary full icon={Plus} onClick={() => go(isSolo ? "capture" : "queue")}>
          {isSolo ? "New Consultation" : "Walk-in Consultation"}
        </Btn>
      </div>

      {!isSolo && (
        <div style={{ padding: "22px 20px 6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Sec>Live Queue ({queue.length})</Sec>
            <span style={{ fontSize: 11.5, color: C.faint }}>tap a patient to scribe →</span>
          </div>
          {queue.map((p) => (
            <button key={p.id} onClick={() => go(tier === "hospital" ? "timeline" : "scribe", p)} style={{ width: "100%", textAlign: "left", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: C.surfaceHi, display: "grid", placeItems: "center", fontWeight: 800, color: C.tealText, fontSize: 13 }}>{p.token}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                <div style={{ color: C.dim, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.age}/{p.sex} · {p.reason}</div>
              </div>
              <Chip color={waitColor(p.arrivedMin)} sm><Clock size={11} />{p.arrivedMin}m</Chip>
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: "22px 20px 30px" }}>
        <Sec>Seen Today ({today.length})</Sec>
        <div style={{ height: 10 }} />
        {today.length === 0 ? (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "34px 20px", textAlign: "center" }}>
            <div style={{ color: C.dim, fontSize: 15, fontWeight: 600 }}>No consultations finalised yet.</div>
            <div style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>Finished notes appear here, ready to reprint.</div>
          </div>
        ) : today.map((p, i) => (
          <button key={i} onClick={() => go("rx", p)} style={{ width: "100%", textAlign: "left", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 13, marginBottom: 9, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.teal}1a`, display: "grid", placeItems: "center" }}><CheckCircle2 size={19} color={C.teal} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.name}</div>
              <div style={{ color: C.dim, fontSize: 12.5 }}>{p.dx?.[0] || "Consultation complete"}</div>
            </div>
            {p.draft ? <Chip color={C.amber} sm>Draft · awaiting labs</Chip> : <Printer size={17} color={C.faint} />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ PATIENT CAPTURE (solo / new patient) ============ */
function Capture({ go }) {
  const [v, setV] = useState(VITALS_BLANK);
  const [name, setName] = useState("");
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const vit = [
    { k: "bp", label: "BP", icon: Activity, ph: "120/80", suf: "mmHg" },
    { k: "hr", label: "Pulse", icon: Heart, ph: "78", suf: "bpm" },
    { k: "spo2", label: "SpO₂", icon: Droplet, ph: "98", suf: "%" },
    { k: "temp", label: "Temp", icon: Thermometer, ph: "98.4", suf: "°F" },
    { k: "rr", label: "Resp", icon: Wind, ph: "16", suf: "/min" },
    { k: "wt", label: "Weight", icon: Weight, ph: "70", suf: "kg" },
  ];
  return (
    <div>
      <TopBar title="New Consultation" onBack={() => go("dash")} />
      <div style={{ padding: 18 }}>
        <Sec>Patient</Sec>
        <div style={{ height: 10 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <Field label="Full name" value={name} onChange={setName} ph="e.g. Lakshmi Narayan" icon={User} />
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <Field label="Age" value="" onChange={() => {}} ph="54" w={0.5} />
          <Field label="Sex" value="" onChange={() => {}} ph="F" w={0.5} />
          <Field label="Phone" value="" onChange={() => {}} ph="98450…" icon={Phone} w={1.3} />
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${C.teal}12`, border: `1px dashed ${C.tealDim}`, borderRadius: 11, padding: "11px 13px" }}>
          <Hash size={15} color={C.tealText} />
          <span style={{ fontSize: 13, color: C.tealText, fontWeight: 600 }}>OP No. <b>OP-2406-118</b> auto-assigned · used for every revisit</span>
        </div>

        <div style={{ height: 22 }} />
        <Sec>Vitals</Sec>
        <div style={{ height: 10 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {vit.map((x) => (
            <div key={x.k}>
              <div style={{ fontSize: 10.5, color: C.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><x.icon size={12} />{x.label}</div>
              <div style={{ display: "flex", alignItems: "center", background: C.surfaceHi, border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px 12px" }}>
                <input value={v[x.k]} onChange={(e) => set(x.k)(e.target.value)} placeholder={x.ph} style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, fontWeight: 600, fontFamily: FONT }} />
                <span style={{ fontSize: 11, color: C.faint }}>{x.suf}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 24 }} />
        <Btn primary full icon={Mic} onClick={() => go("scribe", { name: name || "Lakshmi Narayan", age: 54, sex: "F", vitals: v.bp ? v : QUEUE_SEED[0].vitals })}>Start Scribing</Btn>
        <div style={{ height: 10 }} />
        <div style={{ textAlign: "center", fontSize: 12, color: C.faint }}>Vitals are optional — you can dictate them too.</div>
      </div>
    </div>
  );
}

/* ============ LIVE SCRIBE (the core moment) ============ */
function Scribe({ patient, tier, go }) {
  const [rec, setRec] = useState(false);
  const [done, setDone] = useState(false);
  const [lines, setLines] = useState([]);
  const [fields, setFields] = useState({ cc: false, hpi: false, exam: false, dx: false, rx: false });
  const [secs, setSecs] = useState(0);
  const timers = useRef([]);
  const scrollRef = useRef(null);

  useEffect(() => { if (rec) { const i = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(i); } }, [rec]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, [lines]);

  const start = () => {
    setRec(true); setLines([]); setDone(false);
    setFields({ cc: false, hpi: false, exam: false, dx: false, rx: false });
    SCRIBE_LINES.forEach((ln, i) => timers.current.push(setTimeout(() => setLines((p) => [...p, ln]), 1100 * (i + 1))));
    const fk = ["cc", "hpi", "exam", "dx", "rx"];
    fk.forEach((k, i) => timers.current.push(setTimeout(() => setFields((p) => ({ ...p, [k]: true })), 1500 + 1200 * i)));
  };
  const stop = () => { timers.current.forEach(clearTimeout); setRec(false); setDone(true); setFields({ cc: true, hpi: true, exam: true, dx: true, rx: true }); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="" onBack={() => go(tier === "solo" ? "dash" : "queue")} right={
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{patient?.name}</div>
            <div style={{ fontSize: 12.5, color: C.dim }}>{patient?.age}/{patient?.sex} · BP {patient?.vitals?.bp} · {patient?.vitals?.temp}°F</div>
          </div>
          {rec && <Chip color={C.red} bg={C.redBg}><span style={{ width: 7, height: 7, borderRadius: 99, background: C.red }} />REC {mm}:{ss}</Chip>}
        </div>} />

      {/* live transcript */}
      <div ref={scrollRef} style={{ flex: "0 0 38%", overflowY: "auto", padding: "14px 18px", background: C.bg }}>
        <Sec>Live Transcript {tier !== "solo" && "· EN/HI"}</Sec>
        {lines.length === 0 && !rec && <div style={{ color: C.faint, fontSize: 13.5, marginTop: 30, textAlign: "center" }}>Press record. LIET listens to the consultation and builds the note in real time.</div>}
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 9 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: l.who === "dr" ? C.tealText : C.violet, marginTop: 2, minWidth: 26 }}>{l.who === "dr" ? "DR" : "PT"}</span>
              <span style={{ fontSize: 13.5, color: C.text, lineHeight: 1.45 }}>{l.t}</span>
            </div>
          ))}
          {rec && <div style={{ display: "flex", gap: 4, paddingLeft: 34 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: 99, background: C.teal, animation: `pulse 1s ${d * 0.2}s infinite` }} />)}</div>}
        </div>
      </div>

      {/* structured note forming */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Sec>Structured Note</Sec>
          {done && <Chip color={C.green} sm><CheckCircle2 size={11} />Drafted</Chip>}
        </div>
        <NoteRow show={fields.cc} label="Chief complaint" val={RX_DRAFT.cc} />
        <NoteRow show={fields.hpi} label="History" val={RX_DRAFT.hpi} />
        <NoteRow show={fields.exam} label="Examination" val={RX_DRAFT.exam} />
        <NoteRow show={fields.dx} label="Diagnosis" val={RX_DRAFT.dx.join(" · ")} accent />
        {fields.rx && (
          <div style={{ marginTop: 12, opacity: 0, animation: "fade .4s forwards" }}>
            <div style={{ fontSize: 10.5, color: C.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Rx · {RX_DRAFT.rx.length} drugs</div>
            {RX_DRAFT.rx.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.surfaceHi, borderRadius: 9, padding: "8px 11px", marginBottom: 6 }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.drug}</div><div style={{ fontSize: 11.5, color: C.dim }}>{d.dose} · {d.freq} · {d.dur}{d.note && ` · ${d.note}`}</div></div>
                <Pencil size={13} color={C.faint} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* controls */}
      <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
        {!rec && !done && <Btn primary full icon={Mic} onClick={start}>Record Consultation</Btn>}
        {rec && (
          <div style={{ display: "flex", gap: 10 }}>
            <Btn ghost icon={Pause} onClick={() => setRec(false)}>Pause</Btn>
            <Btn danger full icon={Square} onClick={stop}>Stop & Generate</Btn>
          </div>
        )}
        {done && (
          <div style={{ display: "flex", gap: 10 }}>
            {tier === "hospital" && <Btn ghost icon={Save} onClick={() => go("dash", { ...patient, draft: true, dx: RX_DRAFT.dx })}>Save draft</Btn>}
            <Btn primary full icon={FileText} onClick={() => go("rx", { ...patient, dx: RX_DRAFT.dx })}>Review Prescription</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
const NoteRow = ({ show, label, val, accent }) => !show ? null : (
  <div style={{ marginTop: 12, opacity: 0, animation: "fade .4s forwards" }}>
    <div style={{ fontSize: 10.5, color: C.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 13.5, color: accent ? C.tealText : C.text, fontWeight: accent ? 700 : 500, lineHeight: 1.5 }}>{val}</div>
  </div>
);

/* ============ RX PREVIEW + PRINT ============ */
function RxPreview({ patient, go, finalize }) {
  const [printed, setPrinted] = useState(false);
  return (
    <div>
      <TopBar title="Prescription" onBack={() => go("dash")} right={<Chip color={C.green} sm><Layers size={11} />v1</Chip>} />
      <div style={{ padding: 18 }}>
        <div style={{ background: "#fbfdfd", borderRadius: 14, padding: 20, color: "#0a1416", fontFamily: "'Georgia', serif", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
          <div style={{ borderBottom: "2px solid #0c7a6e", paddingBottom: 10, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0c5249" }}>Dr. K Karthik</div>
              <div style={{ fontSize: 11.5, color: "#456" }}>MD General Medicine · Reg. KMC 118042</div>
              <div style={{ fontSize: 11.5, color: "#456" }}>Apollo BGS Hospital, Mysuru</div>
            </div>
            <div style={{ fontSize: 11, color: "#678", textAlign: "right" }}>OP-2406-118<br />24 Jun 2026</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span><b>{patient?.name}</b> · {patient?.age}/{patient?.sex}</span>
            <span>BP {patient?.vitals?.bp || "148/92"} · {patient?.vitals?.temp || "98.4"}°F</span>
          </div>
          <div style={{ fontSize: 11.5, color: "#456", marginBottom: 10, fontStyle: "italic" }}>Dx: {(patient?.dx || RX_DRAFT.dx).join(", ")}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0c5249", marginBottom: 4 }}>℞</div>
          {RX_DRAFT.rx.map((d, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{i + 1}. {d.drug}</div>
              <div style={{ fontSize: 12, color: "#345", paddingLeft: 14 }}>{d.dose} — {d.freq} — {d.dur} {d.note && `(${d.note})`}</div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #cdd", marginTop: 10, paddingTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#678", marginBottom: 3 }}>ADVICE</div>
            {RX_DRAFT.advice.map((a, i) => <div key={i} style={{ fontSize: 11.5, color: "#345" }}>• {a}</div>)}
          </div>
          <div style={{ textAlign: "right", marginTop: 18, fontSize: 11, color: "#678" }}>Digitally signed · Dr. K Karthik</div>
        </div>

        <div style={{ height: 16 }} />
        {printed && <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 12, color: C.green, fontSize: 13.5, fontWeight: 600 }}><CheckCircle2 size={16} />Sent to OPD-Printer-01 · also on patient's WhatsApp</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <Btn ghost icon={Pencil}>Edit</Btn>
          <Btn primary full icon={Printer} onClick={() => { setPrinted(true); finalize?.({ ...patient, dx: patient?.dx || RX_DRAFT.dx }); }}>Print & Finalise</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============ MULTI-SPECIALTY: PATIENT TIMELINE ============ */
function Timeline({ patient, go }) {
  const [labOpen, setLabOpen] = useState(false);
  return (
    <div>
      <TopBar title="Patient Record" onBack={() => go("dash")} right={<button onClick={() => setLabOpen(true)} style={{ background: `${C.blue}1a`, border: `1px solid ${C.blue}40`, borderRadius: 10, padding: "7px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: C.blue, fontSize: 12.5, fontWeight: 700 }}><FlaskConical size={14} />Labs</button>} />
      <div style={{ padding: 18 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800 }}>{patient?.name}</div>
              <div style={{ color: C.dim, fontSize: 13, marginTop: 2 }}>{patient?.age}/{patient?.sex} · {patient?.uhid}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Chip color={C.violet} sm><History size={11} />4 visits</Chip>
              <div style={{ fontSize: 11, color: C.faint, marginTop: 6 }}>{patient?.phone}</div>
            </div>
          </div>
        </div>

        <div style={{ height: 18 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Sec>Longitudinal History · all departments</Sec>
          <Chip color={C.amber} sm><ShieldCheck size={11} />access-aware</Chip>
        </div>
        <div style={{ height: 12 }} />
        <div style={{ position: "relative", paddingLeft: 22 }}>
          <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: C.border }} />
          {TIMELINE.map((v, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 14 }}>
              <div style={{ position: "absolute", left: -22, top: 14, width: 12, height: 12, borderRadius: 99, background: v.you ? C.teal : v.locked ? C.surfaceTop : C.surfaceHi, border: `2px solid ${v.you ? C.teal : C.border}`, boxShadow: v.you ? `0 0 8px ${C.teal}` : "none" }} />
              <div style={{ background: v.locked ? C.bg : C.surface, border: `1px solid ${v.locked ? C.border : v.you ? C.tealDim : C.border}`, borderRadius: 13, padding: 13, opacity: v.locked ? 0.78 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: v.you ? C.tealText : C.text }}>{v.dept}{v.you && " · this visit"}</span>
                  {v.locked ? <Lock size={14} color={C.faint} /> : <span style={{ fontSize: 11, color: C.faint }}>{v.date}</span>}
                </div>
                <div style={{ fontSize: 13, color: v.locked ? C.faint : C.dim, marginTop: 4 }}>{v.dx}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <span style={{ fontSize: 11.5, color: C.faint }}>{v.doc}</span>
                  {v.locked && <button style={{ background: "none", border: "none", color: C.blue, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Request access →</button>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 6 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${C.teal}10`, border: `1px solid ${C.tealDim}`, borderRadius: 11, padding: "10px 13px", marginBottom: 14 }}>
          <Unlock size={15} color={C.tealText} />
          <span style={{ fontSize: 12, color: C.tealText, flex: 1 }}>You can restrict <b>your</b> notes from other departments in Settings.</span>
        </div>
        <Btn primary full icon={Mic} onClick={() => go("scribe", patient)}>Start Consultation</Btn>
      </div>

      {labOpen && <LabSheet onClose={() => setLabOpen(false)} />}
    </div>
  );
}

/* ============ LAB RESULTS SHEET ============ */
function LabSheet({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.surface, borderRadius: "22px 22px 0 0", border: `1px solid ${C.border}`, padding: 18, maxHeight: "80%", overflowY: "auto" }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: C.borderHi, margin: "0 auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <FlaskConical size={18} color={C.blue} />
          <span style={{ fontSize: 17, fontWeight: 800 }}>Lab Results</span>
          <Chip color={C.green} sm>resulted today</Chip>
        </div>
        <div style={{ fontSize: 12.5, color: C.dim, marginBottom: 14 }}>Auto-pulled from hospital LIS · attaches to this consultation</div>
        {LABS.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", background: l.flag ? `${l.flag === "H" ? C.red : C.blue}10` : C.surfaceHi, border: `1px solid ${l.flag ? `${l.flag === "H" ? C.red : C.blue}30` : C.border}`, borderRadius: 11, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{l.test}</div>
              <div style={{ fontSize: 11.5, color: C.faint }}>Ref: {l.ref}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: l.flag === "H" ? C.red : l.flag === "L" ? C.blue : C.text }}>{l.val} <span style={{ fontSize: 11, color: C.faint, fontWeight: 500 }}>{l.unit}</span></div>
              {l.flag && <Chip color={l.flag === "H" ? C.red : C.blue} sm>{l.flag === "H" ? "HIGH" : "LOW"}</Chip>}
            </div>
          </div>
        ))}
        <div style={{ height: 8 }} />
        <Btn primary full icon={CheckCircle2} onClick={onClose}>Attach & continue</Btn>
      </div>
    </div>
  );
}

/* ============ RECEPTION DESK ============ */
function Reception({ tier, queue, addToQueue }) {
  useTicker();
  const [tab, setTab] = useState("queue");
  const [q, setQ] = useState("");
  const found = q.length > 2;
  const tabs = [["queue", "Live Queue", Users], ["appts", "Appointments", Calendar], ["reg", "Register / Search", Search]];
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* rail */}
      <div style={{ width: 188, borderRight: `1px solid ${C.border}`, padding: 14, background: C.surface }}>
        {tabs.map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", marginBottom: 6, borderRadius: 11, border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13.5, fontWeight: 700, textAlign: "left", color: tab === k ? "#04201d" : C.dim, background: tab === k ? `linear-gradient(180deg, ${C.teal}, ${C.tealDim})` : "transparent" }}>
            <Icon size={17} />{label}
          </button>
        ))}
        <div style={{ marginTop: 18, padding: 12, background: C.surfaceHi, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>Now serving</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.tealText, marginTop: 4 }}>A-11</div>
          <div style={{ fontSize: 12, color: C.dim }}>Dr. Karthik · Rm 4</div>
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, padding: 18, overflowY: "auto" }}>
        {tab === "queue" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 18, fontWeight: 800 }}>Today · {queue.length} waiting</span>
              <Btn primary sm icon={Plus} onClick={() => setTab("reg")}>Add patient</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "26px 1fr 130px 90px", padding: "0 12px 8px", fontSize: 10.5, color: C.faint, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
              <span>#</span><span>Patient</span><span>Doctor</span><span style={{ textAlign: "right" }}>Waiting</span>
            </div>
            {queue.map((p) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "26px 1fr 130px 90px", alignItems: "center", padding: "12px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 8 }}>
                <span style={{ fontWeight: 800, color: C.tealText, fontSize: 13 }}>{p.token}</span>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 11.5, color: C.dim }}>{p.uhid} · {p.reason}</div></div>
                <span style={{ fontSize: 13, color: C.dim }}>Dr. Karthik</span>
                <div style={{ textAlign: "right" }}><Chip color={waitColor(p.arrivedMin)} sm><Clock size={11} />{p.arrivedMin} min</Chip></div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: C.faint, marginTop: 10, textAlign: "center" }}>Wait time ticks live from arrival · green &lt;10m · amber 10–20m · red &gt;20m</div>
          </>
        )}

        {tab === "appts" && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Appointments · 24 Jun</div>
            {[["09:00", "Lakshmi Narayan", "arrived", C.green], ["09:30", "Rahul Mehta", "arrived", C.green], ["10:00", "Fatima Bi", "arrived", C.green], ["10:30", "Suresh Kumar", "booked", C.dim], ["11:00", "Anjali Pillai", "booked", C.dim]].map(([t, n, s, col], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.tealText, minWidth: 50 }}>{t}</div>
                <div style={{ flex: 1, fontWeight: 700, fontSize: 14.5 }}>{n}</div>
                <Chip color={col} sm>{s === "arrived" ? "Checked in" : "Booked"}</Chip>
                {s === "booked" && <Btn ghost sm onClick={() => addToQueue(n)}>Check in</Btn>}
              </div>
            ))}
            <div style={{ height: 14 }} />
            <Btn primary icon={Plus}>New appointment</Btn>
          </>
        )}

        {tab === "reg" && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Find or register patient</div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 14 }}>Search by phone or name. New patient gets a permanent UHID, mapped for every future visit.</div>
            <Field value={q} onChange={setQ} ph="Phone number or name…" icon={Search} />
            <div style={{ height: 16 }} />
            {!found ? (
              <div style={{ background: C.surface, border: `1px dashed ${C.border}`, borderRadius: 14, padding: "30px 20px", textAlign: "center", color: C.faint, fontSize: 13.5 }}>Type 3+ characters to search the registry.</div>
            ) : (
              <>
                <Sec>Existing match</Sec>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: C.surface, border: `1px solid ${C.tealDim}`, borderRadius: 13, marginTop: 10, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: `${C.teal}1a`, display: "grid", placeItems: "center" }}><User size={20} color={C.tealText} /></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 15 }}>Lakshmi Narayan</div><div style={{ fontSize: 12.5, color: C.dim }}>APL-26-04821 · 54/F · last visit 02 Jun</div></div>
                  <Btn primary sm icon={ArrowRight} onClick={() => addToQueue("Lakshmi Narayan")}>Send to queue</Btn>
                </div>
                <Sec>Not the right person?</Sec>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, background: `${C.teal}10`, border: `1px dashed ${C.tealDim}`, borderRadius: 13, marginTop: 10 }}>
                  <Plus size={20} color={C.tealText} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, color: C.tealText }}>Register new patient</div><div style={{ fontSize: 12, color: C.dim }}>New UHID <b>APL-26-04824</b> will be generated</div></div>
                  <Btn ghost sm>Create</Btn>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ============ BOTTOM NAV (phone) ============ */
const BottomNav = () => (
  <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 14px", borderTop: `1px solid ${C.border}`, background: C.surface }}>
    {[["Home", User, true], ["Patients", Users], ["Help", Circle], ["Settings", ShieldCheck]].map(([l, I, on], i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? C.teal : C.faint }}>
        <I size={19} />
        <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500 }}>{l}</span>
      </div>
    ))}
  </div>
);

/* ============ APP SHELL ============ */
const TIERS = [
  { k: "solo", label: "Solo Clinic", icon: User, sub: "1 doctor · walk-in · print on the spot" },
  { k: "clinic", label: "Multi-Doctor", icon: Building2, sub: "reception · UHID · live queue + timers" },
  { k: "hospital", label: "Multi-Specialty", icon: Hospital, sub: "+ longitudinal · access locks · labs · drafts" },
];

export default function App() {
  const [tier, setTier] = useState("solo");
  const [role, setRole] = useState("doctor");
  const [screen, setScreen] = useState("dash");
  const [cur, setCur] = useState(null);
  const [today, setToday] = useState([]);
  const [queue, setQueue] = useState(QUEUE_SEED);

  const go = (s, patient) => { if (patient) setCur(patient); if (s === "dash" && patient?.draft) setToday((t) => [{ ...patient }, ...t.filter((x) => x.name !== patient.name)]); setScreen(s); };
  const finalize = (p) => { setToday((t) => [{ ...p, draft: false }, ...t.filter((x) => x.name !== p.name)]); setQueue((qx) => qx.filter((x) => x.name !== p.name)); };
  const addToQueue = (name) => { if (!queue.find((x) => x.name === name)) setQueue((qx) => [...qx, { id: "n" + Date.now(), name, uhid: "APL-26-0482" + (qx.length + 4), age: 45, sex: "M", phone: "98xxx", token: "A-" + (15 + qx.length), arrivedMin: 0, dept: "General Medicine", reason: "walk-in", vitals: QUEUE_SEED[0].vitals }]); };

  const reset = (t) => { setTier(t); setScreen(t === "solo" ? "dash" : role === "reception" ? "desk" : "dash"); };
  const setR = (r) => { setRole(r); setScreen(r === "reception" ? "desk" : "dash"); };

  const screenLabel = { dash: "Doctor — Home", capture: "Doctor — New patient", queue: "Doctor — Live queue", scribe: "Doctor — Live scribe", rx: "Doctor — Prescription", timeline: "Doctor — Patient record", desk: "Reception — Front desk" }[screen];

  const renderDoctor = () => {
    if (screen === "capture") return <Capture go={go} />;
    if (screen === "scribe") return <Scribe patient={cur || QUEUE_SEED[0]} tier={tier} go={go} />;
    if (screen === "rx") return <RxPreview patient={cur} go={go} finalize={finalize} />;
    if (screen === "timeline") return <Timeline patient={cur || QUEUE_SEED[0]} go={go} />;
    if (screen === "queue") return <div><TopBar title="Live Queue" onBack={() => go("dash")} /><div style={{ padding: 18 }}><DoctorDash tier={tier === "solo" ? "clinic" : tier} today={[]} queue={queue} go={go} /></div></div>;
    return (<><DoctorDash tier={tier} today={today} queue={queue} go={go} /><BottomNav /></>);
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(1200px 600px at 50% -10%, #0c1517, ${C.bg})`, fontFamily: FONT, color: C.text, padding: "26px 18px 50px" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}@keyframes fade{to{opacity:1}}@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:0}`}</style>

      {/* header */}
      <div style={{ maxWidth: 880, margin: "0 auto 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 4 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.teal}, ${C.tealDim})`, display: "grid", placeItems: "center" }}><Stethoscope size={19} color="#04201d" /></div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>LIET — EMR + Scribe</div>
            <div style={{ fontSize: 12.5, color: C.dim }}>One app, three deployment tiers. Same scribe core, progressively unlocked.</div>
          </div>
        </div>
      </div>

      {/* CONTROL DECK */}
      <div style={{ maxWidth: 880, margin: "0 auto 22px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
        <div style={{ fontSize: 11, color: C.faint, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Deployment tier</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {TIERS.map((t) => {
            const on = tier === t.k;
            return (
              <button key={t.k} onClick={() => reset(t.k)} style={{ textAlign: "left", padding: 13, borderRadius: 13, cursor: "pointer", fontFamily: FONT, border: `1px solid ${on ? C.tealDim : C.border}`, background: on ? `${C.teal}14` : C.surfaceHi, transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <t.icon size={17} color={on ? C.tealText : C.dim} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: on ? C.tealText : C.text }}>{t.label}</span>
                </div>
                <div style={{ fontSize: 11.5, color: C.dim, lineHeight: 1.35 }}>{t.sub}</div>
              </button>
            );
          })}
        </div>
        {tier !== "solo" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: C.faint, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>View as</span>
            {[["doctor", "Doctor", Stethoscope], ["reception", "Reception", ClipboardList]].map(([k, l, I]) => (
              <button key={k} onClick={() => setR(k)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 700, border: `1px solid ${role === k ? C.tealDim : C.border}`, color: role === k ? C.tealText : C.dim, background: role === k ? `${C.teal}14` : "transparent" }}>
                <I size={15} />{l}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: C.faint }}>{screenLabel}</span>
          </div>
        )}
        {tier === "solo" && <div style={{ fontSize: 12, color: C.faint }}>Solo mode has no reception layer — the doctor (or a shared device) captures everything. {screenLabel && `· ${screenLabel}`}</div>}
      </div>

      {/* STAGE */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {role === "reception" && tier !== "solo"
          ? <Desk><Reception tier={tier} queue={queue} addToQueue={addToQueue} /></Desk>
          : <PhoneFrame>{renderDoctor()}</PhoneFrame>}
      </div>

      {/* legend */}
      <div style={{ maxWidth: 880, margin: "26px auto 0", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {[
          "Solo: New Consultation → capture + vitals → scribe → print",
          "Multi-Doctor: Reception registers → queue → doctor taps name → scribe",
          "Multi-Specialty: tap patient → timeline + labs → save draft → finalise",
        ].map((s, i) => (
          <span key={i} style={{ fontSize: 12, color: C.dim, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: "6px 13px" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}
