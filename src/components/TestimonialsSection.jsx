import React, { useState, useEffect } from 'react';
import { Star, Heart, CheckCircle2 } from 'lucide-react';
import { fetchSiteSetting, DEFAULT_TESTIMONIALS_SECTION } from '../services/storage';

const FALLBACK_TESTIMONIAL_IMAGES = [
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
];

export default function TestimonialsSection() {
  const [content, setContent] = useState(DEFAULT_TESTIMONIALS_SECTION);

  useEffect(() => {
    fetchSiteSetting('testimonials_section', DEFAULT_TESTIMONIALS_SECTION).then((res) => {
      if (res && res.title) {
        setContent(res);
      }
    });
  }, []);

  const reviews = content.reviews || DEFAULT_TESTIMONIALS_SECTION.reviews;
  const offsets = ['card-pos-1', 'card-pos-2', 'card-pos-3'];

  return (
    <section className="light-testimonials-staggered-section">
      <div className="light-staggered-grid">
        {/* Left Column: Editorial Headline & Google Reviews Rating */}
        <div className="light-staggered-left">
          <div className="light-badge-pill">
            <Heart size={14} fill="#EF4444" color="#EF4444" />
            <span>{content.badge || DEFAULT_TESTIMONIALS_SECTION.badge}</span>
          </div>

          <h2 className="light-staggered-title">
            {content.title || DEFAULT_TESTIMONIALS_SECTION.title}
          </h2>

          <p className="light-staggered-desc">
            {content.description || DEFAULT_TESTIMONIALS_SECTION.description}
          </p>

          <div className="light-rating-badge-row">
            <div className="light-score-pill">
              <span className="score-number">{content.rating || '5.0'}</span>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="source-label">Google Reviews</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Staggered Cards */}
        <div className="light-staggered-cards-row">
          {reviews.map((rev, idx) => {
            const fallbackImg = FALLBACK_TESTIMONIAL_IMAGES[idx % FALLBACK_TESTIMONIAL_IMAGES.length];
            const imgSrc = (rev.image && rev.image.trim()) ? rev.image.trim() : fallbackImg;

            return (
              <div key={rev.id || idx} className={`light-testimonial-card ${rev.offsetClass || offsets[idx % offsets.length]}`}>
                {/* Photo Header */}
                <div className="testimonial-img-wrapper">
                  <img
                    src={imgSrc}
                    alt={rev.author || 'Cliente AF Select'}
                    className="testimonial-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImg;
                    }}
                  />
                  <div className="testimonial-img-overlay" />
                  <span className="testimonial-tag-pill">{rev.tag}</span>
                  <div className="testimonial-verified-badge">
                    <CheckCircle2 size={13} fill="#10B981" color="#FFF" />
                    <span>{rev.date}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="testimonial-card-body">
                  <div className="card-rating-line">
                    <div className="mini-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <span className="mini-score">{rev.rating || '5.0'} / 5.0</span>
                  </div>

                  <p className="card-quote-text">
                    "{rev.quote}"
                  </p>

                  <div className="card-author-row">
                    <div>
                      <h4 className="card-author-name">{rev.author}</h4>
                      <span className="card-author-loc">{rev.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
