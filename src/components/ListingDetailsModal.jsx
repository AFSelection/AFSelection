import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle, CheckCircle, ArrowUpRight, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getInitialData, saveStorageData } from '../services/storage';
import { getWhatsAppUrl } from '../utils/whatsapp';

export default function ListingDetailsModal({ item, onClose, onOpenInquiry }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, item?.images?.length]);

  if (!item) return null;

  const images = item.images && item.images.length > 0 ? item.images : [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  ];

  const formatPrice = (val) => {
    if (val === undefined || val === null) return '';
    return `${item.currency || 'USD'} ${Number(val).toLocaleString('es-AR')}`;
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const data = getInitialData();
    const newLead = {
      id: `lead-${Date.now()}`,
      listingId: item.id,
      listingTitle: item.title,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '-',
      message: formData.message || 'Solicitó información de contacto.',
      date: new Date().toISOString(),
      status: 'Pending'
    };

    data.leads = [newLead, ...(data.leads || [])];
    saveStorageData(data);
    setIsSubmitted(true);
  };

  const whatsappMessage = `Hola AF Select, me interesa la unidad: ${item.title} (${formatPrice(item.price)}). ¿Tienen disponibilidad para coordinar una reunión?`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '0' }}>
          {/* Left Gallery Section */}
          <div style={{ padding: '36px', background: 'var(--bg-canvas)', borderRight: '1px solid var(--border-light)' }}>
            <div 
              style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative', cursor: 'zoom-in' }}
              onClick={() => {
                setLightboxIndex(activeImgIndex);
                setIsLightboxOpen(true);
              }}
            >
              <img src={images[activeImgIndex]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                className="gallery-expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(activeImgIndex);
                  setIsLightboxOpen(true);
                }}
                title="Expandir imagen"
              >
                <Maximize2 size={15} />
                <span>Ampliar</span>
              </button>
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      width: '80px',
                      height: '60px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: idx === activeImgIndex ? 1 : 0.5,
                      border: idx === activeImgIndex ? '2px solid var(--text-main)' : '1px solid transparent'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '28px' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '8px' }}>DESCRIPCIÓN DE LA UNIDAD</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7' }}>
                {item.description || 'Unidad seleccionada bajo los más estrictos controles de calidad de AF Select.'}
              </p>
            </div>
          </div>

          {/* Right Editorial Spec Sheet & Form */}
          <div style={{ padding: '36px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {item.category || item.sectionId} — REF #{item.id}
            </span>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: '1.1', marginBottom: '12px' }}>
              {item.title}
            </h2>

            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' }}>
              {formatPrice(item.price)}
            </div>

            {/* Architectural Tabular Specs List */}
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '8px' }}>
              FICHA TÉCNICA
            </h4>

            <table className="editorial-spec-table">
              <tbody>
                <tr>
                  <td>Ubicación</td>
                  <td>{item.location}</td>
                </tr>
                {item.year && (
                  <tr>
                    <td>Año de Fabricación</td>
                    <td>{item.year}</td>
                  </tr>
                )}
                {item.kilometers !== undefined && item.kilometers !== null && (
                  <tr>
                    <td>Kilometraje</td>
                    <td>
                      {(() => {
                        const num = Number(String(item.kilometers).replace(/[^\d]/g, ''));
                        if (isNaN(num) || num === 0) return '0 km (Nuevo)';
                        return `${num.toLocaleString('es-AR')} km`;
                      })()}
                    </td>
                  </tr>
                )}
                {item.fuel && (
                  <tr>
                    <td>Combustible</td>
                    <td>{item.fuel}</td>
                  </tr>
                )}
                {item.transmission && (
                  <tr>
                    <td>Transmisión</td>
                    <td>{item.transmission}</td>
                  </tr>
                )}
                {item.surface && (
                  <tr>
                    <td>Superficie Total</td>
                    <td>{item.surface} m²</td>
                  </tr>
                )}
                {item.rooms && (
                  <tr>
                    <td>Ambientes</td>
                    <td>{item.rooms}</td>
                  </tr>
                )}
                {item.garages && (
                  <tr>
                    <td>Cocheras Privadas</td>
                    <td>{item.garages}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Inquire Form */}
            <div style={{ marginTop: 'auto', background: 'var(--bg-canvas)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '12px' }}>
                SOLICITAR ATENCIÓN CONCIERGE
              </h4>

              {isSubmitted ? (
                <div style={{ padding: '16px', background: '#FFF', borderRadius: '8px', border: '1px solid #10B981', color: '#10B981', textAlign: 'center', fontSize: '0.9rem' }}>
                  <CheckCircle size={24} style={{ margin: '0 auto 4px' }} />
                  <strong>Consulta enviada a CRM</strong>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Nombre completo *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', background: '#FFF', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', background: '#FFF', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', background: '#FFF', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn-pill btn-pill-dark" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
                    <span>Enviar a Asesor</span>
                    <Send size={14} />
                  </button>
                </form>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-pill"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px', background: '#25D366', color: '#FFF', borderColor: '#25D366' }}
              >
                <MessageCircle size={14} />
                <span>Contactar por WhatsApp</span>
              </a>
      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div className="lightbox-title-info">
                <span className="lightbox-item-title">{item.title}</span>
                <span className="lightbox-counter">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </div>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Cerrar visor"
              >
                <X size={24} />
              </button>
            </div>

            <div className="lightbox-main-stage">
              {images.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn prev"
                  onClick={() => setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={32} />
                </button>
              )}

              <div className="lightbox-media-wrapper">
                <img
                  src={images[lightboxIndex]}
                  alt={`${item.title} - ${lightboxIndex + 1}`}
                  className="lightbox-image"
                />
              </div>

              {images.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn next"
                  onClick={() => setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={32} />
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div className="lightbox-thumbnails-wrapper">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`lightbox-thumb ${idx === lightboxIndex ? 'active' : ''}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
