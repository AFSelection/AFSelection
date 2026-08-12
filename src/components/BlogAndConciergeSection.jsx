import React from 'react';
import { BookOpen, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function BlogAndConciergeSection() {
  const articles = [
    {
      id: 'b1',
      category: 'GUÍA DE COMPRA',
      subhead: 'Nota sobre compra de vehículos',
      title: 'Qué mirar antes de comprar una pick-up usada en Argentina',
      readTime: '4 min de lectura'
    },
    {
      id: 'b2',
      category: 'INVERSIONES',
      subhead: 'Nota sobre inversión inmobiliaria',
      title: 'Pozo, ladrillo o dólares: cómo pensar una inversión en 2026',
      readTime: '6 min de lectura'
    },
    {
      id: 'b3',
      category: 'MERCADO',
      subhead: 'Nota sobre el mercado inmobiliario de Tucumán',
      title: 'Cómo se mueve el mercado de propiedades en Yerba Buena',
      readTime: '5 min de lectura'
    }
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hola Agustín, estuve viendo la web de AF Selection y quisiera consultar por una búsqueda a medida.');
    window.open(`https://wa.me/5493815000000?text=${message}`, '_blank');
  };

  return (
    <section style={{ margin: '60px 0' }}>
      {/* Blog & Guides Sub-section */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="section-pill-tag-dark">
              <BookOpen size={14} />
              <span>INFORMES DE MERCADO & GUÍAS</span>
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text-main)', marginTop: '8px' }}>
              Lecturas Recomendadas
            </h2>
          </div>
        </div>

        <div className="articles-grid">
          {articles.map((art) => (
            <div key={art.id} className="article-card">
              <span className="art-subhead">{art.subhead}</span>
              <span className="art-cat-pill">{art.category}</span>
              <h3 className="art-title">{art.title}</h3>
              <div className="art-read-time">{art.readTime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Personal Concierge Banner (Screenshot 2) */}
      <div className="concierge-whatsapp-box">
        <div className="c-wa-content">
          <div className="c-wa-badge">
            <Sparkles size={14} />
            <span>BÚSQUEDA A MEDIDA</span>
          </div>

          <h2 className="c-wa-headline">
            ¿Buscás algo puntual?
          </h2>

          <p className="c-wa-desc">
            Autos, propiedades, campos o inversiones: escribile directo a Agustín y te arma una selección a medida.
          </p>

          <button className="c-wa-btn" onClick={handleWhatsAppClick}>
            <MessageCircle size={18} />
            <span>Escribir por WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
}
