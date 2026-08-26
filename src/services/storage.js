import { supabase } from './supabase';
import { sendLeadNotificationEmail } from './emailService';

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2400&q=95'
];

export async function fetchHeroImages() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_images')
      .maybeSingle();
    if (error || !data) return DEFAULT_HERO_IMAGES;
    const parsed = data.value;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_HERO_IMAGES;
  } catch {
    return DEFAULT_HERO_IMAGES;
  }
}

const DEFAULT_INSTAGRAM_REEL = 'https://www.instagram.com/reel/C3x9-V4xgL1/';

export async function fetchDefaultVideo() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'default_video')
      .maybeSingle();
    if (error || !data) return DEFAULT_INSTAGRAM_REEL;
    const val = data.value;
    if (typeof val === 'string' && val.trim()) return val.trim();
    return DEFAULT_INSTAGRAM_REEL;
  } catch {
    return DEFAULT_INSTAGRAM_REEL;
  }
}

export async function fetchDefaultMediaSettings() {
  try {
    const { data: reelData } = await supabase.from('site_settings').select('value').eq('key', 'default_video').maybeSingle();
    const { data: fileData } = await supabase.from('site_settings').select('value').eq('key', 'default_video_file').maybeSingle();

    return {
      instagramUrl: typeof reelData?.value === 'string' && reelData.value.trim() ? reelData.value.trim() : DEFAULT_INSTAGRAM_REEL,
      videoFile: typeof fileData?.value === 'string' && fileData.value.trim() ? fileData.value.trim() : null
    };
  } catch {
    return {
      instagramUrl: DEFAULT_INSTAGRAM_REEL,
      videoFile: null
    };
  }
}

export async function fetchSiteSetting(key, defaultValue) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error || !data || data.value === null || data.value === undefined) return defaultValue;
    return data.value;
  } catch {
    return defaultValue;
  }
}

export const DEFAULT_STAGGERED_SHOWCASE = {
  title: 'No Somos un Concesionario Tradicional',
  description: 'Facilitamos la compra y venta de vehículos y propiedades de forma directa. Revisamos cada publicación para garantizar información transparente y un proceso ágil.',
  buttonText: 'Explorar Todo el Catálogo',
  cards: [
    {
      id: 'c1',
      title: 'Porsche 911 GT3 RS',
      subtitle: 'Edición Limitada 2023',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'c2',
      title: 'Villa Nordelta',
      subtitle: 'Residencia sobre el lago',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'c3',
      title: 'BMW M4 Competition',
      subtitle: '510 HP / 0km',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

export const DEFAULT_TESTIMONIALS_SECTION = {
  badge: 'CLIENTES FELICES • AF SELECT',
  title: 'LO QUE DICEN QUIENES CONFÍAN EN NOSOTROS',
  description: 'Facilitamos la compra, venta e inversión de activos de alta gama con transparencia absoluta y atención directa en Tucumán, Salta y Buenos Aires.',
  rating: '5.0',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=AF+Select+Tucuman',
  reviews: [
    {
      id: 'r1',
      rating: '5.0',
      quote: 'Le compré la Hilux sin verla en persona. Me mandó video, kilometraje real y la historia oficial de servicios.',
      author: 'Martín R.',
      location: 'San Miguel de Tucumán',
      tag: 'COMPRA AUTOMOTRIZ',
      date: 'Hilux SRX 4x4',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'r2',
      rating: '5.0',
      quote: 'Invertí en Torre Alem por recomendación. Reportes de avance de obra mes a mes sin falta. Excelente atención.',
      author: 'Carolina D.',
      location: 'Buenos Aires',
      tag: 'INVERSIÓN INMOBILIARIA',
      date: 'Desarrollo Alem',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'r3',
      rating: '5.0',
      quote: 'Vendí mi departamento en Yerba Buena en menos de 20 días. Tasación impecable y escribanía ultra rápida.',
      author: 'Gonzalo S.',
      location: 'Yerba Buena, Tucumán',
      tag: 'VENTA INMOBILIARIA',
      date: 'Residencia Premium',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

export async function fetchListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching listings from Supabase:', error);
    return [];
  }
  return (data || []).map(mapListingFromDB);
}

export async function submitLead(lead) {
  const dbData = mapLeadToDB(lead);
  const { error } = await supabase
    .from('leads')
    .insert(dbData);
  if (error) {
    console.error('Error submitting lead to Supabase:', error);
    throw error;
  }

  // Trigger Web3Forms email notification asynchronously to Agustín
  sendLeadNotificationEmail(lead).catch((err) => {
    console.error('Non-blocking error sending email notification:', err);
  });
}

// Helper mappings JavaScript <-> PostgreSQL columns
function maskAddressNumber(location) {
  if (!location) return location;
  const parts = location.split(',');
  if (parts.length > 1 && /\d/.test(parts[0])) {
    return parts.slice(1).join(',').trim();
  }
  return location;
}

function mapListingFromDB(db) {
  if (!db) return null;
  const showAddress = db.show_address ?? true;
  return {
    ...db,
    sectionId: db.section_id,
    createdAt: db.created_at,
    isOffer: db.is_offer,
    oldPrice: db.old_price,
    operationType: db.operation_type || 'Venta',
    showAddress,
    location: showAddress ? db.location : maskAddressNumber(db.location),
  };
}

function mapLeadToDB(js) {
  if (!js) return null;
  return {
    id: js.id || `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: js.type || 'buy',
    listing_id: js.listingId || null,
    name: js.name,
    phone: js.phone,
    email: js.email || null,
    notes: js.notes || js.message || null,
    status: js.status || 'Pending',
    created_at: js.createdAt || new Date().toISOString()
  };
}

// Fallback legacy methods to prevent compilation errors
export function getInitialData() {
  return {
    sections: [
      { id: 'autos', name: 'Autos', icon: 'Car' },
      { id: 'propiedades', name: 'Propiedades', icon: 'Home' }
    ],
    listings: []
  };
}

export function subscribeToStorage(callback) {
  return () => {};
}
