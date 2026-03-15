# Institutional Language Alignment (v1.2.0)

This plan outlines the steps to perform a complete audit and alignment of the LAI codebase with the finalized institutional terminology.

## Proposed Changes

### [Unified Language Audit - Key Findings]

| File | Context | Actions |
| :--- | :--- | :--- |
| [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx) | Tooltips & Headers | Standardize on "LAI Score (Adaptive Capacity)" and update dimension tooltips. |
| [FrameworkPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/FrameworkPage.jsx) | Dimension blocks & Loop | Rename Dimension 3 to "Resource Calibration", Dimension 5 to "Integrated Responsiveness". Update loop step labels. |
| [DiagnosticPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/DiagnosticPage.jsx) | Dimension Titles & results | Update titles in `dimensions` array. Update results summary logic. |
| [HomePage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/HomePage.jsx) | Framework Preview & Gap | Update dimension descriptions. Refine "Adaptiveness Gap" visual (Perception vs Behavior). |
| [ResearchPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/ResearchPage.jsx) | Logic Headers & Weights | Change "Adaptiveness Velocity" label to "LAI Score". Align 5 Dimension cards. |
| [AdminIntel.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/AdminIntel.jsx) | Internal Keys & Labels | Update `DIMENSIONS` array labels (Detection, Calibration, Responsiveness). |
| [api.js](file:///c:/Users/mmemo/Downloads/LAI/netlify/functions/api.js) | Summary strings | Update `/api/research/live` summaries and `/api/resources` template data. |
| [notebooklm-synthesis.js](file:///c:/Users/mmemo/Downloads/LAI/netlify/functions/notebooklm-synthesis.js) | Prompt Engineering | Ensure dimensionality and scoring logic in templates follows v1.2.0. |

## Detailed Updates

### 1. Framework Definitions Alignment
- **Signal Detection**: Identifying emerging shifts (Recognition Speed, Signal Sensitivity, etc.).
- **Cognitive Framing**: Interpretation of uncertainty (Threat vs Opportunity Orientation).
- **Decision Alignment**: strategic consistency and experimentation bias.
- **Resource Calibration**: Speed of redirecting capital and talent.
- **Integrated Responsiveness**: Operationalizing adjustments and learning integration.

### 2. The Adaptiveness Gap Transition
- Explicitly label the gap as the discrepancy between **Perceived Adaptiveness** (Assessment) and **Behavioral Adaptiveness** (Simulation).

### 3. AFERR Mapping
- Update all documentation (readme.html, etc.) to refer to AFERR as the "Cognitive–Behavioral Translation Layer".

## Terminology Mapping Table

| Old Term | New Institutional Term |
| :--- | :--- |
| AFERR Velocity | LAI Score |
| AFERR Score | LAI Score |
| Signal Interpretation | Signal Detection |
| Emotional Framing | Cognitive Framing |
| Resource Reallocation | Resource Calibration |
| Decision Alignment | Decision Alignment (Unchanged) |
| Execution Responsiveness | Integrated Responsiveness |
| Evolutionary State | Data Fidelity / Meta Status |
| Tribe | Organization / Entity |
  
### [UI Grid Optimization]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **Badge Normalization**: Standardize "TRIANGULATED" and "INSIGHT ALERT" pills (padding, height, centering).
- **Grid Realignment**: Adjust `gridTemplateColumns` to reduce the spatial gap between Score and Trend.

### [Framework Page Redesign]

#### [MODIFY] [FrameworkPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/FrameworkPage.jsx)
- **Hero Section**: Implement the new institutional copy and a high-impact download CTA.
- **Sectioned Architecture**: 
  - **Section 1: The Illusion**: Define the "Adaptiveness Gap".
  - **Section 2: The LAI Paradigm**: Contrast traditional models with behavioral systems.
  - **Section 3: The Five Dimensions**: Detail each dimension with its specific metrics.
  - **Section 4: The Loop**: Implement the continuous feedback loop visual.
  - **Section 5: Measurement**: Detail the three measurement pathways (Research, Assessment, Simulation).
  - **Section 6/7**: Gap Insight and Institutional Objective.
- **Premium Aesthetics**: Use sleek typography, micro-interactions, and a cohesive "Institutional" color palette (Navys, Teals, Slates).

### [Scroll Restoration]

#### [NEW] [ScrollToTop.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/components/ScrollToTop.jsx)
- Implement a functional component that uses `useLocation` from `react-router-dom`.
- Call `window.scrollTo(0, 0)` in a `useEffect` on every pathname change.

### [LAI Measurement Architecture Implementation]

#### [NEW] [LAIMeasurementPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/LAIMeasurementPage.jsx)
- Build a comprehensive, 7-section deep-dive into the LAI scoring model.
- Detail the Reliability Hierarchy (Tier 1-4) and signal weighting logic.
- Integrate "Triangulated Truth" fidelity indicators.

#### [MODIFY] [App.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/App.jsx)
- Register the `/measurement` route.

#### [MODIFY] [AFERRPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/AFERRPage.jsx)
- Finalize top-right watermark at 55% width and 0.25 opacity for zero text overlap.

### [Global Index Premium Refinement]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **Accessible Score Bars**:
  - Implement a fixed 0-100 gradient (Red -> Orange -> Green) revealed by the score's width.
  - Apply a repeating-linear-gradient "texture" overlay to the filled portion for color blind accessibility.
  - Dynamically calculate the score text color to match the exact point of the gradient where the bar stops.
- **Leaderboard Readability Overhaul**:
  - Increase row padding and spacing for architectural "breathing" space (`1.75rem 2.5rem`).
  - Standardize high-fidelity typography (Georgia/Serif for institutions and numbers).
  - Refine Truth Fidelity badges with a high-contrast, premium color palette.

### [Adaptiveness Tier System]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **4-Tier Classification**: Update [getEvolutionaryState](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx#19-26) to support:
  - 80–100: Antifragile (Deep Green)
  - 65–79: Adaptive (Blue)
  - 50–64: Emergent (Amber)
  - 0–49: Fragile (Red)
- **Tier Badges**: Add a dynamically colored badge next to the LAI Score in the table.
- **Expanded View**: Display the tier classification under "Market Position" in the institution details.

### [Truth Fidelity Transparency Overhaul]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **Fidelity Tooltips**: Implement hover-triggered tooltips for:
  - **TRIANGULATED (Blue)**: "Triangulated scores are validated across behavioral, perceptual, and research data sources and represent the highest fidelity measurement."
  - **INFERRED (Gray)**: "This score is inferred from external intelligence signals such as market behavior, industry events, and institutional actions."
  - **INSIGHT ALERT (Amber)**: "Leadership perception of adaptiveness significantly exceeds behavioral indicators. This may indicate strategic dissonance."
- **Badge Refinement**: Add a small `Info` icon next to each badge and standardize the color scheme (Blue, Gray, Amber).
- **Goal**: Improve methodology transparency and trust in the displayed data.

### [Refine Visual Authority & Institutional Hierarchy]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **Score Bar Prominence**: Lengthen the [ScoreBar](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx#106-133) component by ~50px to better represent magnitude.
- **Rank Hierarchy**: Darken rank numbers to a dominant slate tone, increase weight to 900, and slightly increase font size.
- **Leader Highlighting**: Add a subtle emerald left-border and light tinted background to the rank 01 row.
- **Shift Indicators**: Add `ArrowUp` and `ArrowDown` icons next to the cognitive shift percentages.
- **Header SEMANTICS**: 
  - Rename "LAI Score (Adaptive Capacity)" to "LAI SCORE (Adaptiveness Index)".
  - Make "LAI SCORE" header visually dominant with increased font weight.
- **Micro-Spacing**: Increase vertical gap between institution name and sector by ~4px.
- **Fidelity Alignment**: Tighten the Fidelity column horizontal grouping for better scanning.

### [Institutional Intelligence Overhaul]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **Global Summary Panel**:
  - Implement a glassmorphic headline panel above the leaderboard.
  - Metrics: Average LAI Score, Tier Distribution (Antifragile, Adaptive, Emergent, Fragile).
  - Authority Metrics: "Signals Processed Today", "Last Update" (relative time).
- **Live Intelligence System**:
  - Add a subtle green pulse dot with "● LIVE" indicator.
  - Branding: "Powered by Orion Scout Intelligence Network".
- **Institution Analytics (Row Level)**:
  - **Signal Confidence**: Dynamic percentage reflecting data density and diversity.
  - **Signal Velocity**: High/Med/Low indicator of environmental change rate.
- **Reliability Hierarchy (Expanded View)**:
  - Explicit Tier 0-3 labeling with multipliers (1.2x, 1.0x, 0.8x, 0.4x).
  - Descriptive narratives for each data source (Sovereign -> Behavioral -> Perceptual -> Environmental).
- **Interpretative Framework**:
  - Detailed hover tooltips for all 5 behavioral dimensions using refined IMF-style definitions.
  - Semantic inline scores (e.g., "79") positioned closer to dimension bars.

### [Premium Institutional Refinement]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **Rank Authority**: Set rank numbers to 950 weight, use a dominant slate color, and increase size. [DONE]
- **Velocity Visualization**: Add `ArrowUp` and `ArrowDown` specifically for velocity states (Accelerating/Decelerating). [DONE]
- **Grouped Trust Metrics**: Move "Signal Confidence" into a vertical stack with the Trust Layer badge. [DONE]
- **Institutional Turbulence**: Add "Signal Activity" (Turbulence/Volume) to every row. [DONE]
- **Architectural Spacing**: Add `gap: 10px` to organization blocks; Implement 8px grid rhythm. [DONE]
- **Data Education**: Implement "Confidence" and "Activity" tooltips. [DONE]
- **Monospaced Numerics**: Apply `font-variant-numeric: tabular-nums` to scores and ranks. [DONE]
- **Summary Alignment**: Standalone context headline between header and table. [DONE]
- **Surface Elevation**: Subtle row elevation and hover transitions (Stripe/Linear style). [DONE]

### [Institutional Alignment Synchronization]

#### [MODIFY] [GlobalIndexPage.jsx](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx)
- **Container Harmonization**: 
  - Remove `margin: '0 8px 1px'` from `LeaderboardRow` (which causes horizontal drift).
  - Apply `padding: '0 8px'` to the main table container so both headers and rows share the same boundary.
- **Grid Sync**: 
  - Standardize `gridTemplateColumns` across Header and Row to prevent `fr` unit divergence.
  - New suggested weights: `80px minmax(200px, 1fr) minmax(380px, 1.2fr) 160px 240px`.
- **Vertical Alignment**:
  - Remove `transform: scale(1.05)` from the `LAI SCORE` header to prevent visual jitter.
  - Ensure all column content uses `justify-self: start` or standard flex-start.
- **Micro-Refinement**:
  - Adjust [ScoreBar](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx#106-133) and [Badge](file:///c:/Users/mmemo/Downloads/LAI/src/pages/GlobalIndexPage.jsx#177-229) nesting to ensure the first pixel of content perfectly matches the first pixel of the header text. [DONE]
- **Horizontal Intelligence Rebalance**:
  - Increase `SHIFT & VELOCITY` horizontal footprint from `140px` to `200px` for better readability of trend data.
  - Reduce `TRUST LAYER` footprint from `240px` to `160px` by switching to a vertical stack architecture.
  - Synchronize `gridTemplateColumns` to `80px 210px minmax(400px, 1fr) 200px 160px`.
  - Horizontally center the content and headers for both `SHIFT & VELOCITY` and `TRUST LAYER`.
- **Column Repositioning**:
  - Tighten `INSTITUTION` column from `minmax(280px, 1.2fr)` to `260px` to pull `LAI SCORE` to the left.
  - Synchronize `gridTemplateColumns` to `80px 260px minmax(400px, 1fr) 140px 240px`.

- **Living Intelligence Evolution**:
  - Implement an `intelligence_events` stream as the primary realtime sync layer.
  - Establish a **Signal Normalization Layer** to convert raw ingestion (Orion, Evivve) into standardized event objects.
  - Build **Score Attribution** logic to link score updates to specific evidence strings in the UI.

### [Phase 1: The Evidence Foundation]

#### [NEW] [migrations/20260314_living_intelligence.sql](file:///c:/Users/mmemo/Downloads/LAI/supabase/migrations/20260314_living_intelligence.sql)
- **signals_normalized**: Stores standardized evidence nodes from all sources.
- **intelligence_events**: Curated broadcast stream for the frontend.
- **institution_score_history**: Daily snapshots for sparkline rendering.

#### [NEW] [netlify/functions/scoring-worker.js](file:///c:/Users/mmemo/Downloads/LAI/netlify/functions/scoring-worker.js)
- **Deterministic Processor**: Listens to `signals_normalized` additions.
- **Recency Decay**: Applies a time-based multiplier (1.0 -> 0.4) to signals.
- **Event Emitter**: Writes to `intelligence_events` when meaningful score or rank changes occur.
- **Attribution Mapping**: Links `event_id` to `origin_signal_ids`.

#### [MODIFY] [orion-scout-background.js](file:///c:/Users/mmemo/Downloads/LAI/netlify/functions/orion-scout-background.js)
- **Emitter Refactor**: Remove direct `diagnostic_results` and `organizations` updates.
- **Raw to Signal**: Map scraped items to `signals_normalized` entries.

#### [MODIFY] [api.js](file:///c:/Users/mmemo/Downloads/LAI/src/api.js) (Frontend)
- **Realtime Subscription**: Connect to the `intelligence_events` table via Supabase Realtime.
- **Event Handler**: Update Zustand store and trigger "Row Glow" based on event severity.

## Verification Plan

### Manual Verification
- **Visual Weight**: Confirm Ranks and Scores have definitive "Institutional" weight.
- **Trust Hierarchy**: Verify that grouping Confidence with Trust badges improves speed of interpretation.
- **Data Jitter**: Check that scores/ranks don't move when numbers change (using tabular-nums).
- **Educational Layer**: Test all new tooltips for framework-teaching clarity.
