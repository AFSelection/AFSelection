import React from 'react';
import { ShieldCheck, UserCheck, Award, MessageSquare } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

export default function AboutPage() {
  const whatsappUrl = getWhatsAppUrl("Hola Agustín, estuve leyendo sobre AF Select y quisiera ponerme en contacto.");

  return (
    <div className="about-page-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-canvas)', paddingTop: '140px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Editorial Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '0.9rem', 
            fontWeight: 800, 
            letterSpacing: '0.2em', 
            color: 'var(--text-secondary)',
            textTransform: 'uppercase'
          }}>
            NUESTRA HISTORIA Y FILOSOFÍA
          </span>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '3.5rem', 
            fontWeight: 900, 
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginTop: '16px',
            marginBottom: '24px',
            letterSpacing: '-0.03em'
          }}>
            AF <span style={{ color: '#DC2626' }}>•</span> SELECT
          </h1>
          <div style={{ width: '40px', height: '2px', background: 'var(--text-primary)', margin: '0 auto 30px' }} />
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-primary)', 
            maxWidth: '720px', 
            margin: '0 auto', 
            lineHeight: 1.6,
            fontWeight: 500,
            opacity: 0.8
          }}>
            Establecemos un nuevo estándar en el corretaje y curaduría de activos de alta gama. Conectamos propiedades de autor y vehículos de colección con compradores exigentes bajo discreción absoluta.
          </p>
        </div>

        {/* Agustín Fidalgo Card & Profile */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-light)', 
          borderRadius: '24px', 
          padding: '48px', 
          marginBottom: '60px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px'
        }} className="about-profile-grid">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ 
              color: '#DC2626', 
              fontSize: '0.75rem', 
              fontWeight: 900, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              BROKER FUNDADOR
            </span>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '2rem', 
              fontWeight: 900, 
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '20px'
            }}>
              Agustín Fidalgo
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
              Con más de 8 años de trayectoria y más de 180 operaciones cerradas con éxito, Agustín Fidalgo fundó **AF Select** como respuesta a una necesidad insatisfecha en el mercado de alta gama: un trato directo, libre de intermediarios innecesarios y basado en la curaduría rigurosa.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              Operamos principalmente en **Tucumán, Salta y Buenos Aires**, gestionando tanto publicaciones públicas en nuestro catálogo como transacciones confidenciales "off-market" para clientes selectos que valoran la privacidad por encima de todo.
            </p>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>180+</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operaciones</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border-light)' }} />
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>8+ Años</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experiencia</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border-light)' }} />
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>3 Regiones</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tuc / Salta / BsAs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Pillars Grid */}
        <div style={{ marginBottom: '80px' }}>
          <h3 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.5rem', 
            fontWeight: 900, 
            color: 'var(--text-primary)',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Nuestros Tres Pilares Operativos
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-light)', 
              borderRadius: '20px', 
              padding: '30px'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'rgba(220, 38, 38, 0.05)', 
                color: '#DC2626',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Award size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Curaduría Estricta
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                No listamos cualquier activo. Cada vehículo pasa por peritajes de dominio, titularidad y motor. Cada inmueble es verificado técnica y notarialmente antes de ser expuesto.
              </p>
            </div>

            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-light)', 
              borderRadius: '20px', 
              padding: '30px'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'rgba(220, 38, 38, 0.05)', 
                color: '#DC2626',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Discreción Off-Market
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Gran parte de nuestros activos más exclusivos no están publicados de forma abierta en internet. Los gestionamos mediante ofertas privadas y directas para resguardar la privacidad.
              </p>
            </div>

            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-light)', 
              borderRadius: '20px', 
              padding: '30px'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'rgba(220, 38, 38, 0.05)', 
                color: '#DC2626',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <UserCheck size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Negociación 1-a-1
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Sin vendedores de salón ni secretarias intermediarias. Cada llamada, visita y acuerdo contractual es atendido de principio a fin de forma personal por Agustín Fidalgo.
              </p>
            </div>
          </div>
        </div>

        {/* Concierge Block CTA */}
        <div style={{ 
          background: 'linear-gradient(135deg, #18191c 0%, #0d0e10 100%)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '28px', 
          padding: '48px', 
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <h3 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.8rem', 
            fontWeight: 900, 
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            ¿Buscás una unidad o propiedad a medida?
          </h3>
          <p style={{ 
            fontSize: '0.95rem', 
            color: 'rgba(255,255,255,0.7)', 
            maxWidth: '600px', 
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            Si no encontrás el auto o residencia ideal en nuestro catálogo público, activamos nuestro servicio de Concierge. Cuéntanos qué buscas y nosotros lo encontramos.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill"
              style={{ 
                background: '#ffffff', 
                color: '#0d0e10', 
                border: 'none', 
                padding: '14px 28px', 
                fontWeight: 800, 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <MessageSquare size={16} />
              <span>Contactar a Agustín</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
