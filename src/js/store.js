/* ==========================================================================
   3DS HOME PLATFORM MVP — DATA STORE & STATE ENGINE (v5.0)
   ========================================================================== */

const Store = {
  // Current logged in user
  currentUser: {
    id: 'user_1',
    name: 'Suxrob Sadullayev',
    phone: '+998 90 123 45 67',
    role: 'buyer', // 'buyer', 'seller', 'admin'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    walletBalance: 125000000, // UZS
    cards: [
      { id: 'card_1', type: 'humo', number: '8600 •••• •••• 4589', holder: 'SUXROB SADULLAYEV', exp: '08/28', isDefault: true },
      { id: 'card_2', type: 'uzcard', number: '5614 •••• •••• 1209', holder: 'SUXROB SADULLAYEV', exp: '11/27', isDefault: false }
    ]
  },

  // Favorites property IDs
  favorites: ['prop_1', 'prop_3'],

  // Initial Mock Properties Database
  properties: [
    {
      id: 'prop_1',
      title: 'Tashkent City Modern 3D Premium Apartment',
      category: 'new_building', // 'new_building', 'secondary', 'cottage'
      price: 1450000000, // UZS
      priceUSD: 115000,
      address: 'Tashkent City Blvd, Shayxontohur tumani, Toshkent',
      lat: 41.3111,
      lng: 69.2406,
      rooms: 3,
      area: 112, // sq meters
      floor: 12,
      totalFloors: 24,
      isVip: true,
      status: 'approved', // 'pending', 'approved', 'rejected'
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      kuulaUrl: 'https://kuula.co/share/collection/7fW2v?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
      panorama360: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=2000&q=80',
      rooms360: [
        { id: 'bedroom', name: 'Yotoqxona (3D)', panorama: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80' },
        { id: 'living', name: 'Mehmonxona (3D)', panorama: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=80' },
        { id: 'kitchen', name: 'Oshxona (3D)', panorama: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=80' }
      ],
      seller: {
        id: 'seller_1',
        name: 'Tashkent City Builders LLC',
        phone: '+998 71 200 88 88',
        avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        verified: true
      },
      description: 'Ultra-zamonaviy 3D proyeksiyaga ega 3 xonali shinam kvartira. Panorama oyna, aqlli uy tizimi va premium pardozlash.',
      nearbyPoi: [
        { icon: 'fa-school', type: 'Maktab', name: 'Toshkent Prezident Maktabi', distance: 350, walkMin: 4 },
        { icon: 'fa-baby', type: 'Bog\'cha', name: 'Kids Academy №12', distance: 180, walkMin: 2 },
        { icon: 'fa-graduation-cap', type: 'Universitet', name: 'Toshkent Xalqaro Vestminster Universiteti', distance: 850, walkMin: 10 },
        { icon: 'fa-cart-shopping', type: 'Supermarket', name: 'Korzinka Tashkent City', distance: 120, walkMin: 1 },
        { icon: 'fa-utensils', type: 'Restoran', name: 'SkyLine Lounge & Restaurant', distance: 250, walkMin: 3 },
        { icon: 'fa-hospital', type: 'Shifoxona', name: 'Tashkent Medical Center', distance: 1100, walkMin: 14 },
        { icon: 'fa-pills', type: 'Dorixona', name: 'OXYmed 24/7', distance: 90, walkMin: 1 },
        { icon: 'fa-gas-pump', type: 'Zapravka', name: 'UNG Petro Eco Station', distance: 520, walkMin: 6 },
        { icon: 'fa-building-columns', type: 'Bank', name: 'Kapitalbank Smart Branch', distance: 140, walkMin: 2 }
      ]
    },
    {
      id: 'prop_2',
      title: 'Mirabad Avenue Deluxe Penthouse',
      category: 'new_building',
      price: 2800000000,
      priceUSD: 220000,
      address: 'Mirabad Avenue, Mirobod tumani, Toshkent',
      lat: 41.2995,
      lng: 69.2715,
      rooms: 4,
      area: 165,
      floor: 9,
      totalFloors: 10,
      isVip: true,
      status: 'approved',
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      kuulaUrl: 'https://kuula.co/share/collection/7fW2v?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
      panorama360: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=80',
      rooms360: [
        { id: 'bedroom', name: 'Master Bedroom 3D', panorama: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80' },
        { id: 'living', name: 'Penthouse Hall 3D', panorama: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=80' }
      ],
      seller: {
        id: 'seller_2',
        name: 'Golden House Real Estate',
        phone: '+998 78 150 11 11',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        verified: true
      },
      description: 'Mirobod Avenue majmuasida joylashgan lyuks pentxaus. Terassa va panoramali shahar manzarasi.',
      nearbyPoi: [
        { icon: 'fa-school', type: 'Maktab', name: 'N110-sonli Ixtisoslashtirilgan Maktab', distance: 220, walkMin: 3 },
        { icon: 'fa-cart-shopping', type: 'Supermarket', name: 'Makro Mirabad Avenue', distance: 80, walkMin: 1 },
        { icon: 'fa-hospital', type: 'Shifoxona', name: 'Central Hospital', distance: 600, walkMin: 7 },
        { icon: 'fa-building-columns', type: 'Bank', name: 'NBU Private Banking', distance: 150, walkMin: 2 }
      ]
    },
    {
      id: 'prop_3',
      title: 'Chilonzor Green Residence 2-Xonali',
      category: 'secondary',
      price: 780000000,
      priceUSD: 62000,
      address: 'Chilonzor 9-daha, Chilonzor tumani, Toshkent',
      lat: 41.2721,
      lng: 69.2045,
      rooms: 2,
      area: 64,
      floor: 4,
      totalFloors: 9,
      isVip: false,
      status: 'approved',
      coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      kuulaUrl: 'https://kuula.co/share/collection/7fW2v?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
      panorama360: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80',
      rooms360: [
        { id: 'bedroom', name: 'Yotoqxona', panorama: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80' }
      ],
      seller: {
        id: 'seller_3',
        name: 'Murad Buildings',
        phone: '+998 71 200 00 01',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 4.7,
        verified: true
      },
      description: 'Shinam va tayyor ta\'mirlangan 2 xonali xonadon. Metro bekatiga 3 daqiqalik masofa.',
      nearbyPoi: [
        { icon: 'fa-subway', type: 'Metro', name: 'Mirzo Ulug\'bek Metro Bekati', distance: 300, walkMin: 3 },
        { icon: 'fa-school', type: 'Maktab', name: 'Chilonzor №163 Maktab', distance: 150, walkMin: 2 },
        { icon: 'fa-cart-shopping', type: 'Supermarket', name: 'Havas Supermarket', distance: 100, walkMin: 1 }
      ]
    }
  ],

  // Real-time Chats database
  chats: [
    {
      id: 'chat_1',
      propertyId: 'prop_1',
      propertyTitle: 'Tashkent City Modern 3D Premium Apartment',
      sellerId: 'seller_1',
      sellerName: 'Tashkent City Builders LLC',
      sellerAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
      messages: [
        { id: 'm1', sender: 'seller', text: 'Assalomu alaykum! Tashkent City uyi bo\'yicha qanday savollaringiz bor?', time: '10:15', type: 'text' },
        { id: 'm2', sender: 'buyer', text: 'Vrachlik shoxobchalari va 3D yotoqxona panoramasi haqida batafsil ma\'lumot olmoqchi edim.', time: '10:18', type: 'text' },
        { id: 'm3', sender: 'seller', text: 'Ha, albatta! Loyihada 360° virtual tour to\'liq tayyor va yaqin-atrofda 9 ta infratuzilma ob\'ekti mavjud.', time: '10:20', type: 'text' }
      ]
    }
  ],

  // System Helpers
  formatMoney(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS';
  },

  formatUSD(amount) {
    return '$' + new Intl.NumberFormat('en-US').format(amount);
  },

  // Calculate distance between two lat/lng coordinates (Haversine formula in meters)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
  }
};
