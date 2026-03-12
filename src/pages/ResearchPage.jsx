import React from 'react';
import { FileText, Download, ArrowRight } from 'lucide-react';

const ResearchPage = () => (
  <div className="container" style={{ padding: '10rem 0' }}>
    <header style={{ marginBottom: '4rem' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '1rem' }}>Research Library</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--slate)' }}>The latest insights into Leadership Adaptiveness and Organizational Resilience.</p>
    </header>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {[
        { title: 'The 2024 Global Adaptiveness Report', date: 'March 2024', category: 'Annual Report' },
        { title: 'Decision Alignment in Decentralized Teams', date: 'Jan 2024', category: 'White Paper' },
        { title: 'Measuring Signal Sensitivity in CEO Decisions', date: 'Dec 2023', category: 'Academic Study' },
      ].map((paper) => (
        <div key={paper.title} style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase' }}>{paper.category}</span>
          <h3 style={{ margin: '1rem 0' }}>{paper.title}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-light)', marginBottom: '1.5rem' }}>Published: {paper.date}</p>
          <button style={{ background: 'none', border: 'none', color: 'var(--navy)', fontWeight: 700, display: 'flex', alignItems: center, gap: '0.5rem', cursor: 'pointer' }}>
            <Download size={16} /> Access Document
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ResearchPage;
