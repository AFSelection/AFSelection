import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { getInitialData, saveStorageData } from '../services/storage';
import { getWhatsAppUrl } from '../utils/whatsapp';

export default function ListingDetailsModal({ item, onClose, onOpenInquiry }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!item) return null;

  const images = item.images && item.images.length > 0 ? item.images : [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  ];

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: item.currency || 'USD',
      maximumFractionDigits: 0
    }).format(val);
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
            <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={images[activeImgIndex]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenInquiry) onOpenInquiry(item);
                  else window.open(whatsappUrl, '_blank');
                }}
                className="btn-pill"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px', background: '#25D366', color: '#FFF', borderColor: '#25D366', cursor: 'pointer' }}
              >
                <MessageCircle size={14} />
                <span>Contactar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
