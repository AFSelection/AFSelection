import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fetchSiteSetting, DEFAULT_STAGGERED_SHOWCASE } from '../services/storage';

export default function StaggeredShowcaseSection({ onOpenCatalog }) {
  const [content, setContent] = useState(DEFAULT_STAGGERED_SHOWCASE);

  useEffect(() => {
    fetchSiteSetting('staggered_showcase', DEFAULT_STAGGERED_SHOWCASE).then((res) => {
      if (res && res.title) {
        setContent(res);
      }
    });
  }, []);

  const cards = content.cards || DEFAULT_STAGGERED_SHOWCASE.cards;
  const offsets = ['0px', '36px', '72px'];

  return (
    <section className="staggered-section">
      <div className="staggered-grid">
        {/* Left Editorial Content */}
        <div className="staggered-left">
          <h2 className="staggered-title">
            {content.title || DEFAULT_STAGGERED_SHOWCASE.title}
          </h2>

          <p className="staggered-desc">
            {content.description || DEFAULT_STAGGERED_SHOWCASE.description}
          </p>

          <button className="btn-pill btn-pill-dark" onClick={onOpenCatalog} style={{ padding: '14px 28px', fontSize: '0.9rem' }}>
            <span>{content.buttonText || DEFAULT_STAGGERED_SHOWCASE.buttonText}</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Right Staggered Offset Image Cards */}
        <div className="staggered-images-row">
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className={`staggered-card ${idx === 0 ? 'card-tall' : idx === 1 ? 'card-medium' : 'card-short'}`}
              style={{ marginTop: offsets[idx % offsets.length] }}
            >
              <img
                src={card.image || DEFAULT_STAGGERED_SHOWCASE.cards[idx]?.image}
                alt={card.title}
              />
              <div className="staggered-card-overlay">
                <h4>{card.title}</h4>
                <p>{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
