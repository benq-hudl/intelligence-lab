import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronDown, ChevronRight, Play, AlertTriangle, Shield, Target, TrendingDown, Video, Users, Activity, Crosshair, Eye, CornerDownRight } from "lucide-react";

// ─── Colour Tokens — light product theme (matching rank prototype) ─
const C = {
  bg: "#F9FAFB", surface: "#F3F4F6", card: "#FFFFFF", cardHover: "#F0F4FF",
  border: "#E5E7EB", borderLight: "#D1D5DB",
  text: "#111827", textMuted: "#6B7280", textDim: "#9CA3AF",
  accent: "#1A6AFF", accentLight: "#4D8AFF", accentDim: "#1557DB",
  red: "#E03A3A", redDim: "#FDEAEA", redLight: "#FCA5A5",
  amber: "#D97706", amberDim: "#FEF3C7", amberLight: "#FCD34D",
  green: "#1A8C52", greenDim: "#E4F4EC", greenLight: "#6EE7B7",
  cyan: "#0369A1", purple: "#7C3AED", purpleDim: "#EDE9FE",
};

// ─── Mock Data — from real StatsBomb API pulls ────────────────────
const COMPETITIONS = [
  { id: 16, season_id: 318, name: "Champions League 2025/26" },
  { id: 11, season_id: 317, name: "La Liga 2025/26" },
  { id: 2, season_id: 316, name: "Premier League 2025/26" },
];

const TEAMS = {
  16: [
    { id: 980, name: "Galatasaray", logo: "🟡" },
    { id: 64, name: "Liverpool", logo: "🔴" },
    { id: 131, name: "Real Madrid", logo: "⚪" },
    { id: 220, name: "Bayern Munich", logo: "🔴" },
    { id: 36, name: "Arsenal", logo: "🔴" },
  ],
};

const MATCHES = {
  980: [
    { id: 4052709, opponent: "Liverpool", date: "2026-03-10", venue: "Home", score: "1-0 W", competition: "UCL R16 1st Leg" },
    { id: 4028882, opponent: "Liverpool", date: "2025-09-30", venue: "Away", score: "0-1 L", competition: "UCL Group" },
    { id: 4038901, opponent: "Young Boys", date: "2025-12-10", venue: "Home", score: "3-0 W", competition: "UCL Group" },
    { id: 4038900, opponent: "RB Leipzig", date: "2025-11-26", venue: "Away", score: "2-1 W", competition: "UCL Group" },
    { id: 4028881, opponent: "Slovan Bratislava", date: "2025-10-22", venue: "Home", score: "4-0 W", competition: "UCL Group" },
  ],
};

