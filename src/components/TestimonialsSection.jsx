import React from 'react';
import { Star, Quote, MessageSquareHeart } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 'r1',
      rating: 5,
      quote: 'Le compré la Hilux sin verla en persona. Me mandó video, kilometraje real y hasta la service history.',
      author: 'Martín R.',
      location: 'San Miguel de Tucumán',
      tag: 'Compra Automotriz Directa'
    },
    {
      id: 'r2',
      rating: 5,
      quote: 'Invertí en Torre Alem por recomendación de un amigo. Me mandó el avance de obra todos los meses.',
      author: 'Carolina D.',
      location: 'Buenos Aires',
      tag: 'Inversión Inmobiliaria'
    },
    {
      id: 'r3',
      rating: 5,
      quote: 'Vendí mi departamento en Yerba Buena en menos de 20 días. La tasación fue precisa y el asesoramiento notarial impecable.',
      author: 'Gonzalo S.',
      location: 'Yerba Buena, Tucumán',
      tag: 'Venta de Residencia'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="section-pill-badge-gold">
          <MessageSquareHeart size={14} />
          <span>EXPERIENCIAS REALES</span>
        </span>
        <h2 className="testimonials-title">
          Lo que dicen quienes ya operaron con nosotros
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 36px' }}>
          Transparencia, auditoría técnica y seguimiento personalizado en cada compraventa.
        </p>
      </div>

      <div className="testimonials-grid">
        {reviews.map((rev) => (
          <div key={rev.id} className="testimonial-card">
            <div className="rev-stars-row">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>

            <p className="rev-quote-text">
              "{rev.quote}"
            </p>

            <div className="rev-footer-info">
              <div className="rev-author-name">{rev.author}</div>
              <div className="rev-author-loc">{rev.location}</div>
              <span className="rev-tag-pill">{rev.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
