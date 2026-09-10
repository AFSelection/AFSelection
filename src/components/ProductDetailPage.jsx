import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, MessageCircle, Send, CheckCircle, ChevronLeft, ChevronRight, Play, Eye, FileText, X, Maximize2, MapPin } from 'lucide-react';
import { submitLead } from '../services/storage';
import { getWhatsAppUrl, getItemWhatsAppMessage } from '../utils/whatsapp';
import { isInstagramUrl, parseInstagramUrl, getListingVideos } from '../utils/instagram';
import { ExternalLink } from 'lucide-react';
import ListingCard from './ListingCard';
import OptimizedImage from './OptimizedImage';
import { resolveImageUrl, preloadMany, preloadInBackground } from '../utils/imageUrl';
import { formatSpecLabel } from '../utils/specs';

/** Anchos de render de la ficha. */
const DETAIL_WIDTH = 1200;  // foto principal
const THUMB_WIDTH = 200;    // miniaturas
const LIGHTBOX_WIDTH = 1600; // pantalla completa

export default function ProductDetailPage({ item, onBack, onGoToSell, favorites, toggleFavorite, onSelectListing, listings = [], onOpenInquiry }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Gather media (images + videos) safely before hooks evaluate dependencies.
  // Memoizado a propósito: estos arrays son dependencia de los efectos de
  // precarga, y si se recrearan en cada render los relanzarían sin parar.
  const images = useMemo(() => (
    item?.images && item.images.length > 0 ? item.images : [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
    ]
  ), [item]);

  const videos = useMemo(() => (item ? getListingVideos(item) : []), [item]);

  const mediaItems = useMemo(() => (item ? [
    ...images.map(img => ({ type: 'image', url: img })),
    ...videos.map(vid => {
      const isEmbed = isInstagramUrl(vid) || vid.includes('youtube.com') || vid.includes('youtu.be') || vid.includes('vimeo.com');
      return { type: 'video', url: vid, isEmbed };
    })
  ] : []), [item, images, videos]);

  useEffect(() => {
    // Scroll to top when loading a new product detail page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveMediaIndex(0);
    setIsSubmitted(false);
    setIsLightboxOpen(false);
  }, [item]);

  // Toda la galería se descarga apenas se abre la ficha, no al tocar cada
  // miniatura. Es lo que hace que pasar de foto en foto sea instantáneo en vez
  // de dejar el recuadro en negro esperando la descarga.
  useEffect(() => {
    if (!item) return;
    const urls = images.map((u) => u).filter(Boolean);
    if (urls.length === 0) return;

    // Primero las miniaturas (livianas, se ven todas juntas) y la foto grande
    // que ya está en pantalla; después el resto de las grandes.
    const immediate = [
      ...urls.map((u) => resolveImageUrl(u, { width: THUMB_WIDTH, quality: 65 })),
      resolveImageUrl(urls[0], { width: DETAIL_WIDTH, quality: 74 })
    ];
    preloadMany(immediate, { concurrency: 8 });

    return preloadInBackground(
      urls.slice(1).map((u) => resolveImageUrl(u, { width: DETAIL_WIDTH, quality: 74 }))
    );
  }, [item, images]);

  // El lightbox pide una resolución mayor. Preparamos la foto activa y sus dos
  // vecinas para que las flechas no muestren un hueco.
  useEffect(() => {
    if (!isLightboxOpen) return;
    const neighbours = [lightboxIndex, lightboxIndex + 1, lightboxIndex - 1]
      .map((i) => mediaItems[(i + mediaItems.length) % mediaItems.length])
      .filter((m) => m && m.type === 'image')
      .map((m) => resolveImageUrl(m.url, { width: LIGHTBOX_WIDTH, quality: 80 }));
    preloadMany(neighbours, { concurrency: 3 });
  }, [isLightboxOpen, lightboxIndex, mediaItems]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, mediaItems.length]);

  useEffect(() => {
    // Load Instagram official Embed SDK to process embeds seamlessly
    if (window.instgrm) {
      try { window.instgrm.Embeds.process(); } catch {}
    } else {
      const s = document.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, [activeMediaIndex, item]);

  if (!item) return null;

  const formatPrice = (val) => {
    if (val === undefined || val === null) return '';
    return `${item.currency || 'USD'} ${Number(val).toLocaleString('es-AR')}`;
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

  const whatsappMessage = getItemWhatsAppMessage(item);
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
        <a
          href={ig.directUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '380px',
            background: 'radial-gradient(circle at center, #1c2029 0%, #0d0e12 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textDecoration: 'none',
            color: '#FFFFFF',
            borderRadius: '20px',
            boxSizing: 'border-box',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          {/* Instagram Pill Badge */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#E0E0E0',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>INSTAGRAM REEL PRESENTACIÓN</span>
          </div>

          {/* Glowing Play Circle Button */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(220, 39, 67, 0.5)',
            marginBottom: '20px'
          }}>
            <Play size={28} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '4px' }} />
          </div>

          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            VER REEL EN INSTAGRAM
          </h4>

          <p style={{
            fontSize: '0.82rem',
            color: 'rgba(255, 255, 255, 0.65)',
            textAlign: 'center',
            maxWidth: '320px',
            lineHeight: '1.4',
            marginBottom: '24px'
          }}>
            Tocá para abrir la video-presentación HD directamente en Instagram
          </p>

          {/* Action Button */}
          <div style={{
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '800',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
          }}>
            <span>ABRIR EN INSTAGRAM</span>
            <ExternalLink size={14} />
          </div>
        </a>
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
    const igVideo = videos.find(v => isInstagramUrl(v)) || (item.videos && item.videos.find(v => isInstagramUrl(v)));
    const igData = igVideo ? parseInstagramUrl(igVideo) : null;

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>
        <video
          src={url}
          controls
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
        />
        {igData && (
          <a
            href={igData.directUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              zIndex: 25,
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <span>VER EN INSTAGRAM</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
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
              <div 
                className="gallery-image-interactive-wrapper"
                onClick={() => {
                  setLightboxIndex(activeMediaIndex);
                  setIsLightboxOpen(true);
                }}
                style={{ width: '100%', height: '100%', cursor: 'zoom-in', position: 'relative' }}
              >
                <OptimizedImage
                  src={activeMedia.url}
                  alt={item.title}
                  className="gallery-main-media"
                  priority={true}
                  targetWidth={DETAIL_WIDTH}
                />
                <button
                  type="button"
                  className="gallery-expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(activeMediaIndex);
                    setIsLightboxOpen(true);
                  }}
                  title="Expandir imagen"
                >
                  <Maximize2 size={15} />
                  <span>Ampliar</span>
                </button>
              </div>
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
                  <OptimizedImage
                    src={media.type === 'image' ? media.url : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=120&q=80'}
                    alt=""
                    targetWidth={THUMB_WIDTH}
                  />
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
          {item.location && (
            <div className="detail-location-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: '600', marginTop: '6px', marginBottom: '10px' }}>
              <MapPin size={16} style={{ color: '#DC2626', flexShrink: 0 }} />
              <span>{item.location}</span>
            </div>
          )}
          <p className="detail-subtitle">{item.subtitle}</p>

          <div className="detail-price-box">
            <span className="price-label">VALOR DE MERCADO</span>
            {Boolean(item.isOffer) && item.oldPrice && Number(item.oldPrice) > Number(item.price) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', marginBottom: '2px' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '700' }}>
                  {item.currency || 'USD'} {Number(item.oldPrice).toLocaleString('es-AR')}
                </span>
                <span style={{ background: '#10B981', color: '#FFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                  -{Math.round(((Number(item.oldPrice) - Number(item.price)) / Number(item.oldPrice)) * 100)}% OFF
                </span>
              </div>
            )}
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
              background: '#25D366',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontSize: '0.88rem',
              fontWeight: '800',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              marginBottom: '28px',
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.22)',
              transition: 'transform 0.2s ease, background 0.2s ease'
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
                {(!item.sectionId || item.sectionId === 'autos') && item.year && (
                  <tr>
                    <td>Año</td>
                    <td>{item.year}</td>
                  </tr>
                )}
                {(!item.sectionId || item.sectionId === 'autos') && item.kilometers != null && (
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
                {(!item.sectionId || item.sectionId === 'autos') && item.fuel && (
                  <tr>
                    <td>Combustible</td>
                    <td>{item.fuel}</td>
                  </tr>
                )}
                {(!item.sectionId || item.sectionId === 'autos') && item.transmission && (
                  <tr>
                    <td>Transmisión</td>
                    <td>{item.transmission}</td>
                  </tr>
                )}
                {(!item.sectionId || item.sectionId === 'propiedades') && item.surface && (
                  <tr>
                    <td>Superficie Total</td>
                    <td>{item.surface} m²</td>
                  </tr>
                )}
                {(!item.sectionId || item.sectionId === 'propiedades') && item.rooms && (
                  <tr>
                    <td>Ambientes</td>
                    <td>{item.rooms}</td>
                  </tr>
                )}
                {item.specs && typeof item.specs === 'object' && Object.keys(item.specs).map((key) => {
                  const val = item.specs[key];
                  if (val === null || val === undefined || val === '') return null;
                  if (key.toLowerCase() === 'location') return null; // Already displayed as first row
                  return (
                    <tr key={key}>
                      <td>{formatSpecLabel(key)}</td>
                      <td>{String(val)}</td>
                    </tr>
                  );
                })}
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

      {/* Lightbox Fullscreen Image Viewer Modal */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            {/* Top Bar */}
            <div className="lightbox-header">
              <div className="lightbox-title-info">
                <span className="lightbox-item-title">{item.title}</span>
                <span className="lightbox-counter">
                  {lightboxIndex + 1} / {mediaItems.length}
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

            {/* Main Image Stage */}
            <div className="lightbox-main-stage">
              {mediaItems.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn prev"
                  onClick={() => setLightboxIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={32} />
                </button>
              )}

              <div className="lightbox-media-wrapper">
                {mediaItems[lightboxIndex]?.type === 'image' ? (
                  <img
                    src={resolveImageUrl(mediaItems[lightboxIndex].url, { width: LIGHTBOX_WIDTH, quality: 80 })}
                    alt={`${item.title} - ${lightboxIndex + 1}`}
                    className="lightbox-image"
                    decoding="async"
                    fetchpriority="high"
                    draggable={false}
                  />
                ) : (
                  <div className="lightbox-video-container">
                    {renderVideoEmbed(mediaItems[lightboxIndex].url)}
                  </div>
                )}
              </div>

              {mediaItems.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn next"
                  onClick={() => setLightboxIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={32} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip */}
            {mediaItems.length > 1 && (
              <div className="lightbox-thumbnails-wrapper">
                {mediaItems.map((media, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`lightbox-thumb ${idx === lightboxIndex ? 'active' : ''}`}
                  >
                    <img
                      src={resolveImageUrl(
                        media.type === 'image'
                          ? media.url
                          : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4',
                        { width: THUMB_WIDTH, quality: 65 }
                      )}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    {media.type === 'video' && (
                      <div className="play-thumb-overlay">
                        <Play size={12} fill="#FFF" />
                      </div>
                    )}
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
