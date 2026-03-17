import { Link } from 'react-router-dom'

// ─── Prototype Registry ──────────────────────────────────────────
// Add new prototypes here. Status options:
//   "exploring"  — early experiment, learning from it
//   "push"       — strong concept, push toward product requirements
//   "shipped"    — graduated to real product
//   "archived"   — interesting but not pursuing
const PROTOTYPES = [
  {
    id: "pre-match-analysis",
    title: "Pre-Match Pressing & Corners Analysis",
    description: "Opposition pressing vulnerabilities and set-piece analysis with video-linked key moments. Built from StatsBomb events, player-match-stats, and team-match-stats.",
    status: "push",
    date: "2026-03-17",
    tags: ["match analysis", "pressing", "corners", "set pieces", "video"],
    dataEndpoints: ["get_events", "get_player_match_stats", "get_team_match_stats"],
    keyInsight: "Corners analysis can ship as a pitch vis extension — one sprint MVP. Pressing framework validates the 'designed views + AI narrative' model.",
  },
  // ─── Add new prototypes below ──────────────────────────────────
  // {
  //   id: "recruitment-radar",
  //   title: "AI-Generated Recruitment Comparison",
  //   description: "Natural language query → radar comparison of shortlisted players with AI narrative explaining trade-offs.",
  //   status: "exploring",
  //   date: "2026-03-20",
  //   tags: ["recruitment", "radars", "player comparison"],
  //   dataEndpoints: ["get_player_season_stats", "player_percentiles"],
  //   keyInsight: "TBD",
  // },
    {
    id: 'rank-scout-prototype-v2',
    title: 'Scout Rankings Radar',
    description: '',
    status: 'exploring',
    date: '2026-03-17',
    tags: [],
    dataEndpoints: [],
    keyInsight: '',
    href: './prototypes/rank-scout-prototype-v2.html'
  },
  // END_PROTOTYPES
];
]

const STATUS = {
  exploring: { label: "Exploring", color: "#818cf8", bg: "#4f46e522" },
  push:      { label: "Push to Product", color: "#10b981", bg: "#064e3b33" },
  shipped:   { label: "Shipped", color: "#06b6d4", bg: "#0e749022" },
  archived:  { label: "Archived", color: "#5c6080", bg: "#2a2d5233" },
}

export default function Gallery() {
  const counts = { exploring: 0, push: 0, shipped: 0, archived: 0 }
  PROTOTYPES.forEach(p => counts[p.status]++)

  return (
    <div style={{ minHeight: "100vh", background: "#0f1120", color: "#e8e8f0", fontFamily: "'Inter', system-ui, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#6366f1", marginBottom: 8 }}>
            Hudl StatsBomb
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Intelligence Lab
          </h1>
          <p style={{ fontSize: 15, color: "#8b8fa8", marginBottom: 24, maxWidth: 600 }}>
            Prototype experiments exploring what AI + StatsBomb API means for the product.
            Each prototype tests a concept — the ones that work graduate to product requirements.
          </p>

          {/* Status summary */}
          <div style={{ display: "flex", gap: 16 }}>
            {Object.entries(STATUS).map(([key, s]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: 13, color: "#8b8fa8" }}>{s.label}: <strong style={{ color: "#e8e8f0" }}>{counts[key]}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Prototype Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PROTOTYPES.map(p => {
            const s = STATUS[p.status]
            return (
              <Link key={p.id} to={`/${p.id}`}
                style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#1c1f3a", borderRadius: 16, padding: 28, border: "1px solid #2a2d52", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#222550"; e.currentTarget.style.borderColor = "#363a66" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1c1f3a"; e.currentTarget.style.borderColor = "#2a2d52" }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{p.title}</h2>
                      <span style={{ fontSize: 12, color: "#5c6080" }}>{p.date}</span>
                    </div>
                    <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.color}33`, whiteSpace: "nowrap" }}>
                      {s.label}
                    </span>
                  </div>

                  <p style={{ fontSize: 14, color: "#8b8fa8", lineHeight: 1.6, marginBottom: 16 }}>{p.description}</p>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ padding: "2px 10px", borderRadius: 6, fontSize: 11, color: "#8b8fa8", background: "#161830", border: "1px solid #2a2d52" }}>{t}</span>
                    ))}
                  </div>

                  {/* Key Insight */}
                  {p.keyInsight && p.keyInsight !== "TBD" && (
                    <div style={{ padding: "10px 14px", background: "#161830", borderRadius: 8, border: "1px solid #2a2d52" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.5 }}>Key Insight: </span>
                      <span style={{ fontSize: 13, color: "#8b8fa8" }}>{p.keyInsight}</span>
                    </div>
                  )}

                  {/* API endpoints used */}
                  <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                    {p.dataEndpoints.map(e => (
                      <code key={e} style={{ fontSize: 11, color: "#06b6d4", background: "#0e749022", padding: "2px 8px", borderRadius: 4 }}>{e}</code>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, padding: "20px 0", borderTop: "1px solid #2a2d52", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#5c6080" }}>
            Intelligence Lab — The Intelligence Advantage · {PROTOTYPES.length} prototype{PROTOTYPES.length !== 1 ? "s" : ""} · Powered by StatsBomb API
          </p>
        </div>
      </div>
    </div>
  )
}
