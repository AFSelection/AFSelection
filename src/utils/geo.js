// Helper utility to safely resolve geographic coordinates for map pins

const KNOWN_CITY_COORDS = [
  { name: 'tafi del valle', lat: -26.8524, lng: -65.7100 },
  { name: 'yerba buena', lat: -26.8167, lng: -65.3167 },
  { name: 'tucuman', lat: -26.8241, lng: -65.2226 },
  { name: 'san miguel de tucuman', lat: -26.8241, lng: -65.2226 },
  { name: 'nordelta', lat: -34.4082, lng: -58.6475 },
  { name: 'tigre', lat: -34.4260, lng: -58.5796 },
  { name: 'puerto madero', lat: -34.6135, lng: -58.3632 },
  { name: 'recoleta', lat: -34.5889, lng: -58.3931 },
  { name: 'palermo', lat: -34.5781, lng: -58.4266 },
  { name: 'belgrano', lat: -34.5627, lng: -58.4564 },
  { name: 'buenos aires', lat: -34.6037, lng: -58.3816 },
  { name: 'salta', lat: -24.7859, lng: -65.4117 },
  { name: 'san lorenzo', lat: -24.7411, lng: -65.4864 },
  { name: 'cordoba', lat: -31.4201, lng: -64.1888 },
  { name: 'rosario', lat: -32.9442, lng: -60.6505 },
  { name: 'mendoza', lat: -32.8895, lng: -68.8458 },
  { name: 'mar del plata', lat: -38.0055, lng: -57.5426 },
  { name: 'bariloche', lat: -41.1335, lng: -71.3103 }
];

export function getItemCoordinates(item) {
  if (!item) return null;

  // 1. Check existing coordinates object with valid numbers
  if (item.coordinates) {
    const lat = Number(item.coordinates.lat);
    const lng = Number(item.coordinates.lng);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }

  // 2. Check direct lat / lng fields
  if (item.lat && item.lng) {
    const lat = Number(item.lat);
    const lng = Number(item.lng);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }

  // 3. Resolve from location string
  if (item.location && typeof item.location === 'string') {
    const locLower = item.location.toLowerCase();
    const match = KNOWN_CITY_COORDS.find((c) => locLower.includes(c.name));
    if (match) {
      const hash = String(item.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const jitterLat = ((hash % 17) - 8) * 0.0035;
      const jitterLng = (((hash * 13) % 17) - 8) * 0.0035;
      return {
        lat: Number((match.lat + jitterLat).toFixed(6)),
        lng: Number((match.lng + jitterLng).toFixed(6))
      };
    }
  }

  // 4. Fallback region (Tucumán default with slight jitter)
  const hash = String(item.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const jitterLat = ((hash % 10) - 5) * 0.005;
  const jitterLng = (((hash * 7) % 10) - 5) * 0.005;
  return {
    lat: Number((-26.8241 + jitterLat).toFixed(6)),
    lng: Number((-65.2226 + jitterLng).toFixed(6))
  };
}