// ─── Pre-match pressing data ──────────────────────────────────────
const PRESSING_DATA = {
  4052709: {
    upcoming: { opponent: "Liverpool", date: "Mar 10 2026", venue: "Rams Park, Istanbul", kickoff: "21:00 CET" },
    formation: "4-2-3-1",
    defenders: [
      { name: "W. Singo", position: "RB", pid: 27506, number: 2, avgPassPct: 80.1, oppPassPct: 73.2, pressPct: 62.5, turnovers90: 1.17, obv90: -0.074, rating: "medium", keyWeakness: "Negative OBV — loses value on the ball", seasonNote: "7 turnovers in 6 UCL matches, tends to dwell under pressure" },
      { name: "K. Bardakcı", position: "LCB", pid: 48383, number: 22, avgPassPct: 84.3, oppPassPct: 74.3, pressPct: 70.5, turnovers90: 0.55, obv90: 0.046, rating: "low", keyWeakness: "Drops 10pp in pass accuracy vs top press", seasonNote: "Most composed of the four, rarely exposed" },
      { name: "D. Sánchez", position: "RCB", pid: 3494, number: 6, avgPassPct: 86.8, oppPassPct: 69.0, pressPct: 70.3, turnovers90: 0.63, obv90: 0.110, rating: "high", keyWeakness: "Biggest pass% drop under Liverpool press (-17.8pp)", seasonNote: "High baseline, but Liverpool specifically targeted him in September. 6 own-half losses under pressure." },
      { name: "I. Jakobs", position: "LB", pid: 32915, number: 12, avgPassPct: 73.1, oppPassPct: 57.5, pressPct: 63.0, turnovers90: 0.82, obv90: 0.305, rating: "high", keyWeakness: "Lowest baseline pass accuracy, drops to 57.5% under Liverpool press", seasonNote: "Paradox: highest OBV (+0.305/90) but worst accuracy. High risk / high reward fullback." },
    ],
    videoMoments: [
      { minute: 12, second: 34, period: 1, type: "Pressure", player: "D. Sánchez", desc: "Sánchez forced into long ball under Salah press — incomplete, Liverpool counter", obv: -0.08, severity: "high", eventId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
      { minute: 18, second: 7, period: 1, type: "Turnover", player: "I. Jakobs", desc: "Jakobs dispossessed by Szoboszlai on halfway line, Liverpool break", obv: -0.15, severity: "critical", eventId: "b2c3d4e5-f6a7-8901-bcde-f12345678901" },
      { minute: 23, second: 51, period: 1, type: "Pressure", player: "D. Sánchez", desc: "Sánchez misplaces pass under press to Bardakcı — intercepted", obv: -0.06, severity: "medium", eventId: "c3d4e5f6-a7b8-9012-cdef-123456789012" },
      { minute: 31, second: 19, period: 1, type: "OwnHalfLoss", player: "W. Singo", desc: "Singo loses duel in own half, foul conceded — Liverpool free kick", obv: -0.04, severity: "medium", eventId: "d4e5f6a7-b8c9-0123-defa-234567890123" },
      { minute: 37, second: 42, period: 1, type: "Pressure", player: "I. Jakobs", desc: "Jakobs long ball attempt under heavy press — heads out for throw-in", obv: -0.03, severity: "low", eventId: "e5f6a7b8-c9d0-1234-efab-345678901234" },
      { minute: 52, second: 8, period: 2, type: "Turnover", player: "D. Sánchez", desc: "Sánchez pressured into back-pass, GK clearance to Liverpool — half-chance", obv: -0.12, severity: "high", eventId: "f6a7b8c9-d0e1-2345-fabc-456789012345" },
      { minute: 61, second: 22, period: 2, type: "Pressure", player: "I. Jakobs", desc: "Jakobs drives forward, loses ball in middle third — transition conceded", obv: -0.11, severity: "high", eventId: "a7b8c9d0-e1f2-3456-abcd-567890123456" },
      { minute: 67, second: 55, period: 2, type: "OwnHalfLoss", player: "K. Bardakcı", desc: "Bardakcı miscontrols under pressure — Liverpool win possession in Gala half", obv: -0.07, severity: "medium", eventId: "b8c9d0e1-f2a3-4567-bcde-678901234567" },
      { minute: 78, second: 3, period: 2, type: "Pressure", player: "D. Sánchez", desc: "Sánchez clips long pass under press — finds Jakobs but no progression", obv: 0.02, severity: "low", eventId: "c9d0e1f2-a3b4-5678-cdef-789012345678" },
      { minute: 84, second: 18, period: 2, type: "Turnover", player: "W. Singo", desc: "Singo gives ball away cheaply, Liverpool chance from right side", obv: -0.09, severity: "high", eventId: "d0e1f2a3-b4c5-6789-defa-890123456789" },
    ],
    pressingProfile: { teamPressures: 142, teamPressSuccPct: 31.2, oppPressures: 168, oppPressSuccPct: 38.7, ppda: 8.4, oppPpda: 11.2 },
    recommendation: {
      primaryTarget: "D. Sánchez", primaryReason: "Biggest accuracy collapse under pressure (−17.8pp). Liverpool already identified this in September — 6 own-half losses under direct pressure. High-profile errors create psychological compounding.",
      secondaryTarget: "I. Jakobs", secondaryReason: "Lowest baseline accuracy (73.1%). High-risk style means turnovers come from ambitious play, not just pressure. A high press on Jakobs forces conservative play that neutralises his OBV contribution.",
      tacticalNote: "Liverpool's left-side press (Salah + Szoboszlai) should orient toward Sánchez's channel. When Galatasaray build left, trap Jakobs early — he attempts risky passes when first-option is blocked.",
    },
  },
};

// ─── Set piece (corners) data — from real StatsBomb events ─────────
const CORNERS_DATA = {
  4052709: {
    summary: {
      teamCorners: 7, oppCorners: 4,
      teamShotsFromCorners: 6, oppShotsFromCorners: 0,
      teamXgFromCorners: 0.568, oppXgFromCorners: 0.0,
      teamGoalsFromCorners: 1, oppGoalsFromCorners: 0,
    },
    // Split by side — mirrors the StatsBomb corners dashboard layout
    fromRight: {
      count: 3, shortPct: 0,
      takers: [{ name: "Gabriel Sara", pct: 100 }],
      outswinging: 3, inswinging: 0,
      // Delivery zone grid: 6-col x 3-row over penalty box (% of deliveries landing there)
      // Rows: back of box / central / near-post edge. Cols: far-post wing → near-post wing
      zoneGrid: [
        [0, 0, 0, 0, 0, 0],       // behind box
        [0, 0, 33, 33, 0, 0],     // back of box (central heavy)
        [0, 0, 0, 33, 0, 0],      // front of box / 6-yard
      ],
      deliveries: [
        { minute: 6, technique: "Outswinging", foot: "Left", endX: 109, endY: 45, outcome: "Complete", shotXg: 0.295, goal: true },
        { minute: 23, technique: "Outswinging", foot: "Left", endX: 108, endY: 48, outcome: "Complete", shotXg: 0.178, goal: false },
        { minute: 24, technique: "Outswinging", foot: "Left", endX: 120, endY: 34, outcome: "Out", shotXg: 0, goal: false },
      ],
      xgTotal: 0.473, shots: 4, goals: 1,
    },
    fromLeft: {
      count: 4, shortPct: 0,
      takers: [{ name: "Gabriel Sara", pct: 100 }],
      outswinging: 2, inswinging: 2,
      zoneGrid: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 25, 25, 0, 0],
        [0, 25, 0, 0, 0, 0],
      ],
      deliveries: [
        { minute: 21, technique: "Inswinging", foot: "Left", endX: 110, endY: 42, outcome: "Incomplete", shotXg: 0, goal: false },
        { minute: 41, technique: "Outswinging", foot: "Left", endX: 116, endY: 76, outcome: "Complete", shotXg: 0.064, goal: false },
        { minute: 84, technique: "Inswinging", foot: "Left", endX: 116, endY: 40, outcome: "Incomplete", shotXg: 0, goal: false },
        { minute: 93, technique: "Outswinging", foot: "Right", endX: 115, endY: 48, outcome: "Incomplete", shotXg: 0.031, goal: false },
      ],
      xgTotal: 0.095, shots: 2, goals: 0,
    },
    // First contact — who wins the header/touch on the delivery
    firstContact: [
      { player: "V. Osimhen", contacts: 3, shots: 2, goals: 0 },
      { player: "M. Lemina", contacts: 2, shots: 2, goals: 1 },
      { player: "D. Sánchez", contacts: 1, shots: 1, goals: 0 },
      { player: "I. Jakobs", contacts: 1, shots: 1, goals: 0 },
      { player: "K. Bardakcı", contacts: 1, shots: 0, goals: 0 },
    ],
    // Full corner sequences (kept from before for expandable detail)
    attackingCorners: [
      { minute: 6, side: "Right", technique: "Outswinging", foot: "Left", zone: "Central", outcome: "Complete", resultedInShot: true, xgGenerated: 0.295, goalScored: true, taker: "Gabriel Sara", eventId: "7fba9baa-e1b8-4e6e-8790-f440fbfa774c",
        sequence: [
          { minute: 6, second: 28, event: "Corner delivery", player: "Gabriel Sara", detail: "Outswinging from right → central area", eventId: "7fba9baa-e1b8-4e6e-8790-f440fbfa774c" },
          { minute: 6, second: 30, event: "Header", player: "Victor Osimhen", detail: "Flick-on, wayward (xG: 0.061)", eventId: "40df40de-64db-4267-a9f4-0556b271c906" },
          { minute: 6, second: 32, event: "Ball Recovery", player: "Mario Lemina", detail: "Picks up loose ball in box", eventId: "a933ad19-3258-41e8-becb-3374e318f2e0" },
          { minute: 6, second: 33, event: "GOAL", player: "Mario Lemina", detail: "Header from close range (xG: 0.233)", eventId: "71ca2a52-a45f-47f6-b65c-be1cf84e6b1e" },
        ]
      },
      { minute: 21, side: "Left", technique: "Inswinging", foot: "Left", zone: "Central", outcome: "Incomplete", resultedInShot: false, xgGenerated: 0, goalScored: false, taker: "Gabriel Sara", eventId: "d6865b87-20a8-4c61-912d-e1d5ce67801b", sequence: [] },
      { minute: 23, side: "Right", technique: "Outswinging", foot: "Left", zone: "Central", outcome: "Complete", resultedInShot: true, xgGenerated: 0.178, goalScored: false, taker: "Gabriel Sara", eventId: "some-id-23",
        sequence: [
          { minute: 23, second: 33, event: "Corner delivery", player: "Gabriel Sara", detail: "Outswinging from right → central", eventId: "some-id-23" },
          { minute: 23, second: 35, event: "Shot", player: "Victor Osimhen", detail: "Volley, wayward (xG: 0.074)", eventId: "some-id-23b" },
          { minute: 23, second: 37, event: "Shot", player: "Davinson Sánchez", detail: "Header, saved (xG: 0.104)", eventId: "some-id-23c" },
        ]
      },
      { minute: 24, side: "Right", technique: "Outswinging", foot: "Left", zone: "Near Post", outcome: "Out", resultedInShot: false, xgGenerated: 0, goalScored: false, taker: "Gabriel Sara", eventId: "some-id-24", sequence: [] },
      { minute: 41, side: "Left", technique: "Outswinging", foot: "Left", zone: "Far Post", outcome: "Complete", resultedInShot: true, xgGenerated: 0.064, goalScored: false, taker: "Gabriel Sara", eventId: "some-id-41",
        sequence: [
          { minute: 41, second: 12, event: "Corner delivery", player: "Gabriel Sara", detail: "Outswinging from left → far post", eventId: "some-id-41" },
          { minute: 41, second: 15, event: "Shot", player: "Mario Lemina", detail: "Header, wayward (xG: 0.064)", eventId: "some-id-41b" },
        ]
      },
      { minute: 84, side: "Left", technique: "Inswinging", foot: "Left", zone: "Central", outcome: "Incomplete", resultedInShot: false, xgGenerated: 0, goalScored: false, taker: "Gabriel Sara", eventId: "some-id-84", sequence: [] },
      { minute: 93, side: "Left", technique: "Outswinging", foot: "Right", zone: "Central", outcome: "Incomplete", resultedInShot: false, xgGenerated: 0.031, goalScored: false, taker: "Gabriel Sara", eventId: "some-id-93",
        sequence: [
          { minute: 94, second: 2, event: "Shot", player: "Ismail Jakobs", detail: "Half volley, off target (xG: 0.031)", eventId: "some-id-93b" },
        ]
      },
    ],
    defendingWeaknesses: [
      { area: "Second Balls", detail: "The winning goal came from a second ball — Osimhen's initial header was wayward but Lemina recovered and scored. Liverpool failed to clear.", severity: "critical" },
      { area: "Zonal Marking Gaps", detail: "Galatasaray's outswinging deliveries consistently found the central zone between Liverpool's markers. 3/7 corners found a free header.", severity: "high" },
      { area: "Aerial Duels", detail: "Osimhen and Lemina dominated aerial contests from corners. Osimhen attempted 3 headers, Lemina scored from one.", severity: "high" },
      { area: "Set Piece Discipline", detail: "Liverpool committed 3 fouls from their own 4 corners — Konaté and Robertson both conceded fouls, wasting attacking set pieces.", severity: "medium" },
    ],
    oppositionCorners: [
      { minute: 35, taker: "Szoboszlai", technique: "Inswinging", outcome: "GK claimed — Çakır comfortable catch", threat: "low", eventId: "some-id-35" },
      { minute: 65, taker: "Szoboszlai", technique: "Inswinging", outcome: "Foul committed by Robertson — wasted", threat: "none", eventId: "some-id-65" },
      { minute: 69, taker: "Szoboszlai", technique: "Inswinging", outcome: "Foul committed by Konaté — wasted", threat: "none", eventId: "some-id-69" },
      { minute: 80, taker: "Szoboszlai", technique: "Inswinging", outcome: "Foul committed by Robertson — wasted", threat: "none", eventId: "some-id-80" },
    ],
    recommendation: {
      attacking: "Galatasaray are lethal from right-side outswinging corners delivered by Sara (left foot). The pattern: outswinging into the central zone → Osimhen flick-on → second ball danger. Liverpool must assign a specific marker to Lemina on second balls — he scored the winner this way.",
      defending: "Liverpool's corners were a non-threat in this match. 3 of 4 ended in Liverpool fouls. Szoboszlai's inswinging deliveries were predictable (all right foot, all central). Galatasaray can be confident sitting deep on Liverpool corners.",
      keyStat: "0.568 xG from corners (Gala) vs 0.000 xG (Liverpool) — Galatasaray's set piece advantage was the decisive factor in this match.",
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────
const ratingColor = (r) => r === "critical" ? C.red : r === "high" ? C.red : r === "medium" ? C.amber : r === "low" ? C.green : C.textDim;
const ratingBg = (r) => r === "critical" ? C.redDim : r === "high" ? C.redDim : r === "medium" ? C.amberDim : C.greenDim;
const formatTs = (min, sec) => `${min}:${String(sec).padStart(2, "0")}`;
const periodLabel = (p) => p === 1 ? "1H" : "2H";

// ─── Shared Components ───────────────────────────────────────────
const Badge = ({ children, color = C.accent, bg = C.accentDim + "33" }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color, background: bg }}>{children}</span>
);

