import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Star, Heart, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { fetchSiteSetting, DEFAULT_TESTIMONIALS_SECTION } from '../services/storage';

export default function TestimonialsSection() {
  const [content, setContent] = useState(DEFAULT_TESTIMONIALS_SECTION);

  useEffect(() => {
    fetchSiteSetting('testimonials_section', DEFAULT_TESTIMONIALS_SECTION).then((res) => {
      if (res && res.title) {
        setContent(res);
      }
    });
  }, []);

  const googleMapsSearchUrl = content.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=AF+Select+Tucuman';
  const reviews = content.reviews || DEFAULT_TESTIMONIALS_SECTION.reviews;
  const offsets = ['card-pos-1', 'card-pos-2', 'card-pos-3'];

  return (
    <section className="light-testimonials-staggered-section">
      <div className="light-staggered-grid">
        {/* Left Column: Editorial Headline & Google Reviews CTA */}
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

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-dark btn-google-reviews"
          >
            <MapPin size={16} color="#EA4335" />
            <span>Ver Reseñas en Google Maps</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Right Column: Floating Staggered Cards */}
        <div className="light-staggered-cards-row">
          {reviews.map((rev, idx) => (
            <div key={rev.id || idx} className={`light-testimonial-card ${rev.offsetClass || offsets[idx % offsets.length]}`}>
              {/* Photo Header */}
              <div className="testimonial-img-wrapper">
                <img src={rev.image || DEFAULT_TESTIMONIALS_SECTION.reviews[idx]?.image} alt={rev.author} className="testimonial-img" />
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

                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-ext-link"
                    title="Ver en Google Maps"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
