import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Gallery from './Gallery'
import PreMatchAnalysis from './prototypes/pre-match-analysis'

// ─── Add new prototypes here ─────────────────────────────────────
// import RecruitmentRadar from './prototypes/recruitment-radar'
// import MatchMomentum from './prototypes/match-momentum'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/pre-match-analysis" element={<PreMatchAnalysis />} />
        {/* Add new routes here */}
        {/* <Route path="/recruitment-radar" element={<RecruitmentRadar />} /> */}
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
