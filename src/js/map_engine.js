/* ==========================================================================
   3DS HOME PLATFORM MVP — MAP & AUTOMATIC POI DISTANCE ENGINE (v5.0)
   ========================================================================== */

const MapEngine = {
  map: null,
  markers: [],
  selectedMarker: null,

  // Reference database of Tashkent infrastructure landmarks to calculate distances
  referenceLandmarks: [
    { type: 'Maktab', icon: 'fa-school', name: 'Toshkent Prezident Maktabi', lat: 41.3130, lng: 69.2450 },
    { type: 'Maktab', icon: 'fa-school', name: '110-sonli Ixtisoslashtirilgan Maktab', lat: 41.2980, lng: 69.2700 },
    { type: 'Bog\'cha', icon: 'fa-baby', name: 'Kids Academy №12', lat: 41.3100, lng: 69.2380 },
    { type: 'Bog\'cha', icon: 'fa-baby', name: 'Smart Kids Preschool', lat: 41.2730, lng: 69.2060 },
    { type: 'Universitet', icon: 'fa-graduation-cap', name: 'Vestminster Universiteti (WIUT)', lat: 41.3115, lng: 69.2790 },
    { type: 'Universitet', icon: 'fa-graduation-cap', name: 'Toshkent Axborot Texnologiyalari Universiteti (TATU)', lat: 41.3400, lng: 69.2860 },
    { type: 'Supermarket', icon: 'fa-cart-shopping', name: 'Korzinka Tashkent City', lat: 41.3118, lng: 69.2415 },
    { type: 'Supermarket', icon: 'fa-cart-shopping', name: 'Makro Mirabad Avenue', lat: 41.2990, lng: 69.2725 },
    { type: 'Restoran', icon: 'fa-utensils', name: 'SkyLine Lounge & Restaurant', lat: 41.3125, lng: 69.2420 },
    { type: 'Shifoxona', icon: 'fa-hospital', name: 'Tashkent Medical Center', lat: 41.3050, lng: 69.2500 },
    { type: 'Dorixona', icon: 'fa-pills', name: 'OXYmed 24/7', lat: 41.3105, lng: 69.2400 },
    { type: 'Zapravka', icon: 'fa-gas-pump', name: 'UNG Petro Eco Station', lat: 41.3150, lng: 69.2480 },
    { type: 'Bank', icon: 'fa-building-columns', name: 'Kapitalbank Smart Branch', lat: 41.3108, lng: 69.2395 }
  ],

  initMap(elementId, centerLat = 41.3111, centerLng = 69.2406, zoom = 13) {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    // Initialize Leaflet Map
    this.map = L.map(elementId, {
      center: [centerLat, centerLng],
      zoom: zoom,
      zoomControl: true
    });

    // Dark Map Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);
  },

  renderPropertiesOnMap(properties, onPropertySelectCallback) {
    if (!this.map) return;

    this.clearMarkers();

    properties.forEach(prop => {
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="map-pin-badge ${prop.isVip ? 'vip' : ''}">
            <i class="fa-solid fa-house"></i>
            <span>${Store.formatUSD(prop.priceUSD)}</span>
          </div>
        `,
        iconSize: [100, 36],
        iconAnchor: [50, 36]
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon }).addTo(this.map);

      marker.on('click', () => {
        if (onPropertySelectCallback) onPropertySelectCallback(prop);
      });

      this.markers.push(marker);
    });
  },

  // Location Picker for Sellers when creating/editing a property
  enableLocationPicker(onLocationPickedCallback) {
    if (!this.map) return;

    let tempMarker = null;

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      if (tempMarker) this.map.removeLayer(tempMarker);

      tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-map-pin-selected',
          html: `<div class="pin-selected"><i class="fa-solid fa-location-dot"></i> Tanlangan Joy</div>`,
          iconSize: [120, 40]
        })
      }).addTo(this.map);

      // Automatically Calculate Nearby Infrastructure Distances
      const calculatedPois = this.calculateNearbyPoiForCoordinates(lat, lng);

      if (onLocationPickedCallback) {
        onLocationPickedCallback(lat, lng, calculatedPois);
      }
    });
  },

  // Calculate nearby POI distances for any lat/lng coordinate
  calculateNearbyPoiForCoordinates(lat, lng) {
    return this.referenceLandmarks.map(landmark => {
      const distanceMeters = Store.calculateDistance(lat, lng, landmark.lat, landmark.lng);
      const walkMin = Math.max(1, Math.round(distanceMeters / 80)); // ~80m per minute walking speed

      return {
        icon: landmark.icon,
        type: landmark.type,
        name: landmark.name,
        distance: distanceMeters,
        walkMin: walkMin
      };
    }).sort((a, b) => a.distance - b.distance); // Sort by closest distance first
  }
};
