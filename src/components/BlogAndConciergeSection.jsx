import React from 'react';
import { BookOpen, MessageCircle, ArrowRight, Search } from 'lucide-react';

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

      {/* WhatsApp Personal Search Banner */}
      <div className="concierge-whatsapp-box">
        <div className="c-wa-content">
          <div className="c-wa-badge">
            <Search size={14} />
            <span>BÚSQUEDA A MEDIDA</span>
          </div>

          <h2 className="c-wa-headline">
            ¿Buscás algo puntual?
          </h2>

          <p className="c-wa-desc">
            Autos, propiedades, campos o inversiones: escribile directo a Agustín y te arma una selección a medida.
          </p>

          <button className="c-wa-btn" onClick={handleWhatsAppClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Escribir por WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
}
