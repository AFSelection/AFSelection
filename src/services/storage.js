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
function mapListingFromDB(db) {
  if (!db) return null;
  return {
    ...db,
    sectionId: db.section_id,
    createdAt: db.created_at,
    isOffer: db.is_offer,
    oldPrice: db.old_price,
    operationType: db.operation_type || 'Venta',
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
