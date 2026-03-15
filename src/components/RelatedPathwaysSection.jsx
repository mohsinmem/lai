import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PAGE_REGISTRY } from '../constants/pageRegistry';

const RelatedPathwaysSection = ({ relatedPaths = [], eyebrow = "Continue Exploring", title = "Further Insight" }) => {
  if (!relatedPaths || relatedPaths.length === 0) return null;

  return (
    <section className="related-pathways">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>

        <div className="pathway-grid">
          {relatedPaths.map(path => {
            const page = PAGE_REGISTRY[path];
            if (!page) return null;

            return (
              <Link key={path} to={path} className="pathway-card">
                <h3>{page.title}</h3>
                <p>{page.desc}</p>
                <div className="card-link">
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .related-pathways {
          padding: 8rem 0;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .section-header {
          margin-bottom: 4rem;
        }

        .eyebrow {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #0d9488;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0a192f;
        }

        .pathway-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .pathway-card {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .pathway-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          border-color: #0d9488;
        }

        .pathway-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0a192f;
          margin-bottom: 1rem;
        }

        .pathway-card p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex-grow: 1;
        }

        .card-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.85rem;
          color: #0d9488;
        }

        @media (max-width: 768px) {
          .section-header h2 { font-size: 2rem; }
          .pathway-card { padding: 2rem; }
        }
      `}</style>
    </section>
  );
};

export default RelatedPathwaysSection;
