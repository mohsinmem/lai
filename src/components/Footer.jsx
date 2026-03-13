import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top grid-12">
          <div className="footer-brand">
            <Link to="/" className="f-logo">LAI</Link>
            <p>The Leadership Adaptiveness Institute is a global research body dedicated to establishing standards for organizational response to change.</p>
            <div className="social-links">
              <a href="#"><Linkedin size={20} /></a>
              <a href="#"><Twitter size={20} /></a>
              <a href="#"><Mail size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Institute</h4>
            <ul>
              <li><Link to="/manifesto">Manifesto</Link></li>
              <li><Link to="/framework">The Framework</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/research">Research Library</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Measurement</h4>
            <ul>
              <li><Link to="/diagnostic">Diagnostic Assessment</Link></li>
              <li><Link to="/global-index">Global Index</Link></li>
              <li><Link to="/benchmark">Submit Benchmark</Link></li>
              <li><Link to="/simulation">Simulation Engine</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Data Ethics</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Leadership Adaptiveness Institute. All rights reserved.</p>
          <div className="footer-meta">
            <span><Globe size={14} /> Global Secretariat: Geneva / New York</span>
            <span style={{ marginLeft: '1.5rem', fontFamily: 'monospace', fontSize: '0.72rem', color: '#94a3b8' }}>LAI v1.2.0-FINAL</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #f8fafc;
          padding: 6rem 0 2rem;
          border-top: 1px solid var(--border-color);
          color: var(--navy);
        }

        .footer-brand { grid-column: span 4; }
        .footer-links { grid-column: span 2; }

        .f-logo {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 1.5rem;
          display: block;
        }

        .footer-brand p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 300px;
        }

        .social-links { display: flex; gap: 1.25rem; color: var(--slate); }
        .social-links a:hover { color: var(--teal); }

        .footer-links h4 {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 2rem;
          color: var(--slate-light);
        }

        .footer-links ul { display: flex; flex-direction: column; gap: 1rem; }
        .footer-links a {
          color: var(--navy);
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .footer-links a:hover { color: var(--teal); }

        .footer-bottom {
          margin-top: 5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--slate-light);
        }

        .footer-meta { display: flex; align-items: center; gap: 0.5rem; }

        @media (max-width: 992px) {
          .footer-brand, .footer-links { grid-column: span 6; margin-bottom: 3rem; }
          .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
