import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { fetchHeroImages } from '../services/storage';
import { resolveImageUrl, preloadInBackground } from '../utils/imageUrl';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=80'
];

const SLIDE_DURATION = 7000; // ms per slide

/** Ancho de render del hero. Ocupa el viewport completo. */
const HERO_WIDTH = 1600;

export default function BannerHero({
  images: providedImages,
  onScrollToSection,
  onGoToSection,
  onGoToAbout,
  onGoToSell,
  onBackToHome
}) {
  const [images, setImages] = useState(providedImages?.length ? providedImages : DEFAULT_IMAGES);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);

  // App ya las trae y las precarga antes de sacar el Loader, así que en el
  // home entran resueltas por prop. El fetch propio queda sólo como respaldo
  // para cuando el hero se monta sin que App las haya provisto.
  useEffect(() => {
    if (providedImages?.length) {
      setImages(providedImages);
      return;
    }
    let alive = true;
    fetchHeroImages().then((imgs) => {
      if (alive && imgs && imgs.length > 0) setImages(imgs);
    });
    return () => { alive = false; };
  }, [providedImages]);

  // URLs finales, al ancho real del hero. Sin esto el slide pedía el original
  // de varios MB en vez de la versión de ~120 KB.
  const slideUrls = useMemo(
    () => images.map((u) => resolveImageUrl(u, { width: HERO_WIDTH, quality: 76 })),
    [images]
  );

  // Los slides que no son el primero se traen en segundo plano, para que el
  // auto-avance a los 7s no encuentre la foto sin descargar.
  useEffect(() => {
    if (slideUrls.length <= 1) return;
    return preloadInBackground(slideUrls.slice(1));
  }, [slideUrls]);

  const goTo = useCallback((idx, total) => {
    const next = (idx + total) % total;
    setPrev(current);
    setCurrent(next);
  }, [current]);

  // Auto advance
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setTimeout(() => {
      goTo(current + 1, images.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, images.length, goTo]);

  return (
    <section className="split-hero-section">
      {/* ── Full Bleed Slideshow ── */}
      <div className="split-hero-media">
        {slideUrls.map((src, i) => {
          const isActive = i === current;
          const isPrev   = i === prev;
          return (
            <img
              key={src}
              src={src}
              alt={`AF • Select Showroom ${i + 1}`}
              className={`hero-slide ${isActive ? 'hero-slide--active' : ''} ${isPrev ? 'hero-slide--exit' : ''}`.trim()}
              // El primer slide es el LCP de la página: nunca debe diferirse.
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchpriority={i === 0 ? 'high' : 'low'}
              decoding="async"
              draggable={false}
            />
          );
        })}
        <div className="split-hero-dark-overlay" />
      </div>

      {/* Top Mobile Brand Header */}
      <div className="mobile-top-brand-bar">
        <a href="#" className="split-brand-logo mobile-logo-pill" onClick={(e) => { e.preventDefault(); if (onBackToHome) onBackToHome(); }}>
          <span className="logo-text-bold" style={{ color: '#FFF' }}>AF</span>
          <span className="brand-dot-black" style={{ backgroundColor: '#FFF' }} />
          <span className="logo-text-light" style={{ color: '#FFF' }}>SELECT</span>
        </a>
      </div>

      {/* Glass Panel */}
      <div className="split-glass-panel">
        {/* Navigation Bar (Desktop Only) */}
        <div className="split-glass-nav desktop-only-nav">
          <a href="#" className="split-brand-logo" onClick={(e) => { e.preventDefault(); if (onBackToHome) onBackToHome(); }}>
            <span className="logo-text-bold">AF</span>
            <span className="brand-dot-black" />
            <span className="logo-text-light">SELECT</span>
          </a>


          <div className="split-nav-links">
            <button onClick={() => onGoToSection ? onGoToSection('autos') : onScrollToSection('autos')} className="split-nav-link">
              AUTOS
            </button>
            <button onClick={() => onGoToSection ? onGoToSection('propiedades') : onScrollToSection('propiedades')} className="split-nav-link">
              PROPIEDADES
            </button>
            <button onClick={() => onGoToAbout ? onGoToAbout() : onScrollToSection('por-que-elegirnos')} className="split-nav-link">
              NOSOTROS
            </button>
          </div>
        </div>

        {/* Editorial Content */}
        <div className="split-glass-body">
          <div className="split-badge-pill">
            <ShieldCheck size={14} style={{ color: '#111317', flexShrink: 0 }} />
            <span>TRATO DIRECTO CON AGUSTÍN FIDALGO</span>
          </div>

          <h1 className="split-hero-title">
            <span className="hero-line-strict line-black-text">GARAGE DE AUTOS</span>
            <span className="hero-line-strict line-black-highlight">
              <span className="highlight-badge-inner">Y PROPIEDADES</span>
            </span>
          </h1>

          <p className="split-hero-desc desktop-only-desc">
            Selección y gestión de vehículos y propiedades en Tucumán, Salta y Buenos Aires.
          </p>

          {/* CTAs (Explorar Catálogo + Quiero Vender) */}
          <div className="split-actions-row">
            <button
              className="btn-split-primary"
              onClick={() => onGoToSection ? onGoToSection('autos') : onScrollToSection('autos')}
            >
              EXPLORAR CATÁLOGO
            </button>

            <button
              className="btn-split-secondary"
              onClick={onGoToSell}
            >
              QUIERO VENDER
            </button>
          </div>


        </div>

        {/* Footer (Desktop Only) */}
        <div className="split-glass-footer desktop-only-footer">
          <span className="split-footer-label">ATENCIÓN PERSONALIZADA</span>
          <span className="split-footer-val">LUN - SÁB: 09:00 - 20:00 HS</span>
        </div>
      </div>
    </section>
  );
}

