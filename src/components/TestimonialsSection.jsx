import React, { useRef } from 'react';
import { MapPin, ExternalLink, ChevronLeft, ChevronRight, Star, Heart, CheckCircle2 } from 'lucide-react';

export default function TestimonialsSection() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const googleMapsSearchUrl = 'https://www.google.com/maps/search/?api=1&query=AF+Selection+Tucuman';

  const reviews = [
    {
      id: 'r1',
      rating: '5.0',
      quote: 'Le compré la Hilux sin verla en persona. Me mandó video, kilometraje real y la historia oficial de servicios.',
      author: 'Martín R.',
      location: 'San Miguel de Tucumán',
      tag: 'Compra Automotriz',
      date: 'Entrega en Tucumán',
      image: '/testimonials/hilux.jpg'
    },
    {
      id: 'r2',
      rating: '5.0',
      quote: 'Invertí en Torre Alem por recomendación. Reportes de avance de obra mes a mes sin falta. Excelente gestión.',
      author: 'Carolina D.',
      location: 'Buenos Aires',
      tag: 'Inversión Inmobiliaria',
      date: 'Inversión Off-Market',
      image: '/testimonials/property.jpg'
    },
    {
      id: 'r3',
      rating: '5.0',
      quote: 'Vendí mi departamento en Yerba Buena en menos de 20 días. Tasación impecable y escribanía ultra rápida.',
      author: 'Gonzalo S.',
      location: 'Yerba Buena, Tucumán',
      tag: 'Venta de Residencia',
      date: 'Entrega 911 Carrera',
      image: '/testimonials/porsche.jpg'
    },
    {
      id: 'r4',
      rating: '5.0',
      quote: 'Compré mi lote en Barrio Privado con total tranquilidad. Transparencia absoluta en títulos y documentación.',
      author: 'Luciana M.',
      location: 'Tucumán Capital',
      tag: 'Compra de Lote',
      date: 'Escritura Inmediata',
      image: '/testimonials/land.jpg'
    }
  ];

  return (
    <section className="dark-section-block testimonials-section" style={{ marginBottom: '60px', padding: '36px 28px' }}>
      {/* Header Container */}
      <div className="testimonials-header-row" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-dark)',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
            color: '#FFF',
            width: '48px',
            height: '48px',
            minWidth: '48px',
            minHeight: '48px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)'
          }}>
            <Heart size={24} fill="#FFF" color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#FFF', lineHeight: '1.05', letterSpacing: '-0.02em' }}>
              CLIENTES FELICES <span style={{ color: '#EF4444' }}>•</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span style={{ fontSize: '0.82rem', color: '#F59E0B', fontWeight: '800' }}>5.0 Puntuación</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>en Google Reviews</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="showcase-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="carousel-nav-arrows" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => scroll('left')} className="btn-arrow-circle" title="Anterior">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="btn-arrow-circle" title="Siguiente">
              <ChevronRight size={18} />
            </button>
          </div>

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-square-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFF',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              textDecoration: 'none',
              padding: '10px 16px',
              borderRadius: '12px'
            }}
          >
            <MapPin size={14} color="#EA4335" />
            <span>VER GOOGLE MAPS</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={sliderRef}
        className="showcase-carousel-track testimonials-carousel-track"
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '16px',
          scrollbarWidth: 'none'
        }}
      >
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="testimonial-photo-card"
            style={{
              width: '360px',
              minWidth: '360px',
              maxWidth: '360px',
              flex: '0 0 360px',
              scrollSnapAlign: 'start',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}
          >
            {/* Image Header with Badge Overlay */}
            <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden' }}>
              <img
                src={rev.image}
                alt={rev.author}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.95)'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(17, 19, 23, 0.95) 0%, transparent 60%)'
              }} />

              {/* Tag Pill Overlay */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'rgba(17, 19, 23, 0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF',
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '5px 12px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {rev.tag}
              </div>

              {/* Verification Badge Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#10B981',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                <CheckCircle2 size={15} fill="#10B981" color="#111317" />
                <span style={{ color: '#FFF' }}>{rev.date}</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                {/* Rating & Source */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                    ))}
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#FFF', marginLeft: '4px' }}>5.0</span>
                  </div>

                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '3px 9px',
                    borderRadius: '8px'
                  }}>
                    Google Review
                  </span>
                </div>

                {/* Quote */}
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.55',
                  color: 'rgba(255, 255, 255, 0.88)',
                  fontStyle: 'italic',
                  marginBottom: '20px'
                }}>
                  "{rev.quote}"
                </p>
              </div>

              {/* Author & Footer */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: '800', color: '#FFF' }}>
                    {rev.author}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {rev.location}
                  </div>
                </div>

                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFF',
                    transition: 'all 0.2s ease'
                  }}
                  title="Ver reseña original"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
