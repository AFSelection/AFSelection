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
import ProductDetailPage from './components/ProductDetailPage';
import SellFormPage from './components/SellFormPage';
import PropertyMapView from './components/PropertyMapView';
import { fetchListings } from './services/storage';
import { Heart, X, AlertCircle, Layers } from 'lucide-react';

export default function App() {
  const [data, setData] = useState({ sections: [], listings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const listings = await fetchListings();
        setData({
          sections: [
            { id: 'autos', name: 'Autos', icon: 'Car' },
            { id: 'propiedades', name: 'Propiedades', icon: 'Home' }
          ],
          listings
        });
      } catch (err) {
        console.error('Error loading Supabase listings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [activeSection, setActiveSection] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);
  const [showSellPage, setShowSellPage] = useState(false);
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
  const whyChooseUsRef = useRef(null);

  const scrollToSection = (sec) => {
    // Reset view states first so we are on the homepage
    setSelectedListing(null);
    setShowSellPage(false);
    setShowFavoritesOnly(false);
    setSearchQuery('');
    
    if (sec === 'hero') {
      setActiveSection('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Set activeSection to 'all' so that all sections are visible on the homepage
    setActiveSection('all');

    // Wait a brief timeout for render update, then scroll
    setTimeout(() => {
      let targetRef = null;
      if (sec === 'autos') targetRef = autosRef;
      if (sec === 'propiedades') targetRef = propiedadesRef;
      if (sec === 'por-que-elegirnos' || sec === 'nosotros') targetRef = whyChooseUsRef;

      if (targetRef && targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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

  const isHomepage = activeSection === 'all' && !showFavoritesOnly && searchQuery.trim() === '' && !selectedListing && !showSellPage;

  return (
    <div>
      {/* Floating Header */}
      <Header
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          setSelectedCategory('all');
          if (sec !== 'propiedades') setShowMap(false);
          setSelectedListing(null);
          setShowSellPage(false);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setSelectedListing(null);
          setShowSellPage(false);
        }}
        favoritesCount={favorites.length}
        showMap={showMap}
        setShowMap={setShowMap}
        onOpenFavorites={() => {
          setShowFavoritesOnly(!showFavoritesOnly);
          setSelectedListing(null);
          setShowSellPage(false);
        }}
        isVisible={!isHomepage || showScrolledNav}
        onGoToSell={() => {
          setShowSellPage(true);
          setSelectedListing(null);
        }}
        onScrollToSection={scrollToSection}
        listings={data.listings || []}
        onSelectListing={(item) => setSelectedListing(item)}
      />

      <main className="main-wrapper" style={{ paddingTop: '0' }}>
        {/* FUNNEL STAGE 1: Full Viewport Monumental Hero Banner */}
        {isHomepage && (
          <BannerHero
            onScrollToSection={scrollToSection}
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
        {showMap && !selectedListing && !showSellPage && (
          <div className="map-frame" style={{ marginTop: !isHomepage ? '120px' : '0' }}>
            <PropertyMapView
              listings={data.listings.filter((l) => l.sectionId === 'propiedades')}
              onSelectListing={(item) => setSelectedListing(item)}
            />
          </div>
        )}

        {showSellPage ? (
          <SellFormPage onBack={() => setShowSellPage(false)} />
        ) : selectedListing ? (
          <ProductDetailPage
            item={selectedListing}
            onBack={() => setSelectedListing(null)}
            onGoToSell={() => {
              setSelectedListing(null);
              setShowSellPage(true);
            }}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onSelectListing={(item) => setSelectedListing(item)}
            listings={data.listings || []}
          />
        ) : isHomepage ? (
          <div>
            {/* FUNNEL STAGE 3: ⚡ BAJARON DE PRECIO (Urgency & Immediate Opportunities) */}
            <PriceDropShowcaseSection
              onSelectListing={(item) => setSelectedListing(item)}
            />

            {/* FUNNEL STAGE 4: Garaje de Autos de Luxe */}
            <div ref={autosRef}>
              <AutosCarouselShowcase
                listings={allAutosListings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onSelectListing={(item) => setSelectedListing(item)}
                onViewAll={() => setActiveSection('autos')}
              />
            </div>

            {/* FUNNEL STAGE 5: Retención Visual & Filosofía */}
            <StaggeredShowcaseSection
              onOpenCatalog={() => setActiveSection('autos')}
            />

            {/* FUNNEL STAGE 6: Residencias de Autor & Penthouses */}
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

            {/* FUNNEL STAGE 7: Inversiones & Desarrollo (Retorno Estimado 14-17%) */}
            <InvestmentsShowcaseSection
              onOpenContact={() => {
                const dummyItem = {
                  id: 'inv_contact',
                  title: 'Inversiones & Desarrollo',
                  location: 'Tucumán, Salta y Buenos Aires',
                  price: 180000,
                  images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
                  sectionId: 'propiedades'
                };
                setSelectedListing(dummyItem);
              }}
            />

            {/* FUNNEL STAGE 8: Prueba Social (Reseñas Reales) */}
            <TestimonialsSection />

            {/* FUNNEL STAGE 9: Confianza Institucional (Agustín Fidalgo - 180+ Operaciones) MOVED RIGHT ABOVE CONCIERGE AS REQUESTED */}
            <div ref={whyChooseUsRef}>
              <WhyChooseUsSection />
            </div>

            {/* FUNNEL STAGE 10: Cierre de Conversión (Informes de Mercado + WhatsApp Directo Agustín - ¿Buscás algo puntual?) */}
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
              searchQuery={searchQuery}
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

      {/* Floating WhatsApp Button (Reveals AFTER scrolling past Hero) */}
      <a
        href="https://wa.me/5493810000000?text=Hola%20Agust%C3%ADn,%20quisiera%20consultar%20por%20un%20activo%20en%20AF%20Selection"
        target="_blank"
        rel="noopener noreferrer"
        className={`floating-whatsapp-btn ${showScrolledNav ? 'visible' : ''}`}
        title="Consultar por WhatsApp con Agustín Fidalgo"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" style={{ display: 'block', flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>WhatsApp Directo</span>
      </a>
    </div>
  );
}
