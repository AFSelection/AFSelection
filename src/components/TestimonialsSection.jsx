import React from 'react';
import { MapPin, ExternalLink, Star, Heart, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function TestimonialsSection() {
  const googleMapsSearchUrl = 'https://www.google.com/maps/search/?api=1&query=AF+Select+Tucuman';

  const reviews = [
    {
      id: 'r1',
      rating: '5.0',
      quote: 'Le compré la Hilux sin verla en persona. Me mandó video, kilometraje real y la historia oficial de servicios.',
      author: 'Martín R.',
      location: 'San Miguel de Tucumán',
      tag: 'Compra Automotriz',
      date: 'Hilux SRX 4x4',
      image: '/testimonials/hilux.jpg',
      offsetClass: 'card-pos-1'
    },
    {
      id: 'r2',
      rating: '5.0',
      quote: 'Invertí en Torre Alem por recomendación. Reportes de avance de obra mes a mes sin falta. Excelente atención.',
      author: 'Carolina D.',
      location: 'Buenos Aires',
      tag: 'Inversión Inmobiliaria',
      date: 'Desarrollo Alem',
      image: '/testimonials/property.jpg',
      offsetClass: 'card-pos-2'
    },
    {
      id: 'r3',
      rating: '5.0',
      quote: 'Vendí mi departamento en Yerba Buena en menos de 20 días. Tasación impecable y escribanía ultra rápida.',
      author: 'Gonzalo S.',
      location: 'Yerba Buena, Tucumán',
      tag: 'Venta Inmobiliaria',
      date: 'Residencia Premium',
      image: '/testimonials/porsche.jpg',
      offsetClass: 'card-pos-3'
    }
  ];

  return (
    <section className="light-testimonials-staggered-section">
      <div className="light-staggered-grid">
        {/* Left Column: Editorial Headline & Google Reviews CTA */}
        <div className="light-staggered-left">
          <div className="light-badge-pill">
            <Heart size={14} fill="#EF4444" color="#EF4444" />
            <span>CLIENTES FELICES • AF SELECT</span>
          </div>

          <h2 className="light-staggered-title">
            LO QUE DICEN QUIENES CONFÍAN EN NOSOTROS
          </h2>

          <p className="light-staggered-desc">
            Facilitamos la compra, venta e inversión de activos de alta gama con transparencia absoluta y atención directa en Tucumán, Salta y Buenos Aires.
          </p>

          <div className="light-rating-badge-row">
            <div className="light-score-pill">
              <span className="score-number">5.0</span>
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
          {reviews.map((rev) => (
            <div key={rev.id} className={`light-testimonial-card ${rev.offsetClass}`}>
              {/* Photo Header */}
              <div className="testimonial-img-wrapper">
                <img src={rev.image} alt={rev.author} className="testimonial-img" />
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
                  <span className="mini-score">5.0 / 5.0</span>
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
