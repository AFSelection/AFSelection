import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fetchSiteSetting, DEFAULT_STAGGERED_SHOWCASE } from '../services/storage';
import { resolveImageUrl } from '../utils/imageUrl';

export default function StaggeredShowcaseSection({ listings = [], onOpenCatalog }) {
  const [content, setContent] = useState(DEFAULT_STAGGERED_SHOWCASE);

  useEffect(() => {
    fetchSiteSetting('staggered_showcase', null).then((res) => {
      if (res && res.title) {
        setContent(res);
      }
    });
  }, []);

  // Compute cards dynamically from active DB listings if custom setting cards aren't defined
  const cards = useMemo(() => {
    if (content.cards && content.cards.length > 0) return content.cards;
    const featured = listings.filter((l) => l.featured) || [];
    const pool = featured.length >= 3 ? featured : listings;
    if (pool.length === 0) return DEFAULT_STAGGERED_SHOWCASE.cards;
    return pool.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || `${item.year ? item.year + ' • ' : ''}${item.location || ''}`,
      image: item.images?.[0] || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
    }));
  }, [content.cards, listings]);

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
                src={resolveImageUrl(card.image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e', { width: 800 })}
                alt={card.title}
                loading="lazy"
                decoding="async"
                draggable={false}
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
