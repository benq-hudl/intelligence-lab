import { useNavigate } from 'react-router-dom'

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
  {
    id: 'rank-scout-prototype-v2',
    title: 'Scout · Rankings · Radar',
    description: 'Player scouting interface with ranking tables, role-based filtering, opposition strength controls, and radar visualisations. Explores how scout workflows connect ranking, shortlisting, and player evaluation.',
    status: 'exploring',
    date: '2026-03-18',
    tags: ['scouting', 'rankings', 'radar', 'player profiles'],
    dataEndpoints: ['get_player_season_stats', 'player_percentiles'],
    keyInsight: 'Combining ranking, scouting, and radar into one connected workflow with opposition strength filtering.',
    href: './prototypes/rank-scout-prototype-v2.html'
  },
  // END_PROTOTYPES
];

const STATUS = {
  exploring: { label: "Exploring",       color: "#D97706", bg: "#FEF3C7" },
  push:      { label: "Push to Product", color: "#1A8C52", bg: "#E4F4EC" },
  shipped:   { label: "Shipped",         color: "#0369A1", bg: "#E0F2FE" },
  archived:  { label: "Archived",        color: "#6B7280", bg: "#F3F4F6" },
}

// ─── Colour tokens (matching rank prototype / product) ────────────
const C = {
  bg: "#F9FAFB",
  white: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  textMuted: "#6B7280",
  textDim: "#9CA3AF",
  accent: "#1A6AFF",
}

export default function Gallery() {
  const navigate = useNavigate()
  const counts = { exploring: 0, push: 0, shipped: 0, archived: 0 }
  PROTOTYPES.forEach(p => counts[p.status]++)

  function handleCardClick(p) {
    if (p.href) {
      window.open(`/intelligence-lab/prototypes/${p.href.replace('./prototypes/', '')}`, '_blank')
    } else {
      navigate(`/${p.id}`)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Topbar ── */}
      <div style={{ height: 52, background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
          Hudl <span style={{ color: C.accent }}>|</span> StatsBomb
        </div>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>Intelligence Lab</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          {Object.entries(STATUS).map(([key, s]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
              <span style={{ fontSize: 12, color: C.textMuted }}>{s.label}: <strong style={{ color: C.text }}>{counts[key]}</strong></span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 8 }}>
            The Intelligence Advantage
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            Intelligence Lab
          </h1>
          <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 600 }}>
            Prototype experiments exploring what AI + StatsBomb API means for the product.
            Concepts that work graduate to product requirements.
          </p>
        </div>

        {/* Prototype Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PROTOTYPES.map(p => {
            const s = STATUS[p.status]
            return (
              <div key={p.id}
                onClick={() => handleCardClick(p)}
                style={{ background: C.white, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#D1D5DB" }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = C.border }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.title}</h2>
                    <span style={{ fontSize: 12, color: C.textDim }}>{p.date}</span>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg, whiteSpace: "nowrap", border: `1px solid ${s.color}33` }}>
                    {s.label}
                  </span>
                </div>

                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 14 }}>{p.description}</p>

                {/* Tags */}
                {p.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ padding: "2px 10px", borderRadius: 6, fontSize: 11, color: C.textMuted, background: C.bg, border: `1px solid ${C.border}` }}>{t}</span>
                    ))}
                  </div>
                )}

                {/* Key Insight */}
                {p.keyInsight && p.keyInsight !== "TBD" && (
                  <div style={{ padding: "10px 14px", background: "#EFF6FF", borderRadius: 8, border: `1px solid #BFDBFE`, marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>Key Insight: </span>
                    <span style={{ fontSize: 13, color: C.textMuted }}>{p.keyInsight}</span>
                  </div>
                )}

                {/* API endpoints */}
                {p.dataEndpoints.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {p.dataEndpoints.map(e => (
                      <code key={e} style={{ fontSize: 11, color: C.accent, background: "#EFF6FF", padding: "2px 8px", borderRadius: 4, border: `1px solid #BFDBFE` }}>{e}</code>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, padding: "16px 0", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: C.textDim }}>
            Intelligence Lab · The Intelligence Advantage · {PROTOTYPES.length} prototype{PROTOTYPES.length !== 1 ? "s" : ""} · Powered by StatsBomb API
          </p>
        </div>
      </div>
    </div>
  )
}
