import React, { useEffect } from 'react';

const SITE_NAME = 'AF SELECT';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://afselect.com';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`;

export default function SEOHead({ activeSection, selectedListing, showSellPage, showAboutPage, showContactPage }) {
  useEffect(() => {
    let title = `${SITE_NAME} — Vehículos de Lujo y Propiedades Exclusivas`;
    let description = 'Marketplace exclusivo de vehículos de alta gama, superdeportivos e inmuebles residenciales y comerciales de arquitectura de vanguardia.';
    let keywords = 'autos de lujo, propiedades exclusivas, bienes raices, autos deportivos, inmuebles de lujo, AF Select, supercars, real estate';
    let canonicalUrl = `${SITE_URL}${window.location.pathname}`;
    let ogImage = DEFAULT_IMAGE;
    let ogType = 'website';
    let schemaData = null;

    if (selectedListing) {
      const listingTitle = selectedListing.title || 'Publicación Exclusiva';
      const typeLabel = selectedListing.category === 'autos' || selectedListing.type === 'auto' ? 'Vehículo' : 'Propiedad';
      const formattedPrice = selectedListing.price 
        ? `${selectedListing.currency || 'USD'} ${Number(selectedListing.price).toLocaleString()}`
        : '';

      title = `${listingTitle} ${formattedPrice ? `(${formattedPrice})` : ''} | ${SITE_NAME}`;
      description = selectedListing.description 
        ? selectedListing.description.slice(0, 160) + (selectedListing.description.length > 160 ? '...' : '')
        : `${typeLabel} exclusivo disponible en ${SITE_NAME}. Descubre los detalles completos, ficha técnica y fotos en alta resolución.`;
      
      if (selectedListing.images && selectedListing.images.length > 0) {
        ogImage = selectedListing.images[0];
      } else if (selectedListing.image) {
        ogImage = selectedListing.image;
      }

      canonicalUrl = `${SITE_URL}/producto/${selectedListing.id}`;
      ogType = selectedListing.category === 'autos' ? 'product' : 'article';

      // Build JSON-LD Schema based on category
      const isAuto = selectedListing.category === 'autos' || selectedListing.type === 'auto';
      
      if (isAuto) {
        schemaData = {
          '@context': 'https://schema.org/',
          '@type': 'Vehicle',
          'name': listingTitle,
          'description': description,
          'image': ogImage,
          'brand': selectedListing.brand ? { '@type': 'Brand', 'name': selectedListing.brand } : undefined,
          'model': selectedListing.model || undefined,
          'modelDate': selectedListing.year ? String(selectedListing.year) : undefined,
          'offers': {
            '@type': 'Offer',
            'priceCurrency': selectedListing.currency || 'USD',
            'price': selectedListing.price || 0,
            'itemCondition': selectedListing.condition === 'Nuevo' || selectedListing.condition === '0km' 
              ? 'https://schema.org/NewCondition' 
              : 'https://schema.org/UsedCondition',
            'availability': 'https://schema.org/InStock',
            'url': canonicalUrl
          }
        };
      } else {
        schemaData = {
          '@context': 'https://schema.org/',
          '@type': 'RealEstateListing',
          'name': listingTitle,
          'description': description,
          'image': ogImage,
          'offers': {
            '@type': 'Offer',
            'priceCurrency': selectedListing.currency || 'USD',
            'price': selectedListing.price || 0,
            'availability': 'https://schema.org/InStock',
            'url': canonicalUrl
          }
        };
      }

    } else if (showSellPage) {
      title = `Publicar Inmueble o Vehículo | ${SITE_NAME}`;
      description = 'Consigna tu vehículo de alta gama o propiedad exclusiva en AF SELECT. Alcanza a compradores calificados en todo el país.';
      keywords = 'vender auto de lujo, consignacion vehiculo, publicar propiedad exclusiva, inmobiliaria premium, AF Select';
      canonicalUrl = `${SITE_URL}/vender`;
    } else if (showAboutPage) {
      title = `Sobre Nosotros | ${SITE_NAME}`;
      description = 'Conoce AF SELECT: el standard de excelencia en intermediación de vehículos deportivos, clásicos de colección y real estate de autor.';
      canonicalUrl = `${SITE_URL}/nosotros`;
    } else if (showContactPage) {
      title = `Contacto & Concierge | ${SITE_NAME}`;
      description = 'Ponte en contacto con nuestro equipo de asesores en AF SELECT. Servicio de concierge personalizado para compra y venta de bienes exclusivos.';
      canonicalUrl = `${SITE_URL}/contacto`;
    } else if (activeSection === 'autos') {
      title = `Autos de Lujo & Deportivos | ${SITE_NAME}`;
      description = 'Catálogo exclusivo de súper deportivos, exóticos y vehículos de colección en AF SELECT.';
      keywords = 'autos de lujo, superdeportivos, ferrari, porsche, bmw, mercedes benz, audi, af select autos';
      canonicalUrl = `${SITE_URL}/autos`;
    } else if (activeSection === 'propiedades') {
      title = `Propiedades Exclusivas & Arquitectura | ${SITE_NAME}`;
      description = 'Explora casas de diseño, penthouses, residencias privadas y terrenos de inversión seleccionados por AF SELECT.';
      keywords = 'propiedades de lujo, casas exclusivas, penthouses, desarrollos inmobiliarios, real estate premium, af select propiedades';
      canonicalUrl = `${SITE_URL}/propiedades`;
    } else {
      title = `${SITE_NAME} — Vehículos de Lujo y Propiedades Exclusivas`;
      description = 'Marketplace exclusivo de vehículos de alta gama, superdeportivos e inmuebles residenciales y comerciales de arquitectura de vanguardia.';
      canonicalUrl = `${SITE_URL}/`;

      // Main Brand Schema
      schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            'name': SITE_NAME,
            'url': SITE_URL,
            'logo': `${SITE_URL}/favicon.svg`,
            'description': description,
            'sameAs': []
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            'url': SITE_URL,
            'name': SITE_NAME,
            'publisher': { '@id': `${SITE_URL}/#organization` }
          }
        ]
      };
    }

    // 1. Update Title
    document.title = title;

    // Helper to update meta tag by name or property
    const updateMetaTag = (selector, attribute, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          el.setAttribute('name', selector.replace("meta[name='", '').replace("']", ''));
        } else if (selector.startsWith('meta[property=')) {
          el.setAttribute('property', selector.replace("meta[property='", '').replace("']", ''));
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
    };

    // Helper to update link tag
    const updateLinkTag = (rel, href) => {
      let el = document.querySelector(`link[rel='${rel}']`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    updateMetaTag("meta[name='description']", 'content', description);
    updateMetaTag("meta[name='keywords']", 'content', keywords);

    // 3. Canonical Tag
    updateLinkTag('canonical', canonicalUrl);

    // 4. Open Graph Meta Tags
    updateMetaTag("meta[property='og:title']", 'content', title);
    updateMetaTag("meta[property='og:description']", 'content', description);
    updateMetaTag("meta[property='og:url']", 'content', canonicalUrl);
    updateMetaTag("meta[property='og:image']", 'content', ogImage);
    updateMetaTag("meta[property='og:type']", 'content', ogType);

    // 5. Twitter Meta Tags
    updateMetaTag("meta[name='twitter:title']", 'content', title);
    updateMetaTag("meta[name='twitter:description']", 'content', description);
    updateMetaTag("meta[name='twitter:image']", 'content', ogImage);

    // 6. JSON-LD Schema Insertion
    let scriptTag = document.getElementById('seo-json-ld');
    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-json-ld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    } else if (scriptTag) {
      scriptTag.remove();
    }

  }, [activeSection, selectedListing, showSellPage, showAboutPage, showContactPage]);

  return null;
}
