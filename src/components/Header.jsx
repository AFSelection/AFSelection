import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Heart, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Header({
  sections = [],
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  onOpenFavorites,
  isVisible,
  onGoToSell,
  onGoToAbout,
  onGoToContact,
  onScrollToSection,
  listings = [],
  onSelectListing
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Keep local search sync with parent when it is reset
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileNavClick = (callback) => {
    callback();
    setMobileMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setActiveSection('all');
    setSearchQuery('');
    setLocalQuery('');
    if (onScrollToSection) {
      onScrollToSection('hero');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get matching items for autocomplete dropdown
  const matchingListings = useMemo(() => {
    if (!localQuery.trim()) return [];
    const q = localQuery.toLowerCase();
    return listings.filter(item => 
      item.title?.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    ).slice(0, 4); // Limit to top 4 results for a clean compact list
  }, [localQuery, listings]);

  const handleTriggerSearch = () => {
    setSearchQuery(localQuery);
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleSelectItem = (item) => {
    if (onSelectListing) {
      onSelectListing(item);
    }
    setShowDropdown(false);
    setMobileMenuOpen(false);
    setLocalQuery('');
  };

  const formatPrice = (val) => {
    if (!val) return '';
    return 'USD ' + val.toLocaleString();
  };

  return (
    <>
      <header className={`editorial-header ${isVisible ? 'visible-nav' : 'hidden-nav'}`}>
        <div className="header-inner header-redesign-grid">
          
          {/* LEFT: Desktop navigation tabs */}
          <nav className="header-left-nav desktop-nav-only">
            <button
              className={`nav-tab-btn ${activeSection === 'todos' || activeSection === 'all' ? 'active' : ''}`}
              onClick={() => {
                if (setActiveSection) setActiveSection('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span>Todos</span>
            </button>

            <button
              className={`nav-tab-btn ${activeSection === 'autos' ? 'active' : ''}`}
              onClick={() => {
                if (setActiveSection) setActiveSection('autos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span>Autos</span>
            </button>

            <button
              className={`nav-tab-btn ${activeSection === 'propiedades' ? 'active' : ''}`}
              onClick={() => {
                if (setActiveSection) setActiveSection('propiedades');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span>Propiedades</span>
            </button>

            {sections && sections.filter(s => s.id !== 'autos' && s.id !== 'propiedades').map(sec => (
              <button
                key={sec.id}
                className={`nav-tab-btn ${activeSection === sec.id ? 'active' : ''}`}
                onClick={() => {
                  if (setActiveSection) setActiveSection(sec.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>{sec.name}</span>
              </button>
            ))}


            <button
              className="nav-tab-btn"
              onClick={() => onGoToAbout && onGoToAbout()}
            >
              <span>Nosotros</span>
            </button>

            <button
              className="nav-tab-btn nav-tab-sell"
              onClick={onGoToSell}
              style={{ color: '#DC2626', fontWeight: 800 }}
            >
              <span>Vender</span>
            </button>
          </nav>

          {/* MOBILE LEFT: Hamburger Menu Icon */}
          <div className="mobile-only-action-left">
            <button
              className="btn-mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* CENTER: Centered Logo */}
          <div className="header-centered-logo">
            <a href="#" className="brand-logo" onClick={handleLogoClick}>
              <span className="logo-text-bold">AF</span>
              <span className="brand-dot-black" />
              <span className="logo-text-light">SELECT</span>
            </a>
          </div>

          {/* RIGHT: Search input with dropdown + Favorites count */}
          <div className="header-right-actions desktop-nav-only" ref={desktopSearchRef} style={{ position: 'relative' }}>
            <div className="search-wrapper" style={{ position: 'relative' }}>
              <div className="search-pill compact-search">
                <Search className="search-icon" size={15} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={localQuery}
                  onChange={(e) => { setLocalQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleTriggerSearch(); }}
                />
              </div>

              {/* Desktop Autocomplete Dropdown */}
              {localQuery.trim() !== '' && showDropdown && (
                <div className="search-autocomplete-dropdown">
                  {matchingListings.length === 0 ? (
                    <div className="autocomplete-no-results">Sin resultados para "{localQuery}"</div>
                  ) : (
                    <>
                      <div className="autocomplete-results-list">
                        {matchingListings.map(item => (
                          <div
                            key={item.id}
                            className="autocomplete-result-item"
                            onClick={() => handleSelectItem(item)}
                          >
                            <img
                              src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=80&q=80'}
                              alt=""
                              className="result-thumb"
                            />
                            <div className="result-info">
                              <span className="result-title">{item.title}</span>
                              <span className="result-price">{formatPrice(item.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="autocomplete-view-all-btn"
                        onClick={handleTriggerSearch}
                      >
                        <span>Ver todo</span>
                        <ArrowRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button className="nav-tab-btn nav-tab-fav" onClick={onOpenFavorites} style={{ marginLeft: '8px' }}>
              <Heart size={14} className={favoritesCount > 0 ? 'fill-current text-red-500' : ''} />
              <span>Favoritos ({favoritesCount})</span>
            </button>

            <button className="nav-tab-btn nav-tab-contact" onClick={onGoToContact} style={{ marginLeft: '8px', fontWeight: 700 }}>
              <span>Contacto</span>
            </button>
          </div>

          {/* MOBILE RIGHT: Favorites Button */}
          <div className="mobile-only-action-right">
            <button
              className="btn-mobile-fav"
              onClick={onOpenFavorites}
              title="Favoritos"
            >
              <Heart size={18} className={favoritesCount > 0 ? 'fill-current text-red-500' : ''} />
              {favoritesCount > 0 && <span className="mobile-fav-badge">{favoritesCount}</span>}
            </button>
          </div>

        </div>
      </header>

      {/* Luxury Fullscreen Mobile Hamburger Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <a
              href="#"
              className="brand-logo mobile-drawer-logo"
              onClick={(e) => {
                e.preventDefault();
                handleMobileNavClick(() => {
                  setActiveSection('all');
                  setSearchQuery('');
                  setLocalQuery('');
                });
              }}
            >
              <span className="logo-text-bold">AF</span>
              <span className="brand-dot-gold" style={{ backgroundColor: '#EF4444' }} />
              <span className="logo-text-light">SELECT</span>
            </a>

            <button
              className="btn-mobile-close"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="mobile-menu-body">
            {/* Mobile Drawer Search Bar */}
            <div className="mobile-drawer-search" ref={mobileSearchRef} style={{ position: 'relative' }}>
              <Search size={18} className="search-icon-muted" />
              <input
                type="text"
                placeholder="Buscar..."
                value={localQuery}
                onChange={(e) => { setLocalQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTriggerSearch(); }}
              />

              {/* Mobile Autocomplete Dropdown */}
              {localQuery.trim() !== '' && showDropdown && (
                <div className="search-autocomplete-dropdown mobile-autocomplete">
                  {matchingListings.length === 0 ? (
                    <div className="autocomplete-no-results">Sin resultados para "{localQuery}"</div>
                  ) : (
                    <>
                      <div className="autocomplete-results-list">
                        {matchingListings.map(item => (
                          <div
                            key={item.id}
                            className="autocomplete-result-item"
                            onClick={() => handleSelectItem(item)}
                          >
                            <img
                              src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=80&q=80'}
                              alt=""
                              className="result-thumb"
                            />
                            <div className="result-info">
                              <span className="result-title">{item.title}</span>
                              <span className="result-price">{formatPrice(item.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="autocomplete-view-all-btn"
                        onClick={handleTriggerSearch}
                      >
                        <span>Ver todo</span>
                        <ArrowRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="mobile-nav-links-list">
              <button
                className={`mobile-nav-item ${activeSection === 'todos' ? 'active' : ''}`}
                onClick={() => handleMobileNavClick(() => {
                  if (setActiveSection) setActiveSection('todos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                })}
              >
                <span className="mob-item-num">01</span>
                <span className="mob-item-title">TODOS LOS ACTIVOS</span>
                <ArrowRight size={18} className="mob-arrow" />
              </button>

              <button
                className={`mobile-nav-item ${activeSection === 'autos' ? 'active' : ''}`}
                onClick={() => handleMobileNavClick(() => {
                  if (setActiveSection) setActiveSection('autos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                })}
              >
                <span className="mob-item-num">02</span>
                <span className="mob-item-title">AUTOS</span>
                <ArrowRight size={18} className="mob-arrow" />
              </button>

              <button
                className={`mobile-nav-item ${activeSection === 'propiedades' ? 'active' : ''}`}
                onClick={() => handleMobileNavClick(() => {
                  if (setActiveSection) setActiveSection('propiedades');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                })}
              >
                <span className="mob-item-num">03</span>
                <span className="mob-item-title">PROPIEDADES</span>
                <ArrowRight size={18} className="mob-arrow" />
              </button>

              <button
                className="mobile-nav-item"
                onClick={() => handleMobileNavClick(() => onGoToAbout && onGoToAbout())}
              >
                <span className="mob-item-num">04</span>
                <span className="mob-item-title">NOSOTROS</span>
                <ArrowRight size={18} className="mob-arrow" />
              </button>

              <button
                className="mobile-nav-item"
                onClick={() => handleMobileNavClick(onGoToSell)}
                style={{ border: '1px solid rgba(239, 68, 68, 0.4)' }}
              >
                <span className="mob-item-num" style={{ color: '#EF4444' }}>05</span>
                <span className="mob-item-title" style={{ color: '#EF4444' }}>VENDER MI ACTIVO</span>
                <ArrowRight size={18} className="mob-arrow" style={{ color: '#EF4444' }} />
              </button>

              <button
                className="mobile-nav-item"
                onClick={() => handleMobileNavClick(() => onGoToContact && onGoToContact())}
              >
                <span className="mob-item-num">06</span>
                <span className="mob-item-title">CONTACTO</span>
                <ArrowRight size={18} className="mob-arrow" />
              </button>

              <button
                className="mobile-nav-item"
                onClick={() => handleMobileNavClick(onOpenFavorites)}
              >
                <span className="mob-item-num">06</span>
                <span className="mob-item-title">MIS FAVORITOS ({favoritesCount})</span>
                <Heart size={18} className="mob-arrow" />
              </button>
            </div>

            {/* Footer Box */}
            <div className="mobile-drawer-footer">
              <div className="mob-concierge-pill">
                <ShieldCheck size={14} />
                <span>TRATO DIRECTO CON AGUSTÍN FIDALGO</span>
              </div>
              <p className="mob-footer-desc">
                Atención personalizada las 24 hs en Tucumán, Salta y Buenos Aires.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
