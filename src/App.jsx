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
import MapSplitView from './components/MapSplitView';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import InquiryModal from './components/InquiryModal';
import { fetchListings } from './services/storage';
import { getWhatsAppUrl } from './utils/whatsapp';
import { Heart, X, AlertCircle, Layers } from 'lucide-react';
import Loader from './components/Loader';

export default function App() {
  const [data, setData] = useState({ sections: [], listings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const listings = await fetchListings();
        setData({
          sections: [
            { id: 'autos',        name: 'Autos',       icon: 'Car'       },
            { id: 'propiedades',  name: 'Propiedades', icon: 'Home'      },
            { id: 'inversiones',  name: 'Inversiones', icon: 'TrendingUp'}
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
  const [sortBy, setSortBy] = useState('recent');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filterRooms, setFilterRooms] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [filterOperationType, setFilterOperationType] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterFuel, setFilterFuel] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);
  const [showSellPage, setShowSellPage] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [inquiryItem, setInquiryItem] = useState(null);
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

  const setUrlPath = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  const handleBackToHome = () => {
    setSelectedListing(null);
    setShowSellPage(false);
    setShowAboutPage(false);
    setShowContactPage(false);
    setActiveSection('all');
    setShowFavoritesOnly(false);
    setSearchQuery('');
    setUrlPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Centralized Navigation Handlers with Clean URL Persistence
  const handleSelectListing = (item) => {
    if (item) {
      setSelectedListing(item);
      setShowSellPage(false);
      setShowAboutPage(false);
      setShowContactPage(false);
      setUrlPath(`/producto/${item.id}`);
      window.scrollTo(0, 0);
    } else {
      setSelectedListing(null);
      setShowSellPage(false);
      setShowAboutPage(false);
      setShowContactPage(false);
      if (window.location.pathname.startsWith('/producto/')) {
        setUrlPath('/');
      }
      window.scrollTo(0, 0);
    }
  };

  const handleOpenSell = () => {
    setShowSellPage(true);
    setSelectedListing(null);
    setShowAboutPage(false);
    setShowContactPage(false);
    setUrlPath('/vender');
    window.scrollTo(0, 0);
  };

  const handleOpenAbout = () => {
    setShowAboutPage(true);
    setSelectedListing(null);
    setShowSellPage(false);
    setShowContactPage(false);
    setActiveSection('all');
    setShowFavoritesOnly(false);
    setSearchQuery('');
    setUrlPath('/nosotros');
    window.scrollTo(0, 0);
  };

  const handleOpenContact = () => {
    setShowContactPage(true);
    setSelectedListing(null);
    setShowSellPage(false);
    setShowAboutPage(false);
    setActiveSection('all');
    setShowFavoritesOnly(false);
    setSearchQuery('');
    setUrlPath('/contacto');
    window.scrollTo(0, 0);
  };

  // Sync URL path state on initial load and browser refresh/navigation
  useEffect(() => {
    if (loading || !data.listings || data.listings.length === 0) return;

    const syncPathState = () => {
      // Clean up legacy hash if present (e.g. /#/vender -> /vender)
      if (window.location.hash) {
        const legacyHash = window.location.hash.replace(/^#/, '');
        window.history.replaceState({}, '', legacyHash || '/');
      }

      const path = window.location.pathname || '/';

      if (path.startsWith('/producto/')) {
        const id = path.replace('/producto/', '').trim();
        const found = data.listings.find((l) => String(l.id) === String(id));
        if (found) {
          setSelectedListing(found);
          setShowSellPage(false);
          setShowAboutPage(false);
          window.scrollTo(0, 0);
        }
      } else if (path === '/vender') {
        setShowSellPage(true);
        setSelectedListing(null);
        setShowAboutPage(false);
        window.scrollTo(0, 0);
      } else if (path === '/nosotros') {
        setShowAboutPage(true);
        setSelectedListing(null);
        setShowSellPage(false);
        setShowContactPage(false);
        window.scrollTo(0, 0);
      } else if (path === '/contacto') {
        setShowContactPage(true);
        setSelectedListing(null);
        setShowSellPage(false);
        setShowAboutPage(false);
        window.scrollTo(0, 0);
      } else if (path === '/autos') {
        setActiveSection('autos');
        setSelectedListing(null);
        setShowSellPage(false);
        setShowAboutPage(false);
        setShowContactPage(false);
      } else if (path === '/propiedades') {
        setActiveSection('propiedades');
        setSelectedListing(null);
        setShowSellPage(false);
        setShowAboutPage(false);
      }
    };

    syncPathState();
    window.addEventListener('popstate', syncPathState);
    return () => window.removeEventListener('popstate', syncPathState);
  }, [loading, data.listings]);

  const scrollToSection = (sec) => {
    // Reset view states first so we are on the homepage
    handleSelectListing(null);
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
    setSortBy('recent');
    setPriceMin('');
    setPriceMax('');
    setFilterRooms('all');
    setFilterCurrency('all');
    setFilterOperationType('all');
    setFilterCondition('all');
    setFilterFuel('all');
  };

  const filteredListings = useMemo(() => {
    const filtered = (data.listings || []).filter((item) => {
      // 'todos' or 'all' = show all sections (autos, propiedades, inversiones)
      if (activeSection === 'propiedades') {
        // In propiedades view, show both propiedades and inversiones
        if (item.sectionId !== 'propiedades' && item.sectionId !== 'inversiones') return false;
      } else if (activeSection !== 'all' && activeSection !== 'todos') {
        if (item.sectionId !== activeSection) return false;
      }

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'inversiones') {
          if (item.sectionId !== 'inversiones') return false;
        } else if (selectedCategory === 'propiedades') {
          if (item.sectionId !== 'propiedades') return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      if (showFavoritesOnly && !favorites.includes(item.id)) return false;
      if (priceMin !== '' && (item.price ?? 0) < Number(priceMin)) return false;
      if (priceMax !== '' && (item.price ?? 0) > Number(priceMax)) return false;
      if (filterCurrency !== 'all' && item.currency !== filterCurrency) return false;

      // Autos-specific filters
      if (item.sectionId === 'autos') {
        if (filterCondition !== 'all' && item.condition !== filterCondition) return false;
        if (filterFuel !== 'all' && item.fuel !== filterFuel) return false;
      }

      // Propiedades/Inversiones specific filters
      if (item.sectionId === 'propiedades' || item.sectionId === 'inversiones') {
        if (filterOperationType !== 'all' && item.operationType && item.operationType !== filterOperationType) return false;
        if (filterRooms !== 'all') {
          const r = item.rooms ?? 0;
          if (filterRooms === '5+') { if (r < 5) return false; }
          else if (r !== Number(filterRooms)) return false;
        }
      }

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

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price_asc':  sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case 'price_desc': sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case 'year_desc':  sorted.sort((a, b) => (b.year  ?? 0) - (a.year  ?? 0)); break;
      case 'km_asc':     sorted.sort((a, b) => (a.kilometers ?? 0) - (b.kilometers ?? 0)); break;
      default: break;
    }
    return sorted;
  }, [data.listings, activeSection, selectedCategory, searchQuery, showFavoritesOnly, favorites, sortBy, priceMin, priceMax, filterRooms, filterCurrency, filterOperationType, filterCondition, filterFuel]);

  // Dataset splits for Homepage Carousels
  const allAutosListings = useMemo(() => {
    return (data.listings || []).filter((l) => l.sectionId === 'autos');
  }, [data.listings]);

  const allPropiedadesListings = useMemo(() => {
    return (data.listings || []).filter((l) => l.sectionId === 'propiedades');
  }, [data.listings]);

  const allInversionesListings = useMemo(() => {
    return (data.listings || []).filter((l) => l.sectionId === 'inversiones');
  }, [data.listings]);

  // Dynamic categories for the active section (unfiltered, for stable chip list)
  const availableCategories = useMemo(() => {
    let src = data.listings || [];
    if (activeSection === 'propiedades') {
      src = src.filter((l) => l.sectionId === 'propiedades' || l.sectionId === 'inversiones');
    } else if (activeSection === 'autos') {
      src = src.filter((l) => l.sectionId === 'autos');
    } else if (activeSection === 'inversiones') {
      src = src.filter((l) => l.sectionId === 'inversiones');
    }
    return [...new Set(src.map((l) => l.category).filter(Boolean))].sort();
  }, [activeSection, data.listings]);

  const dynamicOtherListings = useMemo(() => {
    return (data.listings || []).filter((l) => l.sectionId !== 'autos' && l.sectionId !== 'propiedades');
  }, [data.listings]);

  const isHomepage = activeSection === 'all' && !showFavoritesOnly && searchQuery.trim() === '' && !selectedListing && !showSellPage && !showAboutPage && !showContactPage && !showMap;

  return (
    <div>
      <Loader visible={loading} />

      {/* Floating Header */}
      <Header
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          setSelectedCategory('all');
          setSortBy('recent');
          setShowMap(false);
          handleSelectListing(null);
          setShowSellPage(false);
          setShowAboutPage(false);
          setShowContactPage(false);
          setUrlPath(sec === 'all' ? '/' : `/${sec}`);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          handleSelectListing(null);
          setShowSellPage(false);
          setShowContactPage(false);
        }}
        favoritesCount={favorites.length}
        showMap={showMap}
        setShowMap={setShowMap}
        onOpenFavorites={() => {
          setShowFavoritesOnly(!showFavoritesOnly);
          handleSelectListing(null);
          setShowSellPage(false);
          setShowContactPage(false);
        }}
        isVisible={showMap || !isHomepage || showScrolledNav}
        onGoToSell={handleOpenSell}
        onGoToAbout={handleOpenAbout}
        onGoToContact={handleOpenContact}
        onScrollToSection={scrollToSection}
        listings={data.listings || []}
        onSelectListing={handleSelectListing}
      />

      {/* Map Split View — OUTSIDE main-wrapper, true full-viewport fixed overlay */}
      {showMap && !selectedListing && !showSellPage && (
        <MapSplitView
          listings={data.listings}
          onSelectListing={handleSelectListing}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onClose={() => {
            setShowMap(false);
            setActiveSection('propiedades');
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories}
          filterRooms={filterRooms}
          setFilterRooms={setFilterRooms}
          filterCurrency={filterCurrency}
          setFilterCurrency={setFilterCurrency}
          filterOperationType={filterOperationType}
          setFilterOperationType={setFilterOperationType}
        />
      )}

      <main className="main-wrapper" style={{ paddingTop: '0' }}>
        {/* FUNNEL STAGE 1: Full Viewport Monumental Hero Banner */}
        {isHomepage && (
          <BannerHero
            onScrollToSection={scrollToSection}
            onGoToSection={(sec) => {
              setActiveSection(sec);
              setSelectedCategory('all');
              setShowMap(false);
              handleSelectListing(null);
              setShowSellPage(false);
              setShowAboutPage(false);
              setUrlPath(`/${sec}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToAbout={handleOpenAbout}
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
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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


        {showContactPage ? (
          <ContactPage onBack={handleBackToHome} />
        ) : showAboutPage ? (
          <AboutPage onBack={handleBackToHome} />
        ) : showSellPage ? (
          <SellFormPage onBack={handleBackToHome} />
        ) : selectedListing ? (
          <ProductDetailPage
            item={selectedListing}
            onBack={handleBackToHome}
            onGoToSell={handleOpenSell}
            onOpenInquiry={(item) => setInquiryItem(item)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onSelectListing={handleSelectListing}
            listings={data.listings || []}
          />
        ) : isHomepage ? (
          <div>
            {/* FUNNEL STAGE 3: ⚡ BAJARON DE PRECIO (Urgency & Immediate Opportunities) */}
            <PriceDropShowcaseSection
              listings={data.listings || []}
              onSelectListing={handleSelectListing}
            />

            {/* FUNNEL STAGE 4: Garaje de Autos de Luxe */}
            <div ref={autosRef}>
              <AutosCarouselShowcase
                listings={allAutosListings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onSelectListing={handleSelectListing}
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
                onSelectListing={handleSelectListing}
                onViewAll={() => setActiveSection('propiedades')}
                onToggleMap={() => setShowMap(!showMap)}
              />
            </div>

            {/* FUNNEL STAGE 7: Inversiones & Desarrollo */}
            <InvestmentsShowcaseSection
              listings={allInversionesListings}
              onOpenContact={() => {
                const dummyItem = {
                  id: 'inv_contact',
                  title: 'Inversiones & Desarrollo',
                  location: 'Tucumán, Salta y Buenos Aires',
                  price: 180000,
                  images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
                  sectionId: 'inversiones'
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
              showMap={showMap}
              setShowMap={setShowMap}
              searchQuery={searchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              priceMin={priceMin}
              setPriceMin={setPriceMin}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              availableCategories={availableCategories}
              filterRooms={filterRooms}
              setFilterRooms={setFilterRooms}
              filterCurrency={filterCurrency}
              setFilterCurrency={setFilterCurrency}
              filterOperationType={filterOperationType}
              setFilterOperationType={setFilterOperationType}
              filterCondition={filterCondition}
              setFilterCondition={setFilterCondition}
              filterFuel={filterFuel}
              setFilterFuel={setFilterFuel}
              onResetFilters={handleResetFilters}
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
              <div className="cards-grid" style={{ marginBottom: '60px' }}>
                {filteredListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={(selected) => handleSelectListing(selected)}
                    layout="grid"
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
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '4px' }}>AF • Select</h2>
            <p style={{ color: 'var(--text-light-muted)', fontSize: '0.88rem' }}>Automotive & Real Estate Portfolio</p>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light-muted)' }}>
            © 2026 AF Select Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button (Reveals AFTER scrolling past Hero) */}
      <a
        href={getWhatsAppUrl('Hola Agustín, quisiera consultar por un activo en AF Select')}
        target="_blank"
        rel="noopener noreferrer"
        className={`floating-whatsapp-btn ${showScrolledNav ? 'visible' : ''}`}
        title="Consultar por WhatsApp con Agustín Fidalgo"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" style={{ display: 'block', flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="wtp-label">WhatsApp Directo</span>
      </a>
    </div>
  );
}
