import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ManifestoPage from './pages/ManifestoPage';
import FrameworkPage from './pages/FrameworkPage';
import GlobalIndexPage from './pages/GlobalIndexPage';
import DiagnosticPage from './pages/DiagnosticPage';
import AboutPage from './pages/AboutPage';
import ResearchPage from './pages/ResearchPage';
import ResearchDashboard from './pages/ResearchDashboard';
import AdminMappingPage from './pages/AdminMappingPage';
import DevStatus from './pages/DevStatus';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/manifesto" element={<ManifestoPage />} />
            <Route path="/framework" element={<FrameworkPage />} />
            <Route path="/global-index" element={<GlobalIndexPage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/admin" element={<ResearchDashboard />} />
            <Route path="/admin/mapping" element={<AdminMappingPage />} />
            <Route path="/status" element={<DevStatus />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
