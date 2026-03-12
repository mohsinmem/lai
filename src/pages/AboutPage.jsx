import React from 'react';

const AboutPage = () => (
  <div className="container" style={{ padding: '10rem 0' }}>
    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '2rem' }}>About the Institute</h1>
    <p style={{ fontSize: '1.2rem', color: 'var(--slate)', maxWidth: '800px' }}>
      The Leadership Adaptiveness Institute (LAI) is a global non-profit research body established to study and standardize how organizations respond to continuous disruption.
    </p>
    <div style={{ marginTop: '4rem', padding: '3rem', background: '#f8fafc', borderRadius: '12px' }}>
      <h3>Our Core Pillars</h3>
      <ul style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
        <li>• Evidence-based behavioral research</li>
        <li>• Global benchmarking and transparency</li>
        <li>• Simulation-based capability development</li>
      </ul>
    </div>
  </div>
);

export default AboutPage;
