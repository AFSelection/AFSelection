// LocalStorage Persistence Service with Initial Data

const STORAGE_KEY = 'af_selection_dataset_v1';

const defaultSections = [
  { id: 'autos', name: 'Autos', icon: 'Car' },
  { id: 'propiedades', name: 'Propiedades', icon: 'Home' }
];

const defaultListings = [
  {
    id: 'l1',
    sectionId: 'autos',
    title: 'Porsche 911 GT3 RS',
    subtitle: 'Motor 4.0L Atmosférico 525 CV - Paquete Weissach',
    price: 485000,
    category: 'Deportivo',
    location: 'San Miguel de Tucumán',
    featured: true,
    year: 2024,
    kms: 1200,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Unidad en excelente estado verificado directo por Agustín Fidalgo.',
    specs: { 'Potencia': '525 CV', 'Aceleración': '0-100 en 3.2s', 'Caja': 'PDK 7 marchas', 'Color': 'Python Green' }
  },
  {
    id: 'l2',
    sectionId: 'autos',
    title: 'BMW M4 Competition xDrive',
    subtitle: 'Motor 3.0 BiTurbo 510 CV - Carbon Bucket Seats',
    price: 215000,
    category: 'Deportivo',
    location: 'Yerba Buena, Tucumán',
    featured: true,
    year: 2023,
    kms: 8500,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Impecable estado. M Carbon Package interior y exterior, llantas de 20", frenos M Compound.',
    specs: { 'Potencia': '510 CV', 'Tracción': 'xDrive Integral', 'Color': 'Isle of Man Green' }
  },
  {
    id: 'l3',
    sectionId: 'autos',
    title: 'Mercedes-AMG G63 V8 Biturbo',
    subtitle: 'Motor 4.0 V8 585 CV - Night Package II',
    price: 360000,
    category: 'SUV / 4x4',
    location: 'Buenos Aires',
    featured: true,
    year: 2023,
    kms: 14000,
    images: [
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Excelente andar y confort. Equipamiento completo, tapizado en cuero, sistema Burmester 3D.',
    specs: { 'Potencia': '585 CV', 'Torque': '850 Nm', 'Color': 'Obsidian Black Metallic' }
  },
  {
    id: 'l4',
    sectionId: 'propiedades',
    title: 'Villa Nordelta sobre el Lago',
    subtitle: 'Casa amplia con jardín y piscina sin fin',
    price: 1450000,
    category: 'Casa',
    location: 'Nordelta, Tigre',
    featured: true,
    coordinates: [-34.423, -58.654],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Residencia de 650 m² cubiertos sobre lote al lago principal. Suite principal, quincho y piscina.',
    features: { sqm: 650, rooms: 5, bathrooms: 6, garage: 4 }
  },
  {
    id: 'l5',
    sectionId: 'propiedades',
    title: 'Penthouse Puerto Madero',
    subtitle: 'Triplex con terraza privada, jacuzzi y vista al río',
    price: 2100000,
    category: 'Departamento',
    location: 'Puerto Madero, CABA',
    featured: true,
    coordinates: [-34.611, -58.363],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '450 m² totales con excelentes accesos y terminaciones de calidad.',
    features: { sqm: 450, rooms: 4, bathrooms: 5, garage: 3 }
  },
  {
    id: 'l6',
    sectionId: 'propiedades',
    title: 'Residencia Yerba Buena',
    subtitle: 'Casa de estilo moderno en barrio cerrado',
    price: 850000,
    category: 'Casa',
    location: 'Yerba Buena, Tucumán',
    featured: true,
    coordinates: [-26.816, -65.316],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600606753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Terreno de 1.500 m² con gran parque y jardín. Piscina climatizada, terminaciones de calidad.',
    features: { sqm: 480, rooms: 4, bathrooms: 4, garage: 2 }
  }
];

export function getInitialData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial = { sections: defaultSections, listings: defaultListings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading localStorage:', error);
    return { sections: defaultSections, listings: defaultListings };
  }
}

export function saveDataset(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('af_storage_change'));
  } catch (error) {
    console.error('Error saving dataset:', error);
  }
}

export const saveStorageData = saveDataset;

export function subscribeToStorage(callback) {
  const handler = () => {
    callback(getInitialData());
  };
  window.addEventListener('af_storage_change', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('af_storage_change', handler);
    window.removeEventListener('storage', handler);
  };
}
