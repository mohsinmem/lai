import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Phase 1: Institutional Authority
import HomePage from './pages/HomePage';
import ManifestoPage from './pages/ManifestoPage';
import FrameworkPage from './pages/FrameworkPage';
import LAIMeasurementPage from './pages/LAIMeasurementPage'; 
import AdaptivenessGapPage from './pages/AdaptivenessGapPage';
import GlobalSignalsPage from './pages/GlobalSignalsPage'; 

// Phase 2: Observatory Layer
import GlobalIndexPage from './pages/GlobalIndexPage';
import ObservatoryPage from './pages/ObservatoryPage';
import CompletenessPage from './pages/CompletenessPage';
// import MethodologyPage from './pages/MethodologyPage'; // [NEW]
// import ResearchFlywheelPage from './pages/ResearchFlywheelPage'; // [NEW]

// Phase 3: Research Layer
import ResearchPage from './pages/ResearchPage'; // Research Library
import AFERRPage from './pages/AFERRPage';
// import BehavioralSciencePage from './pages/BehavioralSciencePage'; // [NEW]
// import SimulationMeasurementPage from './pages/SimulationMeasurementPage'; // [NEW]
// import GlobalCollaborationPage from './pages/GlobalCollaborationPage'; // [NEW]
// import CaseInsightsPage from './pages/CaseInsightsPage'; // [NEW]

// Phase 4: Participation Layer
import DiagnosticPage from './pages/DiagnosticPage';
import BenchmarkPage from './pages/BenchmarkPage';
import Part1Report from './pages/Part1Report';
// import MeasurementJourneyPage from './pages/MeasurementJourneyPage'; // [NEW]

// Phase 5: Institutional Foundation
import AboutPage from './pages/AboutPage';
// import AdvisoryCouncilPage from './pages/AdvisoryCouncilPage'; // [NEW]

// Admin & Dev
import ResearchDashboard from './pages/ResearchDashboard';
import AdminMappingPage from './pages/AdminMappingPage';
import AdminIntel from './pages/AdminIntel';
import DevStatus from './pages/DevStatus';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <Navbar />
        <main>
          <Routes>
            {/* Phase 1: Institutional Authority */}
            <Route path="/" element={<HomePage />} />
            <Route path="/manifesto" element={<ManifestoPage />} />
            <Route path="/gap" element={<AdaptivenessGapPage />} />
            <Route path="/framework" element={<FrameworkPage />} />
            <Route path="/how-measured" element={<LAIMeasurementPage />} />
            <Route path="/signals" element={<GlobalSignalsPage />} />

            {/* Phase 2: Observatory Layer */}
            <Route path="/observatory" element={<ObservatoryPage />} />
            <Route path="/global-index" element={<GlobalIndexPage />} />
            <Route path="/completeness" element={<CompletenessPage />} />
            <Route path="/methodology" element={<div>Measurement Methodology (Coming Soon)</div>} />
            <Route path="/flywheel" element={<div>The LAI Research Flywheel (Coming Soon)</div>} />

            {/* Phase 3: Research Layer */}
            <Route path="/behavioral-science" element={<div>Behavioral Science of Adaptiveness (Coming Soon)</div>} />
            <Route path="/aferr" element={<AFERRPage />} />
            <Route path="/simulation" element={<div>Simulation-Based Measurement (Coming Soon)</div>} />
            <Route path="/collaboration" element={<div>Global Research Collaboration (Coming Soon)</div>} />
            <Route path="/case-insights" element={<div>Case Insights (Coming Soon)</div>} />
            <Route path="/library" element={<ResearchPage />} />

            {/* Phase 4: Participation Layer */}
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/report/perception/:id" element={<Part1Report />} />
            <Route path="/benchmark" element={<BenchmarkPage />} />
            <Route path="/journey" element={<div>Leadership Team Measurement Journey (Coming Soon)</div>} />

            {/* Phase 5: Institutional Foundation */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/council" element={<div>Advisory / Research Council (Coming Soon)</div>} />

            {/* Admin & Legacy */}
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/admin" element={<ResearchDashboard />} />
            <Route path="/admin/mapping" element={<AdminMappingPage />} />
            <Route path="/admin/intel" element={<AdminIntel />} />
            <Route path="/status" element={<DevStatus />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
