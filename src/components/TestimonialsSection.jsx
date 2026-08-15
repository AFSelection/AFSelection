import React, { useRef } from 'react';
import { MapPin, ExternalLink, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

export default function TestimonialsSection() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const googleMapsSearchUrl = 'https://www.google.com/maps/search/?api=1&query=AF+Selection+Tucuman';

  const reviews = [
    {
      id: 'r1',
      rating: '5.0',
      quote: 'Le compré la Hilux sin verla en persona. Me mandó video, kilometraje real y hasta la historia oficial de servicios.',
      author: 'Martín R.',
      location: 'San Miguel de Tucumán',
      tag: 'Compra Automotriz',
      date: 'Hace 2 semanas'
    },
    {
      id: 'r2',
      rating: '5.0',
      quote: 'Invertí en Torre Alem por recomendación de un amigo. Me enviaron los reportes de avance de obra todos los meses sin falta.',
      author: 'Carolina D.',
      location: 'Buenos Aires',
      tag: 'Inversión Inmobiliaria',
      date: 'Hace 1 mes'
    },
    {
      id: 'r3',
      rating: '5.0',
      quote: 'Vendí mi departamento en Yerba Buena en menos de 20 días. La tasación fue precisa y el asesoramiento notarial impecable.',
      author: 'Gonzalo S.',
      location: 'Yerba Buena, Tucumán',
      tag: 'Venta de Residencia',
      date: 'Hace 3 semanas'
    },
    {
      id: 'r4',
      rating: '5.0',
      quote: 'Compré mi lote en Barrio Privado con total tranquilidad. Transparencia de títulos y escribanía súper rápida.',
      author: 'Luciana M.',
      location: 'Tucumán Capital',
      tag: 'Compra de Lote',
      date: 'Hace 1 mes'
    }
  ];

  return (
    <section className="dark-section-block testimonials-section" style={{ marginBottom: '60px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        paddingBottom: '18px',
        borderBottom: '1px solid var(--border-dark)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'var(--accent-gold)',
            color: '#111317',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            lineHeight: 0
          }}>
            <MessageSquare size={20} style={{ display: 'block' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: '#FFF', lineHeight: '1.05' }}>
              RESEÑAS DE CLIENTES
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: '800' }}>5.0 Puntuación</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>en Google Maps</span>
            </div>
          </div>
        </div>

        {/* Crisp Single-Line Action Controls Group */}
        <div className="showcase-actions-group">
          <div className="carousel-nav-arrows">
            <button onClick={() => scroll('left')} className="btn-arrow-circle" title="Anterior">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="btn-arrow-circle" title="Siguiente">
              <ChevronRight size={16} />
            </button>
          </div>

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-square-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFF',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              textDecoration: 'none'
            }}
          >
            <MapPin size={14} color="#EA4335" />
            <span>VER EN GOOGLE MAPS</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={sliderRef}
        className="showcase-carousel-track testimonials-carousel-track"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '16px'
        }}
      >
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="testimonial-card-item"
            style={{
              width: '340px',
              minWidth: '340px',
              maxWidth: '340px',
              flex: '0 0 340px',
              scrollSnapAlign: 'start',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: 'var(--accent-gold)',
                    letterSpacing: '0.04em'
                  }}
                >
                  PUNTUACIÓN {rev.rating} / 5.0
                </span>

                {/* Google Badge Tag */}
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ color: '#4285F4', fontWeight: '900' }}>G</span>oogle Review
                </span>
              </div>

              <p style={{
                fontSize: '0.92rem',
                lineHeight: '1.55',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '20px',
                fontStyle: 'italic'
              }}>
                "{rev.quote}"
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: '700', color: '#FFF' }}>
                    {rev.author}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {rev.location}
                  </div>
                </div>
                <span className="rev-tag-pill">{rev.tag}</span>
              </div>

              {/* Direct Google Maps Review Link */}
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  color: 'var(--accent-gold)',
                  fontWeight: '700',
                  textDecoration: 'none',
                  marginTop: '4px'
                }}
              >
                <span>Ver reseña original en Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