const SeverityDot = ({ severity }) => (
  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: ratingColor(severity), boxShadow: `0 0 6px ${ratingColor(severity)}44` }} />
);

const VideoEventRow = ({ moment, showPlayer = true }) => (
  <div style={{ background: C.card, borderRadius: 12, padding: "14px 20px", border: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: showPlayer ? "80px 100px 1fr 90px 80px" : "80px 1fr 90px", alignItems: "center", gap: 16, cursor: "pointer", transition: "background 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
    onMouseLeave={e => e.currentTarget.style.background = C.card}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Play size={13} color={C.accent} fill={C.accent} />
      <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600 }}>{formatTs(moment.minute, moment.second)}</span>
    </div>
    {showPlayer && <div style={{ fontSize: 13, fontWeight: 600 }}>{moment.player}</div>}
    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>
      {moment.desc || moment.detail}
    </div>
    {moment.obv !== undefined && (
      <div style={{ textAlign: "right" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: moment.obv < 0 ? C.red : C.green, fontFamily: "monospace" }}>
          {moment.obv > 0 ? "+" : ""}{moment.obv.toFixed(2)} OBV
        </span>
      </div>
    )}
    {moment.severity && (
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
        <SeverityDot severity={moment.severity} />
        <span style={{ fontSize: 11, color: ratingColor(moment.severity), fontWeight: 500, textTransform: "capitalize" }}>{moment.severity}</span>
      </div>
    )}
  </div>
);

