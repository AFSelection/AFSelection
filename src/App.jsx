import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import BannerHero from './components/BannerHero';
import SectionsCategoryBar from './components/SectionsCategoryBar';
import PriceDropShowcaseSection from './components/PriceDropShowcaseSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import AutosCarouselShowcase from './components/AutosCarouselShowcase';
import StaggeredShowcaseSection from './components/StaggeredShowcaseSection';
import PropiedadesShowcase from './components/PropiedadesShowcase';
import InvestmentsShowcaseSection from './components/InvestmentsShowcaseSection';
import TestimonialsSection from './components/TestimonialsSection';
import BlogAndConciergeSection from './components/BlogAndConciergeSection';
import CatalogHeaderBanner from './components/CatalogHeaderBanner';
import ListingCard from './components/ListingCard';
import ListingDetailsModal from './components/ListingDetailsModal';
import PropertyMapView from './components/PropertyMapView';
import { getInitialData, subscribeToStorage } from './services/storage';
import { Heart, X, AlertCircle, Layers } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(() => getInitialData());
  const [activeSection, setActiveSection] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('af_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const autosRef = useRef(null);
  const propiedadesRef = useRef(null);

  // Scroll listener to reveal header AFTER scrolling past Hero
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrolledNav(true);
      } else {
        setShowScrolledNav(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToStorage((newData) => {
      setData(newData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('af_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setShowFavoritesOnly(false);
  };

  const filteredListings = useMemo(() => {
    return (data.listings || []).filter((item) => {
      if (activeSection !== 'all' && item.sectionId !== activeSection) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (showFavoritesOnly && !favorites.includes(item.id)) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const subMatch = item.subtitle?.toLowerCase().includes(q);
        const locMatch = item.location?.toLowerCase().includes(q);
        const catMatch = item.category?.toLowerCase().includes(q);
        if (!titleMatch && !subMatch && !locMatch && !catMatch) return false;
      }

      return true;
    });
  }, [data.listings, activeSection, selectedCategory, searchQuery, showFavoritesOnly, favorites]);

  // Dataset splits for Homepage Carousels
  const allAutosListings = useMemo(() => {
    return (data.listings || []).filter((l) => l.sectionId === 'autos');
  }, [data.listings]);

  const allPropiedadesListings = useMemo(() => {
    return (data.listings || []).filter((l) => l.sectionId === 'propiedades');
  }, [data.listings]);

  const dynamicOtherListings = useMemo(() => {
    return (data.listings || []).filter((l) => l.sectionId !== 'autos' && l.sectionId !== 'propiedades');
  }, [data.listings]);

  const isHomepage = activeSection === 'all' && !showFavoritesOnly && searchQuery.trim() === '';

  return (
    <div>
      {/* Floating Header */}
      <Header
        sections={data.sections || []}
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          setSelectedCategory('all');
          if (sec !== 'propiedades') setShowMap(false);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        showMap={showMap}
        setShowMap={setShowMap}
        onOpenFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        isVisible={!isHomepage || showScrolledNav}
      />

      <main className="main-wrapper" style={{ paddingTop: '0' }}>
        {/* FUNNEL STAGE 1: Full Viewport Monumental Hero Banner */}
        {isHomepage && (
          <BannerHero
            onScrollToSection={(sec) => {
              setActiveSection(sec);
            }}
            onToggleMap={() => {
              setActiveSection('propiedades');
              setShowMap(true);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* FUNNEL STAGE 2: Category Options Bar */}
        {isHomepage && (
          <SectionsCategoryBar
            sections={data.sections || []}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            showMap={showMap}
            onToggleMap={() => {
              setActiveSection('propiedades');
              setShowMap(true);
            }}
          />
        )}

        {/* Favorites Active Notice */}
        {showFavoritesOnly && (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            padding: '16px 24px',
            borderRadius: '12px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <Heart size={16} className="fill-current text-red-500" />
              <span>Mostrando únicamente unidades en <strong>Favoritos</strong> ({favorites.length})</span>
            </div>
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="btn-pill"
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Map View Frame */}
        {showMap && (
          <div className="map-frame" style={{ marginTop: !isHomepage ? '120px' : '0' }}>
            <PropertyMapView
              listings={data.listings.filter((l) => l.sectionId === 'propiedades')}
              onSelectListing={(item) => setSelectedListing(item)}
            />
          </div>
        )}

        {/* PERFECT HIGH-CONVERSION CUSTOMER FUNNEL */}
        {isHomepage ? (
          <div>
            {/* FUNNEL STAGE 3: ⚡ BAJARON DE PRECIO (Urgency & Immediate Opportunities) */}
            <PriceDropShowcaseSection
              onSelectListing={(item) => setSelectedListing(item)}
            />

            {/* FUNNEL STAGE 4: Confianza Institucional (Agustín Fidalgo - 180+ Operaciones) */}
            <WhyChooseUsSection />

            {/* FUNNEL STAGE 5: Garaje de Autos de Luxe */}
            <div ref={autosRef}>
              <AutosCarouselShowcase
                listings={allAutosListings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onSelectListing={(item) => setSelectedListing(item)}
                onViewAll={() => setActiveSection('autos')}
              />
            </div>

            {/* FUNNEL STAGE 6: Retención Visual & Filosofía ("No somos un concesionario tradicional") */}
            <StaggeredShowcaseSection
              onOpenCatalog={() => setActiveSection('autos')}
            />

            {/* FUNNEL STAGE 7: Residencias de Autor & Penthouses */}
            <div ref={propiedadesRef}>
              <PropiedadesShowcase
                listings={allPropiedadesListings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onSelectListing={(item) => setSelectedListing(item)}
                onViewAll={() => setActiveSection('propiedades')}
                onToggleMap={() => setShowMap(!showMap)}
              />
            </div>

            {/* FUNNEL STAGE 8: Inversiones & Desarrollo (Retorno Estimado 14-17%) */}
            <InvestmentsShowcaseSection
              onOpenContact={() => {
                const dummyItem = {
                  id: 'inv_contact',
                  title: 'Inversiones & Desarrollo',
                  location: 'Tucumán, Salta y Buenos Aires',
                  price: 18000,
                  images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
                  sectionId: 'propiedades'
                };
                setSelectedListing(dummyItem);
              }}
            />

            {/* FUNNEL STAGE 9: Prueba Social (Reseñas Reales) */}
            <TestimonialsSection />

            {/* FUNNEL STAGE 10: Cierre de Conversión (Informes de Mercado + WhatsApp Directo Agustín) */}
            <BlogAndConciergeSection />

            {/* Dynamic Product Sections if any */}
            {dynamicOtherListings.length > 0 && (
              <section style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                  <Layers size={22} />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>
                    SECCIONES ESPECIALES DE PRODUCTOS
                  </h2>
                </div>
                <div className="cards-grid">
                  {dynamicOtherListings.map((item) => (
                    <ListingCard
                      key={item.id}
                      item={item}
                      isFavorite={favorites.includes(item.id)}
                      onToggleFavorite={toggleFavorite}
                      onSelect={(selected) => setSelectedListing(selected)}
                      layout="grid"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* DEDICATED CATALOG VIEW */
          <div>
            <CatalogHeaderBanner
              activeSection={activeSection}
              onBackToHome={() => {
                setActiveSection('all');
                handleResetFilters();
              }}
              totalCount={filteredListings.length}
              viewLayout={viewLayout}
              setViewLayout={setViewLayout}
              showMap={showMap}
              setShowMap={setShowMap}
            />

            {filteredListings.length === 0 ? (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                <AlertCircle size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Sin resultados para esta selección</h3>
                <button className="btn-pill btn-pill-dark" onClick={handleResetFilters}>
                  Restablecer Búsqueda
                </button>
              </div>
            ) : (
              <div className={viewLayout === 'grid' ? 'cards-grid' : 'cards-list'} style={{ marginBottom: '60px' }}>
                {filteredListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={(selected) => setSelectedListing(selected)}
                    layout={viewLayout}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedListing && (
        <ListingDetailsModal
          item={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {/* Footer */}
      <footer className="editorial-footer">
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '4px' }}>AF • Selection</h2>
            <p style={{ color: 'var(--text-light-muted)', fontSize: '0.88rem' }}>Automotive & Real Estate Portfolio</p>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light-muted)' }}>
            © 2026 AF Selection Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
