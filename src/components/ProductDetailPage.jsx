import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, CheckCircle, ChevronLeft, ChevronRight, Play, Eye, FileText } from 'lucide-react';
import { submitLead } from '../services/storage';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { isInstagramUrl, parseInstagramUrl, getListingVideos } from '../utils/instagram';
import { ExternalLink } from 'lucide-react';
import ListingCard from './ListingCard';

export default function ProductDetailPage({ item, onBack, onGoToSell, favorites, toggleFavorite, onSelectListing, listings = [] }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Scroll to top when loading a new product detail page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveMediaIndex(0);
    setIsSubmitted(false);
  }, [item]);

  if (!item) return null;

  // Gather media (images + videos)
  const images = item.images && item.images.length > 0 ? item.images : [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
  ];

  // We support videos (Instagram Reels, YouTube, Vimeo, MP4) with default fallback
  const videos = getListingVideos(item);

  // Combine media into a single array for the carousel
  const mediaItems = [
    ...images.map(img => ({ type: 'image', url: img })),
    ...videos.map(vid => {
      const isEmbed = isInstagramUrl(vid) || vid.includes('youtube.com') || vid.includes('youtu.be') || vid.includes('vimeo.com');
      return { type: 'video', url: vid, isEmbed };
    })
  ];

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: item.currency || 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      const newLead = {
        id: `lead-${Date.now()}`,
        listingId: item.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '-',
        notes: formData.message || 'Solicitó información de contacto para esta unidad.',
        status: 'Pending',
        type: 'buy'
      };

      await submitLead(newLead);
      setIsSubmitted(true);
    } catch (error) {
      alert('Hubo un error al enviar tu consulta. Por favor, intentalo de nuevo.');
      console.error(error);
    }
  };

  const whatsappMessage = `Hola AF Select, me interesa el activo: ${item.title} (${formatPrice(item.price)}). ¿Me podrían brindar más información?`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  // Find related products (same section, excluding current)
  const allListings = listings || [];
  const relatedListings = allListings
    .filter(l => l.sectionId === item.sectionId && l.id !== item.id)
    .slice(0, 3);

  const activeMedia = mediaItems[activeMediaIndex];

  // Video embed helper (Supports Instagram Reels, YouTube, Vimeo, MP4)
  const renderVideoEmbed = (url) => {
    if (isInstagramUrl(url)) {
      const ig = parseInstagramUrl(url);
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '480px', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <iframe
            src={ig.embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            allowTransparency="true"
            title="Instagram Reel"
            style={{ border: 'none', width: '100%', height: '100%', minHeight: '480px' }}
          />
          {/* Floating Direct Instagram Button */}
          <a
            href={ig.directUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 30,
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
            }}
          >
            <span>VER EN INSTAGRAM</span>
            <ExternalLink size={14} />
          </a>
        </div>
      );
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else {
        videoId = url.split('/').pop();
      }
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      );
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      );
    }
    return (
      <video
        src={url}
        controls
        autoPlay
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
      />
    );
  };

  return (
    <div className="product-detail-container" style={{ marginTop: '90px' }}>
      
      {/* Top Navigation */}
      <div className="detail-navigation-bar">
        <button className="btn-back-text" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>VOLVER AL INICIO</span>
        </button>
        <span className="reference-code">ID REF: #{item.id}</span>
      </div>

      {/* Main Split Section */}
      <div className="detail-main-split">
        
        {/* Left Column: Media Gallery */}
        <div className="detail-gallery-column">
          <div className="gallery-viewport">
            {activeMedia.type === 'image' ? (
              <img
                src={activeMedia.url}
                alt={item.title}
                className="gallery-main-media"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="video-player-container">
                {renderVideoEmbed(activeMedia.url)}
              </div>
            )}

            {/* Gallery Navigation Arrows */}
            {mediaItems.length > 1 && (
              <>
                <button 
                  className="gallery-nav-btn prev"
                  onClick={() => setActiveMediaIndex(prev => (prev === 0 ? mediaItems.length - 1 : prev - 1))}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  className="gallery-nav-btn next"
                  onClick={() => setActiveMediaIndex(prev => (prev === mediaItems.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails list */}
          {mediaItems.length > 1 && (
            <div className="gallery-thumbnails-wrapper">
              {mediaItems.map((media, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`gallery-thumb ${idx === activeMediaIndex ? 'active' : ''}`}
                >
                  <img src={media.type === 'image' ? media.url : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=120&q=80'} alt="" />
                  {media.type === 'video' && (
                    <div className="play-thumb-overlay">
                      <Play size={16} fill="#FFF" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Key details */}
        <div className="detail-info-column">
          <div className="category-badge-row">
            <span className="category-pill">{item.category || item.sectionId}</span>
            {item.featured && <span className="featured-pill">★ SELECCIÓN DESTACADA</span>}
          </div>

          <h1 className="detail-title">{item.title}</h1>
          <p className="detail-subtitle">{item.subtitle}</p>

          <div className="detail-price-box">
            <span className="price-label">VALOR DE MERCADO</span>
            <h2 className="price-value">{formatPrice(item.price)}</h2>
          </div>

          {/* Direct WhatsApp CTA Button under Price */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-whatsapp-cta"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '16px 20px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontSize: '0.88rem',
              fontWeight: '800',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              marginBottom: '28px',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.28)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" style={{ display: 'block', flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>CONSULTAR POR WHATSAPP</span>
          </a>

          {/* Spec Sheet Table */}
          <div className="spec-sheet-section">
            <h3 className="spec-sheet-title">
              <FileText size={16} />
              <span>FICHA TÉCNICA</span>
            </h3>
            
            <table className="editorial-spec-table">
              <tbody>
                <tr>
                  <td>Ubicación</td>
                  <td>{item.location}</td>
                </tr>
                {item.year && (
                  <tr>
                    <td>Año</td>
                    <td>{item.year}</td>
                  </tr>
                )}
                {item.kilometers != null && (
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
                    <td>Cocheras</td>
                    <td>{item.garages}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Full Width Description Section */}
      <div className="detail-description-section">
        <h3 className="description-section-title">DESCRIPCIÓN DE LA UNIDAD</h3>
        <p className="description-text">
          {item.description || 'Unidad disponible en AF Select.'}
        </p>

        {/* Prompt to Sell instead of Buy (Placed below description) */}
        <div className="sell-callout-box" style={{ marginTop: '36px' }}>
          <h4 className="sell-callout-title">¿QUERÉS VENDER TU UNIDAD?</h4>
          <p className="sell-callout-text">
            Si en lugar de comprar estás buscando vender tu vehículo o propiedad, 
            nosotros nos encargamos de todo el proceso de publicación y gestión de interesados.
          </p>
          <button className="btn-sell-redirect" onClick={onGoToSell} style={{ maxWidth: '320px' }}>
            <span>PUBLICAR MI ACTIVO CON AF Select</span>
            <Play size={10} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedListings.length > 0 && (
        <div className="related-products-section">
          <h3 className="related-section-title">OTRAS UNIDADES RECOMENDADAS</h3>
          <div className="related-grid">
            {relatedListings.map((relatedItem) => (
              <ListingCard
                key={relatedItem.id}
                item={relatedItem}
                isFavorite={favorites.includes(relatedItem.id)}
                onToggleFavorite={toggleFavorite}
                onSelect={(sel) => onSelectListing(sel)}
                layout="grid"
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Conversion CTA Area */}
      <div className="detail-conversion-cta-block">
        <div className="cta-left-content">
          <h3 className="cta-title">¿Interesado en realizar una consulta o coordinar una visita?</h3>
          <p className="cta-description">
            Dejanos tus datos de contacto y nos comunicaremos con vos a la brevedad 
            para brindarte asesoramiento personalizado.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp-cta"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>CONTACTAR DIRECTO VÍA WHATSAPP</span>
          </a>
        </div>

        <div className="cta-right-form">
          <h4 className="form-title">SOLICITAR INFORMACIÓN</h4>
          {isSubmitted ? (
            <div className="submission-success-box">
              <CheckCircle size={32} />
              <h4>Consulta Enviada</h4>
              <p>Tu solicitud ha sido registrada correctamente. Nos comunicaremos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="cta-contact-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nombre y Apellido *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Correo electrónico *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Consulta adicional..."
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-submit-lead">
                <span>ENVIAR SOLICITUD</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
