import React from 'react';
import { MapPin, ExternalLink, Star, Heart, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function TestimonialsSection() {
  const googleMapsSearchUrl = 'https://www.google.com/maps/search/?api=1&query=AF+Selection+Tucuman';

  const reviews = [
    {
      id: 'r1',
      rating: '5.0',
      quote: 'Le compré la Hilux sin verla en persona. Me mandó video detallado, kilometraje real y la historia oficial de servicios antes de la entrega.',
      author: 'Martín R.',
      location: 'San Miguel de Tucumán',
      tag: 'Compra Automotriz',
      date: 'Hilux SRX 4x4',
      image: '/testimonials/hilux.jpg'
    },
    {
      id: 'r2',
      rating: '5.0',
      quote: 'Invertí en Torre Alem por recomendación. Me enviaron los reportes de avance de obra mes a mes sin falta. Asesoramiento legal 10/10.',
      author: 'Carolina D.',
      location: 'Buenos Aires',
      tag: 'Inversión Inmobiliaria',
      date: 'Desarrollo Alem',
      image: '/testimonials/property.jpg'
    },
    {
      id: 'r3',
      rating: '5.0',
      quote: 'Vendí mi departamento en Yerba Buena en menos de 20 días. La tasación fue precisa y la coordinación en escribanía ultra rápida.',
      author: 'Gonzalo S.',
      location: 'Yerba Buena, Tucumán',
      tag: 'Venta Inmobiliaria',
      date: 'Residencia Premium',
      image: '/testimonials/porsche.jpg'
    },
    {
      id: 'r4',
      rating: '5.0',
      quote: 'Compré mi lote en Barrio Privado con total tranquilidad. Transparencia absoluta en estudio de títulos y posesión inmediata.',
      author: 'Luciana M.',
      location: 'Tucumán Capital',
      tag: 'Compra de Lote',
      date: 'Lote Barrio Privado',
      image: '/testimonials/land.jpg'
    }
  ];

  return (
    <section className="dark-section-block happy-clients-section">
      {/* ── Section Header ── */}
      <div className="happy-clients-header">
        <div className="happy-clients-title-area">
          <div className="happy-clients-badge">
            <Heart size={14} fill="#EF4444" color="#EF4444" />
            <span>CLIENTES FELICES • HISTORIAS DE CONFIANZA</span>
          </div>

          <h2 className="happy-clients-main-title">
            LO QUE DICEN QUIENES CONFÍAN EN AF SELECT
          </h2>
          <p className="happy-clients-subtitle">
            Entregas reales, tasaciones transparentes y atención 1-a-1 en Tucumán, Salta y Buenos Aires.
          </p>
        </div>

        {/* Rating & Google Maps Button */}
        <div className="happy-clients-rating-box">
          <div className="google-stars-score">
            <span className="score-num">5.0</span>
            <div className="score-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <span className="score-source">Google Reviews</span>
          </div>

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-google-maps"
          >
            <MapPin size={15} color="#EA4335" />
            <span>VER EN GOOGLE MAPS</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* ── Static Editorial 2x2 Grid (NO CAROUSEL, NO HORIZONTAL SCROLL) ── */}
      <div className="happy-clients-grid">
        {reviews.map((rev) => (
          <div key={rev.id} className="happy-client-card">
            {/* Image Column / Top Photo */}
            <div className="client-card-image-wrap">
              <img src={rev.image} alt={rev.author} className="client-card-img" />
              <div className="client-card-img-overlay" />

              {/* Tag Pill */}
              <span className="client-card-tag-badge">{rev.tag}</span>

              {/* Verified Pill */}
              <div className="client-card-verified">
                <CheckCircle2 size={14} fill="#10B981" color="#111317" />
                <span>{rev.date}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="client-card-body">
              <div>
                <div className="client-card-top-meta">
                  <div className="client-card-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                    ))}
                    <span className="rating-text">5.0 / 5.0</span>
                  </div>

                  <span className="google-badge-pill">
                    <span style={{ color: '#4285F4', fontWeight: 900 }}>G</span>oogle Review
                  </span>
                </div>

                <p className="client-card-quote">
                  "{rev.quote}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="client-card-footer">
                <div>
                  <h4 className="client-card-author">{rev.author}</h4>
                  <span className="client-card-location">{rev.location}</span>
                </div>

                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-card-link-icon"
                  title="Ver en Google Maps"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Guarantee Banner ── */}
      <div className="happy-clients-footer-banner">
        <div className="footer-banner-left">
          <ShieldCheck size={20} className="text-emerald-400" />
          <span>Atención y negociación 100% directa con Agustín Fidalgo en cada operación.</span>
        </div>
        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-banner-link"
        >
          <span>VER TODAS LAS RESEÑAS</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
