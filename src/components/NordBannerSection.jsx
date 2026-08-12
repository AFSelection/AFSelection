import React from 'react';

export default function NordBannerSection() {
  return (
    <section className="nord-section">
      {/* Full Width Panoramic Architectural Photo */}
      <div className="nord-media-frame">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
          alt="Architectural Interior"
        />
        <div className="nord-media-overlay">
          <p className="nord-quote">
            "Donde la arquitectura contemporánea encuentra la ingeniería automotriz de precisión."
          </p>
          <span className="nord-subquote">PORTAFOLIO DE AUTOR 2026</span>
        </div>
      </div>

      {/* Giant Display Typography (Perfect fit, solid filled dot) */}
      <div className="nord-giant-typo">
        <span>AF</span>
        <span className="brand-dot-large" />
        <span>SELECTION</span>
      </div>
    </section>
  );
}
