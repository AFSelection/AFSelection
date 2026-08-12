import React from 'react';
import { Car, Home, Layers, MapPin } from 'lucide-react';

export default function SectionsCategoryBar({
  sections,
  activeSection,
  setActiveSection,
  onToggleMap,
  showMap
}) {
  const getSectionIcon = (iconName) => {
    switch (iconName) {
      case 'Car': return <Car size={24} />;
      case 'Home': return <Home size={24} />;
      default: return <Layers size={24} />;
    }
  };

  const getSectionBgImage = (secId) => {
    if (secId === 'autos') {
      return 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80';
    }
    if (secId === 'propiedades') {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <section style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            EXPLORÁ POR SECCIÓN
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>
            SECCIONES DE PRODUCTOS
          </h2>
        </div>

        <button
          className={`btn-pill ${activeSection === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSection('all')}
        >
          <span>Todas las Secciones</span>
        </button>
      </div>

      {/* Mercado Libre Inspired Category Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* Autos Card */}
        <div
          onClick={() => setActiveSection('autos')}
          style={{
            position: 'relative',
            height: '180px',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: activeSection === 'autos' ? '2px solid var(--text-main)' : '1px solid var(--border-light)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: `linear-gradient(180deg, rgba(17, 19, 23, 0.4) 0%, rgba(17, 19, 23, 0.85) 100%), url("${getSectionBgImage('autos')}") center/cover no-repeat`,
            color: '#FFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '99px' }}>
              01 / VEHÍCULOS
            </span>
            <Car size={24} style={{ color: 'var(--accent-gold)' }} />
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF' }}>AUTOS DE LUJO</h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Deportivos, SUVs & Pick-ups</p>
          </div>
        </div>

        {/* Propiedades Card */}
        <div
          onClick={() => setActiveSection('propiedades')}
          style={{
            position: 'relative',
            height: '180px',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: activeSection === 'propiedades' ? '2px solid var(--text-main)' : '1px solid var(--border-light)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: `linear-gradient(180deg, rgba(17, 19, 23, 0.4) 0%, rgba(17, 19, 23, 0.85) 100%), url("${getSectionBgImage('propiedades')}") center/cover no-repeat`,
            color: '#FFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '99px' }}>
              02 / INMUEBLES
            </span>
            <Home size={24} style={{ color: 'var(--accent-gold)' }} />
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF' }}>PROPIEDADES</h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Casas, Penthouses & Terrenos</p>
          </div>
        </div>

        {/* Dynamic Custom Sections */}
        {sections.filter((s) => s.id !== 'autos' && s.id !== 'propiedades').map((sec) => (
          <div
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              position: 'relative',
              height: '180px',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: activeSection === sec.id ? '2px solid var(--text-main)' : '1px solid var(--border-light)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: `linear-gradient(180deg, rgba(17, 19, 23, 0.4) 0%, rgba(17, 19, 23, 0.85) 100%), url("${getSectionBgImage(sec.id)}") center/cover no-repeat`,
              color: '#FFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '99px' }}>
                NUEVA SECCIÓN
              </span>
              {getSectionIcon(sec.icon)}
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF' }}>{sec.name.toUpperCase()}</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{sec.categories?.join(', ')}</p>
            </div>
          </div>
        ))}

        {/* Interactive Property Map Card */}
        <div
          onClick={onToggleMap}
          style={{
            position: 'relative',
            height: '180px',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: showMap ? '2px solid var(--accent-gold)' : '1px solid var(--border-light)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-dark)',
            color: '#FFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--accent-gold)', color: '#111317', padding: '4px 10px', borderRadius: '99px' }}>
              GEO-MAP
            </span>
            <MapPin size={24} style={{ color: 'var(--accent-gold)' }} />
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF' }}>MAPA INTERACTIVO</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light-muted)' }}>Explorar propiedades en el mapa</p>
          </div>
        </div>
      </div>
    </section>
  );
}