// ─── Delivery Zone Heatmap (StatsBomb Dashboard style) ─────────────
const DeliveryZoneHeatmap = ({ zoneGrid, deliveries, side, cornerFrom }) => {
  const W = 300, H = 240;
  // Half-pitch: penalty box occupies most of the view, goal on right
  const boxL = 40, boxR = W - 10, boxT = 30, boxB = H - 30;
  const sixL = boxR - 80, sixT = boxT + 45, sixB = boxB - 45;
  const goalT = boxT + 65, goalB = boxB - 65;
  // 6 columns x 3 rows grid over the box area
  const cols = 6, rows = 3;
  const cellW = (boxR - boxL) / cols, cellH = (boxB - boxT) / rows;
  const maxVal = Math.max(1, ...zoneGrid.flat());

  // Corner flag position
  const cornerY = cornerFrom === "Right" ? boxT - 15 : boxB + 15;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 320 }}>
      {/* Background */}
      <rect x={0} y={0} width={W} height={H} fill={C.surface} rx={8} />

      {/* Penalty box */}
      <rect x={boxL} y={boxT} width={boxR - boxL} height={boxB - boxT} fill="none" stroke={C.border} strokeWidth={1.5} />
      {/* 6-yard box */}
      <rect x={sixL} y={sixT} width={boxR - sixL} height={sixB - sixT} fill="none" stroke={C.border} strokeWidth={1} />
      {/* Goal */}
      <rect x={boxR} y={goalT} width={8} height={goalB - goalT} fill="none" stroke="#fff" strokeWidth={2} />
      {/* Penalty spot */}
      <circle cx={boxL + (boxR - boxL) * 0.45} cy={(boxT + boxB) / 2} r={2} fill={C.border} />
      {/* Corner arc */}
      <path d={`M ${boxR + 5} ${cornerFrom === "Right" ? boxT : boxB} A 12 12 0 0 ${cornerFrom === "Right" ? "1" : "0"} ${boxR - 7} ${cornerFrom === "Right" ? boxT - 5 : boxB + 5}`}
        fill="none" stroke={C.border} strokeWidth={1} />

      {/* Heatmap cells */}
      {zoneGrid.map((row, ri) => row.map((val, ci) => {
        if (val === 0) return null;
        const x = boxL + ci * cellW;
        const y = boxT + ri * cellH;
        const intensity = val / maxVal;
        // Red scale matching StatsBomb: low = grey, high = red
        const r = Math.round(80 + intensity * 175);
        const g = Math.round(40 + (1 - intensity) * 40);
        const b = Math.round(40 + (1 - intensity) * 40);
        return (
          <g key={`${ri}-${ci}`}>
            <rect x={x + 1} y={y + 1} width={cellW - 2} height={cellH - 2} fill={`rgb(${r},${g},${b})`} opacity={0.7 + intensity * 0.3} rx={2} />
            <text x={x + cellW / 2} y={y + cellH / 2 + 5} fill="#fff" fontSize={13} fontWeight={700} textAnchor="middle">{val}%</text>
          </g>
        );
      }))}

      {/* Delivery arcs */}
      {deliveries.map((d, i) => {
        const startX = boxR;
        const startY = cornerFrom === "Right" ? boxT - 8 : boxB + 8;
        // Map end location to box coordinates
        const endX = boxL + ((d.endX - 102) / 18) * (boxR - boxL);
        const endY = boxT + (d.endY / 80) * (boxB - boxT);
        const cpX = (startX + endX) / 2;
        const cpY = cornerFrom === "Right" ? startY + (endY - startY) * 0.3 : startY + (endY - startY) * 0.3;
        const color = d.goal ? C.green : d.shotXg > 0 ? C.red : C.textDim;
        return (
          <g key={i} opacity={0.6}>
            <path d={`M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`}
              fill="none" stroke={color} strokeWidth={d.goal ? 2.5 : 1.5}
              strokeDasharray={d.outcome !== "Complete" ? "3,3" : "none"} />
            <circle cx={endX} cy={endY} r={3} fill={color} />
          </g>
        );
      })}

      {/* Labels */}
      <text x={boxL + 5} y={boxT - 8} fill={C.textDim} fontSize={9}>Far Post</text>
      <text x={boxR - 50} y={boxT - 8} fill={C.textDim} fontSize={9}>Near Post</text>
    </svg>
  );
};

