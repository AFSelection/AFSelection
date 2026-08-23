import { supabase } from './supabase';

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