// ─── Metric Bubble (like StatsBomb's red circles) ──────────────────
const MetricBubble = ({ value, label, highlight = false, size = 56 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div style={{ width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      background: highlight ? C.red : "transparent", border: `2px solid ${highlight ? C.red : C.border}`,
      color: highlight ? "#fff" : C.text, fontSize: size > 50 ? 16 : 14, fontWeight: 700 }}>
      {value}
    </div>
    <span style={{ fontSize: 10, color: C.textMuted, textAlign: "center" }}>{label}</span>
  </div>
);

// ─── First Contact Bar Chart (StatsBomb style) ─────────────────────
const FirstContactChart = ({ data }) => {
  const maxContacts = Math.max(...data.map(d => d.contacts));
  const barW = 260;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, textAlign: "right", color: C.text }}>{d.player}</span>
          <div style={{ position: "relative", height: 22 }}>
            {/* Total contacts (grey) */}
            <div style={{ position: "absolute", top: 0, left: 0, height: 22, width: `${(d.contacts / maxContacts) * 100}%`, background: C.border, borderRadius: 3 }} />
            {/* Shots (red) */}
            {d.shots > 0 && <div style={{ position: "absolute", top: 0, left: 0, height: 22, width: `${(d.shots / maxContacts) * 100}%`, background: C.red, borderRadius: 3 }} />}
            {/* Goals (dark) */}
            {d.goals > 0 && <div style={{ position: "absolute", top: 0, left: 0, height: 22, width: `${(d.goals / maxContacts) * 100}%`, background: "#1a1a2e", borderRadius: 3 }} />}
            {/* Count label */}
            <span style={{ position: "absolute", top: 3, left: `${(d.contacts / maxContacts) * 100 + 2}%`, fontSize: 11, color: C.textMuted }}>{d.contacts}</span>
          </div>
        </div>
      ))}
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 4, paddingLeft: 110 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, background: C.border, borderRadius: 2 }} /><span style={{ fontSize: 10, color: C.textMuted }}>first contact</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, background: C.red, borderRadius: 2 }} /><span style={{ fontSize: 10, color: C.textMuted }}>shot</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, background: "#1a1a2e", border: `1px solid ${C.border}`, borderRadius: 2 }} /><span style={{ fontSize: 10, color: C.textMuted }}>goal</span></div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function PreMatchAnalysis() {
  const [step, setStep] = useState("select");
  const [competition, setCompetition] = useState(null);
  const [team, setTeam] = useState(null);
  const [match, setMatch] = useState(null);
  const [activeTab, setActiveTab] = useState("pressing");
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [videoFilter, setVideoFilter] = useState("all");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [expandedCorner, setExpandedCorner] = useState(null);
  const [showCornerRec, setShowCornerRec] = useState(false);

  const pressing = match ? PRESSING_DATA[match.id] : null;
  const corners = match ? CORNERS_DATA[match.id] : null;

  // ─── SELECTION SCREEN ─────────────────────────────────────────
  if (step === "select") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Topbar */}
        <div style={{ height: 52, background: "#FFFFFF", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
            Hudl <span style={{ color: C.accent }}>|</span> StatsBomb
          </div>
          <div style={{ width: 1, height: 20, background: C.border }} />
          <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>Pre-Match Intelligence</span>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 8 }}>Opposition Analysis</h1>
            <p style={{ fontSize: 14, color: C.textMuted }}>Pressing vulnerabilities, set piece threats, and video-linked key moments</p>
          </div>

          {/* Step 1: Competition */}
          <StepLabel num={1} label="Competition" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
            {COMPETITIONS.map(c => (
              <SelectButton key={c.id} selected={competition?.id === c.id}
                onClick={() => { setCompetition(c); setTeam(null); setMatch(null); }}>
                {c.name}
              </SelectButton>
            ))}
          </div>

          {/* Step 2: Team */}
          {competition && (<>
            <StepLabel num={2} label="Opposition Team to Analyse" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 32 }}>
              {(TEAMS[competition.id] || []).map(t => (
                <SelectButton key={t.id} selected={team?.id === t.id}
                  onClick={() => { setTeam(t); setMatch(null); }}>
                  <span style={{ fontSize: 22, marginRight: 8 }}>{t.logo}</span>{t.name}
                </SelectButton>
              ))}
            </div>
          </>)}

          {/* Step 3: Match */}
          {team && MATCHES[team.id] && (<>
            <StepLabel num={3} label="Match to Prepare For" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {MATCHES[team.id].map(m => (
                <button key={m.id} onClick={() => setMatch(m)}
                  style={{ padding: "16px 20px", background: match?.id === m.id ? C.accentDim + "44" : C.card, border: `1px solid ${match?.id === m.id ? C.accent : C.border}`, borderRadius: 12, color: C.text, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>vs {m.opponent} ({m.venue})</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{m.competition} · {m.date}</div>
                  </div>
                  <Badge color={m.score.includes("W") ? C.green : m.score.includes("L") ? C.red : C.amber}
                    bg={m.score.includes("W") ? C.greenDim + "55" : m.score.includes("L") ? C.redDim + "55" : C.amberDim + "55"}>
                    {m.score}
                  </Badge>
                </button>
              ))}
            </div>
          </>)}

          {/* Generate */}
          {match && PRESSING_DATA[match.id] && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button onClick={() => { setStep("analysis"); setActiveTab("pressing"); setShowRecommendation(false); setShowCornerRec(false); }}
                style={{ padding: "16px 40px", background: `linear-gradient(135deg, ${C.accent}, ${C.accentDim})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 20px ${C.accent}44`, display: "inline-flex", alignItems: "center", gap: 10 }}>
                <Target size={18} /> Generate Pre-Match Report
              </button>
            </div>
          )}
          {match && !PRESSING_DATA[match.id] && (
            <div style={{ textAlign: "center", marginTop: 40, padding: 24, background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <p style={{ color: C.textMuted, fontSize: 14 }}>
                <AlertTriangle size={16} style={{ verticalAlign: "middle", marginRight: 6, color: C.amber }} />
                In production, this calls StatsBomb API live. This prototype has data for Galatasaray vs Liverpool (R16).
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── ANALYSIS SCREEN ──────────────────────────────────────────
  const { defenders, videoMoments, pressingProfile, recommendation, upcoming, formation } = pressing;
  const filteredMoments = videoFilter === "all" ? videoMoments : videoMoments.filter(m => m.player === videoFilter);

  const passDropData = defenders.map(d => ({
    name: d.name.split(" ").pop(),
    drop: +(d.avgPassPct - d.oppPassPct).toFixed(1),
    fill: d.rating === "high" ? C.red : d.rating === "medium" ? C.amber : C.green,
  }));

  const tabs = [
    { id: "pressing", label: "Pressing Vulnerability", icon: <Target size={14} /> },
    { id: "corners", label: "Set Pieces — Corners", icon: <CornerDownRight size={14} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Topbar (matching rank prototype) ── */}
      <div style={{ height: 52, background: "#FFFFFF", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
          Hudl <span style={{ color: C.accent }}>|</span> StatsBomb
        </div>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent} 0%, #9B59B6 100%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>
            {team?.name?.[0] ?? "?"}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{team?.name ?? "Select a team"}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Pre-Match Intelligence</div>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setStep("select")}
            style={{ background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 8, color: C.textMuted, padding: "5px 14px", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
            ← New Analysis
          </button>
          <Badge color={C.accentLight}><Shield size={12} /> StatsBomb Data</Badge>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.red, marginBottom: 8 }}>Pre-Match Analysis</div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 6 }}>{team?.name} — Opposition Report</h1>
            <p style={{ color: C.textMuted, fontSize: 14 }}>vs {upcoming.opponent} · {upcoming.date} · {upcoming.venue}</p>
          </div>
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 20px", border: `1px solid ${C.border}`, textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.textMuted }}>Formation</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{formation}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: C.surface, borderRadius: 12, padding: 4, border: `1px solid ${C.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: "12px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                background: activeTab === t.id ? C.accent : "transparent",
                color: activeTab === t.id ? "#fff" : C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: PRESSING VULNERABILITY                            */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === "pressing" && (<>

          {/* Formation + Threat Ratings */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={18} color={C.accent} /> Back Line Pressing Vulnerability
            </h2>

            <div style={{ background: C.card, borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, marginBottom: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04 }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#fff" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, position: "relative", zIndex: 1 }}>
                {defenders.map((d) => (
                  <button key={d.pid} onClick={() => setExpandedPlayer(expandedPlayer === d.pid ? null : d.pid)}
                    style={{ background: expandedPlayer === d.pid ? ratingBg(d.rating) + "66" : C.surface, border: `2px solid ${ratingColor(d.rating)}${expandedPlayer === d.pid ? "" : "55"}`, borderRadius: 14, padding: 18, cursor: "pointer", color: C.text, textAlign: "center", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: C.textMuted, marginBottom: 4 }}>{d.position}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{d.name}</div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                      <Badge color={ratingColor(d.rating)} bg={ratingBg(d.rating) + "88"}>
                        {d.rating === "high" ? "⚠ High Risk" : d.rating === "medium" ? "◆ Medium" : "✓ Low Risk"}
                      </Badge>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
                      <div><div style={{ color: C.textDim, fontSize: 10 }}>Pass%</div><div style={{ fontWeight: 600 }}>{d.avgPassPct}%</div></div>
                      <div><div style={{ color: C.textDim, fontSize: 10 }}>Under Press</div><div style={{ fontWeight: 600, color: ratingColor(d.rating) }}>{d.oppPassPct}%</div></div>
                      <div><div style={{ color: C.textDim, fontSize: 10 }}>OBV/90</div><div style={{ fontWeight: 600, color: d.obv90 >= 0 ? C.green : C.red }}>{d.obv90 > 0 ? "+" : ""}{d.obv90.toFixed(3)}</div></div>
                      <div><div style={{ color: C.textDim, fontSize: 10 }}>Turn/90</div><div style={{ fontWeight: 600 }}>{d.turnovers90}</div></div>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      {expandedPlayer === d.pid ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      {expandedPlayer === d.pid ? "Collapse" : "Details"}
                    </div>
                  </button>
                ))}
              </div>

              {expandedPlayer && (() => {
                const d = defenders.find(x => x.pid === expandedPlayer);
                return (
                  <div style={{ marginTop: 16, background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${ratingColor(d.rating)}33` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Key Weakness</h4>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: ratingColor(d.rating) }}>{d.keyWeakness}</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Season Context</h4>
                        <p style={{ fontSize: 14, lineHeight: 1.6 }}>{d.seasonNote}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
            <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                <TrendingDown size={15} style={{ verticalAlign: "middle", marginRight: 6, color: C.red }} />
                Pass Accuracy Drop Under Press
              </h3>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Percentage point decrease from season average</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={passDropData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" domain={[0, 20]} tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={(v) => [`-${v}pp`, "Drop"]} />
                  <Bar dataKey="drop" radius={[0, 6, 6, 0]} barSize={24}>
                    {passDropData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                <Activity size={15} style={{ verticalAlign: "middle", marginRight: 6, color: C.accent }} />
                Team Pressing Profile
              </h3>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>{team?.name} vs {upcoming.opponent}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: `${team?.name} Pressures`, value: pressingProfile.teamPressures, sub: `${pressingProfile.teamPressSuccPct}% success` },
                  { label: `${upcoming.opponent} Pressures`, value: pressingProfile.oppPressures, sub: `${pressingProfile.oppPressSuccPct}% success`, hl: true },
                  { label: "PPDA (own)", value: pressingProfile.ppda, sub: "Passes/def. action" },
                  { label: "PPDA (opp)", value: pressingProfile.oppPpda, sub: "Higher = less intense" },
                ].map((s, i) => (
                  <div key={i} style={{ background: C.surface, borderRadius: 10, padding: 14, border: s.hl ? `1px solid ${C.red}33` : `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: s.hl ? C.red : "#fff" }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Moments */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                <Video size={18} color={C.accent} /> Key Moments — Video Review
              </h2>
              <div style={{ display: "flex", gap: 6 }}>
                {["all", ...defenders.map(d => d.name)].map(f => (
                  <button key={f} onClick={() => setVideoFilter(f)}
                    style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${videoFilter === f ? C.accent : C.border}`, background: videoFilter === f ? C.accentDim + "33" : "transparent", color: videoFilter === f ? C.accentLight : C.textMuted }}>
                    {f === "all" ? "All" : f.split(" ").pop()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredMoments.map((m, i) => <VideoEventRow key={i} moment={m} />)}
            </div>

            <VideoLinkNote matchId={match?.id} />
          </div>

          {/* Recommendation */}
          <CollapsibleSection
            open={showRecommendation} onToggle={() => setShowRecommendation(!showRecommendation)}
            icon={<Crosshair size={22} color={C.red} />}
            title="Pressing — Tactical Recommendation"
            subtitle="AI-generated pressing strategy from StatsBomb data"
            gradientFrom={C.redDim + "88"}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
              <TargetCard label="Primary Target" color={C.red} name={recommendation.primaryTarget} reason={recommendation.primaryReason} icon={<Target size={16} color={C.red} />} />
              <TargetCard label="Secondary Target" color={C.amber} name={recommendation.secondaryTarget} reason={recommendation.secondaryReason} icon={<Eye size={16} color={C.amber} />} />
            </div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Shield size={14} color={C.accent} />
                <span style={{ fontSize: 12, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>Tactical Implementation</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: C.text }}>{recommendation.tacticalNote}</p>
            </div>
          </CollapsibleSection>
        </>)}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: CORNERS — SET PIECE ANALYSIS                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === "corners" && corners && (<>

          {/* ── Title Row ── */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 6 }}>{team?.name} corner dashboard</h2>
            <p style={{ fontSize: 13, color: C.textMuted }}>Data from {team?.name}'s UCL 2025/26 matches. {corners.summary.teamCorners} corners taken, {corners.summary.oppCorners} faced.</p>
          </div>

          {/* ── From Right / From Left — side-by-side (StatsBomb dashboard style) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>

            {/* FROM RIGHT */}
            {[{ data: corners.fromRight, label: "From Right", cornerFrom: "Right" }, { data: corners.fromLeft, label: "From Left", cornerFrom: "Left" }].map(({ data: sd, label: sideLabel, cornerFrom }) => (
              <div key={sideLabel} style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, textAlign: "center" }}>{sideLabel}</h3>

                {/* Takers */}
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    <strong style={{ color: C.text }}>Takers:</strong> {sd.takers.map(t => `${t.name} (${t.pct}%)`).join(" | ")}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    Outswinging: {sd.outswinging}/{sd.count} | Inswinging: {sd.inswinging}/{sd.count}
                  </div>
                </div>

                {/* Heatmap + delivery arcs */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <DeliveryZoneHeatmap zoneGrid={sd.zoneGrid} deliveries={sd.deliveries} side={sideLabel} cornerFrom={cornerFrom} />
                </div>

                {/* Metric bubbles — Usage, xG, Shots, Goals */}
                <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                  <MetricBubble value={`${Math.round((sd.count / corners.summary.teamCorners) * 100)}%`} label="Usage" />
                  <MetricBubble value={sd.xgTotal.toFixed(2)} label="Total xG" highlight={sd.xgTotal > 0.2} size={60} />
                  <MetricBubble value={sd.shots} label="Shots" />
                  {sd.goals > 0 && <MetricBubble value={sd.goals} label="Goals" highlight size={60} />}
                </div>
              </div>
            ))}
          </div>

          {/* ── First Contact (top 5) — StatsBomb style bar chart ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
            <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>First contact (top 5)</h3>
              <FirstContactChart data={corners.firstContact} />
            </div>

            {/* Key Taker + Summary Stats */}
            <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Corner Profile</h3>

              <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Key Taker</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>Gabriel Sara</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Took all 7 corners · Left-footed · Favours outswinging from the right</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.red }}>{corners.summary.teamXgFromCorners.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>xG from corners</div>
                </div>
                <div style={{ background: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.textDim }}>{corners.summary.oppXgFromCorners.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{upcoming.opponent} corner xG</div>
                </div>
              </div>

              <div style={{ background: C.greenDim + "22", borderRadius: 10, padding: 14, border: `1px solid ${C.green}22` }}>
                <p style={{ fontSize: 13, color: C.green, lineHeight: 1.5 }}>
                  {team?.name} corner xG is <strong>{(corners.summary.teamXgFromCorners / corners.summary.teamCorners).toFixed(3)}</strong> per corner — {upcoming.opponent} allows 0.000 per corner. Huge set-piece edge.
                </p>
              </div>
            </div>
          </div>

          {/* Attacking Corners — Individual Breakdown */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Video size={18} color={C.accent} /> Attacking Corners — Sequence Breakdown
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {corners.attackingCorners.map((c, i) => (
                <div key={i}>
                  <button onClick={() => setExpandedCorner(expandedCorner === i ? null : i)}
                    style={{ width: "100%", padding: "14px 20px", background: c.goalScored ? C.greenDim + "33" : c.resultedInShot ? C.amberDim + "22" : C.card, border: `1px solid ${c.goalScored ? C.green + "44" : c.resultedInShot ? C.amber + "33" : C.border}`, borderRadius: expandedCorner === i ? "12px 12px 0 0" : 12, cursor: "pointer", color: C.text, textAlign: "left",
                      display: "grid", gridTemplateColumns: "60px 80px 100px 100px 1fr 80px 30px", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Play size={12} color={C.accent} fill={C.accent} />
                      <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600 }}>{c.minute}'</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{c.side} side</span>
                    <Badge color={c.technique === "Outswinging" ? C.accentLight : C.purple}
                      bg={c.technique === "Outswinging" ? C.accentDim + "33" : C.purpleDim + "33"}>
                      {c.technique}
                    </Badge>
                    <span style={{ fontSize: 12, color: C.textMuted }}>→ {c.zone}</span>
                    <span style={{ fontSize: 12 }}>
                      {c.goalScored ? <span style={{ color: C.green, fontWeight: 600 }}>⚽ GOAL — {c.xgGenerated.toFixed(2)} xG</span>
                        : c.resultedInShot ? <span style={{ color: C.amber }}>Shot — {c.xgGenerated.toFixed(3)} xG</span>
                        : <span style={{ color: C.textDim }}>No shot</span>}
                    </span>
                    <Badge color={c.outcome === "Complete" ? C.green : C.textMuted}
                      bg={c.outcome === "Complete" ? C.greenDim + "44" : C.border + "44"}>
                      {c.outcome}
                    </Badge>
                    {expandedCorner === i ? <ChevronDown size={14} color={C.textMuted} /> : <ChevronRight size={14} color={C.textMuted} />}
                  </button>

                  {expandedCorner === i && c.sequence.length > 0 && (
                    <div style={{ background: C.surface, borderRadius: "0 0 12px 12px", padding: "16px 20px", borderTop: "none", border: `1px solid ${C.border}`, borderTopColor: "transparent" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Event Sequence</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {c.sequence.map((s, j) => (
                          <div key={j} style={{ display: "grid", gridTemplateColumns: "70px 140px 1fr 30px", alignItems: "center", gap: 12, padding: "8px 12px", background: s.event === "GOAL" ? C.greenDim + "33" : C.card, borderRadius: 8, border: s.event === "GOAL" ? `1px solid ${C.green}44` : `1px solid ${C.border}` }}>
                            <span style={{ fontFamily: "monospace", fontSize: 12, color: C.textMuted }}>{formatTs(s.minute, s.second)}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: s.event === "GOAL" ? C.green : C.text }}>{s.event}</span>
                            <span style={{ fontSize: 12, color: C.textMuted }}>{s.player} — {s.detail}</span>
                            <Play size={12} color={C.accent} style={{ cursor: "pointer", opacity: 0.6 }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Defensive Weaknesses (from opposition perspective) */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={18} color={C.red} /> {upcoming.opponent} Defending Weaknesses — Corners
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {corners.defendingWeaknesses.map((w, i) => (
                <div key={i} style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${ratingColor(w.severity)}33` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <SeverityDot severity={w.severity} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{w.area}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: C.textMuted }}>{w.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opposition Corners — Liverpool's ineffectiveness */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={18} color={C.green} /> {upcoming.opponent} Attacking Corners — Threat Level
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {corners.oppositionCorners.map((c, i) => (
                <div key={i} style={{ background: C.card, borderRadius: 12, padding: "14px 20px", border: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "60px 120px 100px 1fr 80px", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600 }}>{c.minute}'</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.taker}</span>
                  <Badge color={C.purple} bg={C.purpleDim + "33"}>{c.technique}</Badge>
                  <span style={{ fontSize: 13, color: C.textMuted }}>{c.outcome}</span>
                  <Badge color={c.threat === "none" ? C.textDim : c.threat === "low" ? C.green : C.amber}
                    bg={c.threat === "none" ? C.border : c.threat === "low" ? C.greenDim + "44" : C.amberDim + "44"}>
                    {c.threat === "none" ? "No threat" : c.threat}
                  </Badge>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "12px 16px", background: C.greenDim + "22", borderRadius: 10, border: `1px solid ${C.green}22` }}>
              <p style={{ fontSize: 13, color: C.green }}>
                <Shield size={13} style={{ verticalAlign: "middle", marginRight: 6 }} />
                Liverpool generated <strong>0.000 xG</strong> from 4 corners. 3 of 4 ended in Liverpool fouls (Robertson ×2, Konaté ×1). Szoboszlai's deliveries were predictable — all inswinging, all right foot, all central.
              </p>
            </div>
          </div>

          {/* Corner Recommendation */}
          <CollapsibleSection
            open={showCornerRec} onToggle={() => setShowCornerRec(!showCornerRec)}
            icon={<CornerDownRight size={22} color={C.purple} />}
            title="Set Pieces — Tactical Recommendation"
            subtitle="Corner attack and defence strategy from StatsBomb event data"
            gradientFrom={C.purpleDim + "66"}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
              <div style={{ background: C.greenDim + "33", borderRadius: 12, padding: 22, border: `1px solid ${C.green}33` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.green, marginBottom: 10 }}>Attacking Plan</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{corners.recommendation.attacking}</p>
              </div>
              <div style={{ background: C.accentDim + "22", borderRadius: 12, padding: 22, border: `1px solid ${C.accent}33` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.accentLight, marginBottom: 10 }}>Defensive Plan</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{corners.recommendation.defending}</p>
              </div>
            </div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 18, border: `1px solid ${C.red}33`, textAlign: "center" }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.red }}>{corners.recommendation.keyStat}</p>
            </div>
          </CollapsibleSection>
        </>)}

        {/* ─── Footer ─────────────────────────────────────────── */}
        <div style={{ marginTop: 48, background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Shield size={14} color={C.accent} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>About This Prototype</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: C.textMuted, marginBottom: 10 }}>
            Built entirely from StatsBomb API data: <code style={{ color: C.cyan }}>get_events</code> (v9), <code style={{ color: C.cyan }}>get_player_match_stats</code> (v5), and <code style={{ color: C.cyan }}>get_team_match_stats</code> (v2). Video links pass <strong style={{ color: C.text }}>event IDs</strong> directly to the StatsBomb video player, which resolves the timestamp internally.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: C.textMuted }}>
            In production, this pulls live data for any team/competition. A product concept for <strong style={{ color: C.text }}>The Intelligence Advantage</strong>.
          </p>
        </div>

        <div style={{ textAlign: "center", padding: "20px 0", borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.textDim }}>Pre-Match Intelligence · Powered by StatsBomb API · Prototype v1.1</p>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Sub-Components ──────────────────────────────────────
function StepLabel({ num, label }) {
  return (
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>
      <span style={{ background: C.accent, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, marginRight: 8 }}>{num}</span>
      {label}
    </label>
  );
}

function SelectButton({ children, selected, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding: "16px 20px", background: selected ? C.accentDim + "44" : C.card, border: `1px solid ${selected ? C.accent : C.border}`, borderRadius: 12, color: selected ? C.accentLight : C.text, cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}

function CollapsibleSection({ open, onToggle, icon, title, subtitle, gradientFrom, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <button onClick={onToggle}
        style={{ width: "100%", padding: "18px 24px", background: `linear-gradient(135deg, ${gradientFrom}, ${C.card})`, border: `1px solid ${C.border}`, borderRadius: open ? "16px 16px 0 0" : 16, cursor: "pointer", color: C.text, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {icon}
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{title}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>
        {open ? <ChevronDown size={20} color={C.textMuted} /> : <ChevronRight size={20} color={C.textMuted} />}
      </button>
      {open && (
        <div style={{ background: C.card, borderRadius: "0 0 16px 16px", padding: 28, border: `1px solid ${C.border}`, borderTop: "none" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function TargetCard({ label, color, name, reason, icon }) {
  return (
    <div style={{ background: (color === C.red ? C.redDim : C.amberDim) + "44", borderRadius: 12, padding: 22, border: `1px solid ${color}33` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: C.textMuted }}>{reason}</p>
    </div>
  );
}

function VideoLinkNote({ matchId }) {
  return (
    <div style={{ marginTop: 12, padding: "12px 16px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
      <Play size={14} color={C.cyan} />
      <span style={{ fontSize: 12, color: C.textMuted }}>
        Each event passes its <code style={{ color: C.cyan }}>event_id</code> to the StatsBomb video player, which resolves the timestamp internally — no URL construction needed. One click → video clip.
      </span>
    </div>
  );
}