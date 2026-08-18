/* ==========================================================================
   3DS HOME PLATFORM MVP — MAIN APPLICATION CONTROLLER (v5.0)
   ========================================================================== */

const App = {
  currentView: 'catalog', // 'catalog', 'map', 'admin'
  currentFilter: { category: 'all', search: '', maxPrice: 5000000000, rooms: 'all' },
  activeProperty: null,
  activeChat: null,

  init() {
    this.renderUserMenu();
    this.updateHeaderCounters();
    this.navigateTo('catalog');
  },

  // Navigation Controller
  navigateTo(viewName) {
    this.currentView = viewName;

    // Update Header Nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const mainContent = document.getElementById('mainContent');

    if (viewName === 'catalog') {
      this.renderCatalogView(mainContent);
    } else if (viewName === 'map') {
      this.renderMapView(mainContent);
    } else if (viewName === 'admin') {
      this.renderAdminView(mainContent);
    }
  },

  // Render User Profile Menu in Header
  renderUserMenu() {
    const container = document.getElementById('userMenuContainer');
    if (!container) return;

    const user = Store.currentUser;

    if (user) {
      container.innerHTML = `
        <div class="user-avatar-btn" onclick="App.openProfileMenu()">
          <img src="${user.avatar}" alt="${user.name}">
          <span style="font-size: 13px; font-weight: 600;">${user.name.split(' ')[0]}</span>
          <span class="tag-badge ${user.role === 'admin' ? 'tag-vip' : user.role === 'seller' ? 'tag-verified' : 'tag-360'}">${user.role.toUpperCase()}</span>
          <i class="fa-solid fa-chevron-down" style="font-size: 10px; color: var(--text-muted);"></i>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button class="btn-primary" style="padding: 8px 16px; font-size: 13px;" onclick="App.openAuthModal('buyer')">
          <i class="fa-solid fa-right-to-bracket"></i> Kirish
        </button>
      `;
    }
  },

  updateHeaderCounters() {
    // Favorites counter
    const favBadge = document.getElementById('favBadge');
    if (favBadge) favBadge.innerText = Store.favorites.length;

    // Chat counter
    const chatBadge = document.getElementById('chatBadge');
    if (chatBadge) chatBadge.innerText = Store.chats.length;

    // Wallet balance
    const walletBalance = document.getElementById('walletHeaderBalance');
    if (walletBalance) walletBalance.innerText = Store.formatMoney(Store.currentUser.walletBalance);
  },

  // --------------------------------------------------------------------------
  // 1. CATALOG & HERO VIEW RENDERER
  // --------------------------------------------------------------------------
  renderCatalogView(container) {
    const approvedProps = Store.properties.filter(p => p.status === 'approved');

    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="tag-badge tag-360" style="margin-bottom: 12px;">
            <i class="fa-solid fa-vr-cardboard"></i> 360° Virtual Tour & 3D Interactive Platform
          </div>
          <h1 class="hero-title">O'zbekistondagi Eng Ilg'or <span class="accent-text">3D Uylar</span> Bozori</h1>
          <p class="hero-subtitle">Har bir ko'chmas mulkni 360 darajaga aylantirib ko'ring, xaritadagi o'rnini hamda yaqin-atrofdagi barcha maktab, bog'cha va infratuzilmalarni hisoblang.</p>
        </div>

        <!-- Filter Card -->
        <div class="search-filter-card">
          <div class="filter-grid">
            <div class="filter-group">
              <label><i class="fa-solid fa-magnifying-glass"></i> Qidiruv</label>
              <input type="text" id="searchInput" class="filter-input" placeholder="Shahar, tuman yoki majmua nomi..." oninput="App.onFilterChange()">
            </div>

            <div class="filter-group">
              <label><i class="fa-solid fa-building"></i> Mulk Turi</label>
              <select id="categorySelect" class="filter-select" onchange="App.onFilterChange()">
                <option value="all">Barchasi</option>
                <option value="new_building">Yangi Inshootlar</option>
                <option value="secondary">Ikkilamchi Bozor</option>
                <option value="cottage">Hovli / Kottedj</option>
              </select>
            </div>

            <div class="filter-group">
              <label><i class="fa-solid fa-door-open"></i> Xonalar</label>
              <select id="roomsSelect" class="filter-select" onchange="App.onFilterChange()">
                <option value="all">Barcha xonalar</option>
                <option value="1">1 xonali</option>
                <option value="2">2 xonali</option>
                <option value="3">3 xonali</option>
                <option value="4">4+ xonali</option>
              </select>
            </div>

            <div class="filter-group">
              <label><i class="fa-solid fa-coins"></i> Maksimal Narx</label>
              <select id="priceSelect" class="filter-select" onchange="App.onFilterChange()">
                <option value="5000000000">Cheklovsiz</option>
                <option value="800000000">800 mln UZS gacha</option>
                <option value="1500000000">1.5 mlrd UZS gacha</option>
                <option value="3000000000">3.0 mlrd UZS gacha</option>
              </select>
            </div>

            <button class="btn-primary" onclick="App.onFilterChange()">
              <i class="fa-solid fa-filter"></i> Saralash
            </button>
          </div>
        </div>
      </section>

      <!-- Listings Grid Section -->
      <section>
        <div class="section-header">
          <h2 class="section-title"><i class="fa-solid fa-fire gold-text"></i> Tanlangan 3D Uylar Katalogi</h2>
          <span style="color: var(--text-muted); font-size: 14px;" id="listingsCount">${approvedProps.length} ta ko'chmas mulk topildi</span>
        </div>

        <div class="grid-listings" id="listingsGrid">
          ${this.renderPropertyListingsHTML(approvedProps)}
        </div>
      </section>
    `;
  },

  renderPropertyListingsHTML(properties) {
    if (properties.length === 0) {
      return `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px dashed var(--glass-border);">
          <i class="fa-solid fa-house-circle-xmark" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
          <h3 style="margin-bottom: 8px;">Uylar topilmadi</h3>
          <p style="color: var(--text-muted);">Kiritilgan parametrlar bo'yicha e'lonlar mavjud emas. Filtrni o'zgartirib ko'ring.</p>
        </div>
      `;
    }

    return properties.map(prop => {
      const isFav = Store.favorites.includes(prop.id);

      return `
        <div class="property-card">
          <div class="card-media">
            <img src="${prop.coverImage}" alt="${prop.title}">
            <div class="card-badges">
              <span class="tag-badge tag-360"><i class="fa-solid fa-vr-cardboard"></i> 360° TOUR</span>
              ${prop.isVip ? '<span class="tag-badge tag-vip"><i class="fa-solid fa-crown"></i> VIP</span>' : ''}
            </div>
            <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="App.toggleFavorite('${prop.id}', event)">
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            </button>
            <div class="card-price-tag">${Store.formatMoney(prop.price)}</div>
          </div>

          <div class="card-body">
            <h3 class="card-title" title="${prop.title}">${prop.title}</h3>
            <div class="card-address">
              <i class="fa-solid fa-location-dot" style="color: var(--accent-cyan);"></i> ${prop.address}
            </div>

            <div class="card-specs">
              <div class="spec-item"><i class="fa-solid fa-door-open"></i> ${prop.rooms} xona</div>
              <div class="spec-item"><i class="fa-solid fa-ruler-combined"></i> ${prop.area} m²</div>
              <div class="spec-item"><i class="fa-solid fa-layer-group"></i> ${prop.floor}/${prop.totalFloors} qavat</div>
            </div>

            <div class="card-footer">
              <div class="seller-info">
                <img src="${prop.seller.avatar}" class="seller-avatar" alt="${prop.seller.name}">
                <span class="seller-name">${prop.seller.name}</span>
              </div>

              <button class="btn-primary" style="padding: 8px 16px; font-size: 13px;" onclick="App.openPropertyDetail('${prop.id}')">
                <i class="fa-solid fa-eye"></i> 3D Ko'rish
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  onFilterChange() {
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const catVal = document.getElementById('categorySelect')?.value || 'all';
    const roomsVal = document.getElementById('roomsSelect')?.value || 'all';
    const maxPriceVal = parseInt(document.getElementById('priceSelect')?.value || '5000000000');

    const filtered = Store.properties.filter(p => {
      if (p.status !== 'approved') return false;
      if (catVal !== 'all' && p.category !== catVal) return false;
      if (roomsVal !== 'all' && p.rooms.toString() !== roomsVal) return false;
      if (p.price > maxPriceVal) return false;
      if (searchVal && !p.title.toLowerCase().includes(searchVal) && !p.address.toLowerCase().includes(searchVal)) return false;
      return true;
    });

    const grid = document.getElementById('listingsGrid');
    const count = document.getElementById('listingsCount');

    if (grid) grid.innerHTML = this.renderPropertyListingsHTML(filtered);
    if (count) count.innerText = `${filtered.length} ta ko'chmas mulk topildi`;
  },

  toggleFavorite(propId, event) {
    if (event) event.stopPropagation();
    const idx = Store.favorites.indexOf(propId);
    if (idx > -1) {
      Store.favorites.splice(idx, 1);
      this.showToast('E\'lon saqlanganlardan olindi', 'info');
    } else {
      Store.favorites.push(propId);
      this.showToast('E\'lon saqlanganlarga qo\'shildi', 'success');
    }
    this.updateHeaderCounters();
    this.onFilterChange();
  },

  // --------------------------------------------------------------------------
  // 2. 360° PROPERTY DETAIL & ROOM VIEWER MODAL
  // --------------------------------------------------------------------------
  openPropertyDetail(propId) {
    const prop = Store.properties.find(p => p.id === propId);
    if (!prop) return;

    this.activeProperty = prop;
    const modalContainer = document.getElementById('modalContainer');

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-card" style="max-width: 1200px; padding: 0; background: transparent; border: none;">
          <div class="detail-modal-wrapper">
            
            <!-- 360 Viewport Container -->
            <div class="tour-viewport-container">
              <div id="threeCanvas"></div>

              <!-- Top Overlay info -->
              <div style="position: absolute; top: 16px; left: 16px; z-index: 10; display: flex; gap: 8px;">
                <span class="tag-badge tag-360"><i class="fa-solid fa-vr-cardboard"></i> 360° INTERACTIVE ROOM</span>
                <span class="tag-badge tag-vip">${Store.formatMoney(prop.price)}</span>
              </div>

              <!-- Close Modal button -->
              <button onclick="App.closeModal(null, true)" style="position: absolute; top: 16px; right: 16px; z-index: 10; width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.6); color: white; border: 1px solid var(--glass-border);">
                <i class="fa-solid fa-xmark"></i>
              </button>

              <!-- Controls Bar -->
              <div class="tour-controls-bar">
                <button class="tour-btn" onclick="Tour360.toggleAutoRotate()" title="Auto Rotate">
                  <i class="fa-solid fa-rotate"></i>
                </button>
                <button class="tour-btn" onclick="App.toggleFullscreen()" title="Fullscreen">
                  <i class="fa-solid fa-expand"></i>
                </button>
                <a href="${prop.kuulaUrl}" target="_blank" class="tour-btn" title="External Kuula Tour">
                  <i class="fa-solid fa-up-right-from-square"></i>
                </a>
              </div>

              <!-- Bottom Rooms Thumbnail Strip -->
              <div class="rooms-strip">
                ${prop.rooms360.map((r, i) => `
                  <div class="room-thumb ${i === 0 ? 'active' : ''}" onclick="App.switchRoom('${r.panorama}', this)">
                    <i class="fa-solid fa-camera"></i> ${r.name}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Detail Sidebar -->
            <div class="detail-sidebar">
              <div>
                <h2 style="font-size: 20px; margin-bottom: 6px;">${prop.title}</h2>
                <div style="font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 14px;">
                  <i class="fa-solid fa-location-dot" style="color: var(--accent-cyan);"></i> ${prop.address}
                </div>
                <div style="font-size: 24px; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-heading); margin-bottom: 16px;">
                  ${Store.formatMoney(prop.price)} <span style="font-size: 14px; color: var(--text-muted); font-weight: 400;">(${Store.formatUSD(prop.priceUSD)})</span>
                </div>
              </div>

              <div class="card-specs" style="margin: 0;">
                <div class="spec-item"><i class="fa-solid fa-door-open"></i> ${prop.rooms} xona</div>
                <div class="spec-item"><i class="fa-solid fa-ruler-combined"></i> ${prop.area} m²</div>
                <div class="spec-item"><i class="fa-solid fa-layer-group"></i> ${prop.floor}/${prop.totalFloors} qavat</div>
              </div>

              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">${prop.description}</p>

              <!-- AUTOMATIC POI & INFRASTRUCTURE DISTANCE SECTION -->
              <div class="nearby-section">
                <div class="nearby-title">
                  <i class="fa-solid fa-map-pin"></i> Yaqin-Atrofdagi Infratuzilma va Masofalar
                </div>
                <div class="poi-list">
                  ${prop.nearbyPoi.map(poi => `
                    <div class="poi-item">
                      <div class="poi-name">
                        <i class="fa-solid ${poi.icon}" style="color: var(--accent-cyan);"></i>
                        <span>${poi.type}: <strong>${poi.name}</strong></span>
                      </div>
                      <div class="poi-dist">${poi.distance}m (${poi.walkMin} min)</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Seller Contact Actions -->
              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: auto;">
                <button class="btn-primary" onclick="App.startChatWithSeller('${prop.id}')">
                  <i class="fa-solid fa-comments"></i> Sotuvchi Bilan Suhbatlashish
                </button>
                <a href="tel:${prop.seller.phone}" class="btn-secondary" style="text-align: center;">
                  <i class="fa-solid fa-phone"></i> Qo'ng'iroq Qilish (${prop.seller.phone})
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    // Initialize 360 Canvas Engine
    setTimeout(() => {
      Tour360.initCanvas('threeCanvas', prop.rooms360[0].panorama);
    }, 100);
  },

  switchRoom(panoramaUrl, thumbElem) {
    document.querySelectorAll('.room-thumb').forEach(t => t.classList.remove('active'));
    if (thumbElem) thumbElem.classList.add('active');
    Tour360.switchRoomTexture(panoramaUrl);
  },

  toggleFullscreen() {
    const elem = document.querySelector('.tour-viewport-container');
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  },

  // --------------------------------------------------------------------------
  // 3. INTERACTIVE MAP VIEW RENDERER
  // --------------------------------------------------------------------------
  renderMapView(container) {
    container.innerHTML = `
      <div class="map-page-container">
        <div class="map-sidebar">
          <h2 style="font-size: 20px; margin-bottom: 12px;"><i class="fa-solid fa-map-location-dot accent-text"></i> Interaktiv Xarita</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Toshkent shahridagi barcha 3D uylarni xaritada ko'ring va ularning joylashuvini o'rganing.</p>

          <div id="mapDrawerList" style="display: flex; flex-direction: column; gap: 12px;">
            ${Store.properties.filter(p => p.status === 'approved').map(p => `
              <div class="poi-item" style="padding: 12px; cursor: pointer;" onclick="App.openPropertyDetail('${p.id}')">
                <div>
                  <div style="font-weight: 700; font-size: 14px;">${p.title}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${p.address}</div>
                </div>
                <div style="font-weight: 800; color: var(--accent-cyan); font-size: 14px;">${Store.formatUSD(p.priceUSD)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="mapViewport"></div>
      </div>
    `;

    setTimeout(() => {
      MapEngine.initMap('mapViewport');
      MapEngine.renderPropertiesOnMap(Store.properties.filter(p => p.status === 'approved'), (prop) => {
        App.openPropertyDetail(prop.id);
      });
    }, 100);
  },

  // --------------------------------------------------------------------------
  // 4. REAL-TIME CHAT & IN-CHAT DEPOSIT PAYMENTS
  // --------------------------------------------------------------------------
  openChatModal(chatId) {
    let chat = chatId ? Store.chats.find(c => c.id === chatId) : Store.chats[0];

    const modalContainer = document.getElementById('modalContainer');

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-card" style="max-width: 900px; padding: 0;">
          <div class="chat-window">
            
            <!-- Chat Users Sidebar -->
            <div class="chat-users-list">
              <div style="padding: 16px; border-bottom: 1px solid var(--glass-border); font-weight: 700;">
                <i class="fa-regular fa-comments accent-text"></i> Muloqotlar
              </div>
              ${Store.chats.map(c => `
                <div class="chat-user-item ${chat && chat.id === c.id ? 'active' : ''}" onclick="App.openChatModal('${c.id}')">
                  <img src="${c.sellerAvatar}" class="seller-avatar" alt="${c.sellerName}">
                  <div style="flex: 1; overflow: hidden;">
                    <div style="font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.sellerName}</div>
                    <div style="font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.propertyTitle}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Chat Main Area -->
            <div class="chat-main-area">
              ${chat ? `
                <div class="chat-header">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${chat.sellerAvatar}" class="seller-avatar" alt="${chat.sellerName}">
                    <div>
                      <div style="font-weight: 700; font-size: 14px;">${chat.sellerName}</div>
                      <div style="font-size: 11px; color: var(--accent-emerald);"><i class="fa-solid fa-circle" style="font-size: 8px;"></i> Onlayn</div>
                    </div>
                  </div>
                  <button onclick="App.closeModal(null, true)" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <div class="messages-body" id="messagesBody">
                  ${chat.messages.map(m => `
                    <div class="msg-bubble ${m.sender === 'buyer' ? 'msg-outgoing' : 'msg-incoming'}">
                      <div>${m.text}</div>
                      <div style="font-size: 10px; opacity: 0.7; text-align: right; margin-top: 4px;">${m.time}</div>
                    </div>
                  `).join('')}

                  <!-- In-Chat Booking & Advance Payment Card -->
                  <div class="chat-offer-card">
                    <div style="font-size: 13px; font-weight: 700; color: var(--accent-gold); margin-bottom: 4px;">
                      <i class="fa-solid fa-handshake"></i> Uyni Bron Qilish Taklifi
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">
                      Uyni 10.000.000 UZS avans to'lovi orqali o'zingiz uchun band qiling.
                    </div>
                    <button class="btn-primary" style="width: 100%; font-size: 13px; padding: 8px;" onclick="App.makeAdvancePayment('${chat.id}')">
                      <i class="fa-solid fa-credit-card"></i> 10,000,000 UZS Avans To'lash (Hamyondan)
                    </button>
                  </div>
                </div>

                <div class="chat-input-bar">
                  <button class="icon-btn" title="Rasm/Fayl biriktirish" onclick="App.showToast('Fayl tanlandi', 'info')"><i class="fa-solid fa-paperclip"></i></button>
                  <button class="icon-btn" title="Ovozli Xabar" onclick="App.showToast('Ovozli xabar yozilmoqda...', 'info')"><i class="fa-solid fa-microphone"></i></button>
                  <input type="text" class="chat-input" id="chatMsgInput" placeholder="Xabaringizni yozing..." onkeypress="if(event.key==='Enter') App.sendMessage('${chat.id}')">
                  <button class="btn-primary" style="padding: 10px 16px;" onclick="App.sendMessage('${chat.id}')"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
              ` : `
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                  Suhbatni tanlang
                </div>
              `}
            </div>

          </div>
        </div>
      </div>
    `;
  },

  startChatWithSeller(propId) {
    const prop = Store.properties.find(p => p.id === propId);
    if (!prop) return;

    let chat = Store.chats.find(c => c.propertyId === propId);
    if (!chat) {
      chat = {
        id: 'chat_' + (Store.chats.length + 1),
        propertyId: prop.id,
        propertyTitle: prop.title,
        sellerId: prop.seller.id,
        sellerName: prop.seller.name,
        sellerAvatar: prop.seller.avatar,
        messages: [
          { id: 'm1', sender: 'seller', text: `Assalomu alaykum! ${prop.title} uyi bo'yicha savollaringiz bo'lsa marhamat!`, time: 'Hozir', type: 'text' }
        ]
      };
      Store.chats.push(chat);
    }
    this.updateHeaderCounters();
    this.openChatModal(chat.id);
  },

  sendMessage(chatId) {
    const input = document.getElementById('chatMsgInput');
    if (!input || !input.value.trim()) return;

    const chat = Store.chats.find(c => c.id === chatId);
    if (!chat) return;

    chat.messages.push({
      id: 'm_' + Date.now(),
      sender: 'buyer',
      text: input.value.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    });

    input.value = '';
    this.openChatModal(chatId);
  },

  makeAdvancePayment(chatId) {
    const amount = 10000000; // 10 million UZS
    if (Store.currentUser.walletBalance < amount) {
      this.showToast('Hamyoningizda yetarli mablag\' yo\'q. Plastik kartadan to\'ldiring.', 'error');
      this.openWalletModal();
      return;
    }

    Store.currentUser.walletBalance -= amount;
    this.updateHeaderCounters();

    const chat = Store.chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages.push({
        id: 'm_' + Date.now(),
        sender: 'buyer',
        text: `✅ Uyni bron qilish uchun 10,000,000 UZS avans to'lovi muvaffaqiyatli o'tkazildi!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'payment'
      });
    }

    this.showToast('10,000,000 UZS avans to\'lovi muvaffaqiyatli amalga oshirildi!', 'success');
    this.openChatModal(chatId);
  },

  // --------------------------------------------------------------------------
  // 5. PERSONAL WALLET & CARD MANAGEMENT MODAL
  // --------------------------------------------------------------------------
  openWalletModal() {
    const modalContainer = document.getElementById('modalContainer');
    const user = Store.currentUser;

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-card">
          <div class="modal-header">
            <h3 style="font-size: 18px;"><i class="fa-solid fa-wallet accent-text"></i> Shaxsiy Hamyon & Plastik Kartalar</h3>
            <button onclick="App.closeModal(null, true)" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body">
            <!-- Balance Card -->
            <div style="background: linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(2, 132, 199, 0.2) 100%); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: var(--radius-lg); padding: 24px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Hamyon Balansi</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-heading); color: var(--accent-cyan); margin: 8px 0;">${Store.formatMoney(user.walletBalance)}</div>
              <button class="btn-primary" style="padding: 8px 20px; font-size: 13px;" onclick="App.topupWallet()">
                <i class="fa-solid fa-plus-circle"></i> Balansni To'ldirish
              </button>
            </div>

            <!-- Plastic Cards List -->
            <h4 style="font-size: 15px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
              <span><i class="fa-solid fa-credit-card"></i> Saqlangan Plastik Kartalar</span>
              <button class="btn-secondary" style="font-size: 12px; padding: 4px 10px;" onclick="App.addCardPrompt()">+ Karta Qo'shish</button>
            </h4>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${user.cards.map(c => `
                <div class="poi-item" style="padding: 14px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fa-solid fa-credit-card" style="font-size: 20px; color: var(--accent-cyan);"></i>
                    <div>
                      <div style="font-weight: 700; font-size: 14px;">${c.number}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${c.holder} (${c.exp})</div>
                    </div>
                  </div>
                  <span class="tag-badge ${c.type === 'humo' ? 'tag-360' : 'tag-vip'}">${c.type.toUpperCase()}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  topupWallet() {
    const amount = 50000000; // Topup 50 million UZS
    Store.currentUser.walletBalance += amount;
    this.updateHeaderCounters();
    this.showToast('Hamyoningizga 50,000,000 UZS muvaffaqiyatli tushirildi!', 'success');
    this.openWalletModal();
  },

  addCardPrompt() {
    Store.currentUser.cards.push({
      id: 'card_' + Date.now(),
      type: 'humo',
      number: '8600 •••• •••• ' + Math.floor(1000 + Math.random() * 9000),
      holder: Store.currentUser.name.toUpperCase(),
      exp: '12/29',
      isDefault: false
    });
    this.showToast('Yangi Humo plastik karta muvaffaqiyatli biriktirildi!', 'success');
    this.openWalletModal();
  },

  // --------------------------------------------------------------------------
  // 6. POST PROPERTY MODAL (FOR SELLERS)
  // --------------------------------------------------------------------------
  openPostModal() {
    const modalContainer = document.getElementById('modalContainer');

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-card" style="max-width: 750px;">
          <div class="modal-header">
            <h3 style="font-size: 18px;"><i class="fa-solid fa-plus-circle accent-text"></i> Yangi 3D/360° Ko'chmas Mulk E'lonini Joylash</h3>
            <button onclick="App.closeModal(null, true)" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body">
            <form onsubmit="App.submitNewProperty(event)">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div class="filter-group" style="grid-column: 1/-1;">
                  <label>E'lon Sarlavhasi</label>
                  <input type="text" id="postTitle" class="filter-input" placeholder="Masalan: Tashkent City Modern 3D Apartment" required>
                </div>

                <div class="filter-group">
                  <label>Mulk Turi</label>
                  <select id="postCategory" class="filter-select">
                    <option value="new_building">Yangi Inshoot</option>
                    <option value="secondary">Ikkilamchi Bozor</option>
                    <option value="cottage">Hovli / Kottedj</option>
                  </select>
                </div>

                <div class="filter-group">
                  <label>Narxi (UZS)</label>
                  <input type="number" id="postPrice" class="filter-input" placeholder="1200000000" required>
                </div>

                <div class="filter-group">
                  <label>Xonalar Soni</label>
                  <input type="number" id="postRooms" class="filter-input" value="3" required>
                </div>

                <div class="filter-group">
                  <label>Maydoni (m²)</label>
                  <input type="number" id="postArea" class="filter-input" value="95" required>
                </div>

                <div class="filter-group" style="grid-column: 1/-1;">
                  <label>Manzil</label>
                  <input type="text" id="postAddress" class="filter-input" placeholder="Chilonzor tumani, Toshkent" required>
                </div>

                <div class="filter-group" style="grid-column: 1/-1;">
                  <label>Kuula.co 360° Virtual Tour Havolasi (URL)</label>
                  <input type="text" id="postKuula" class="filter-input" value="https://kuula.co/share/collection/7fW2v?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1">
                </div>
              </div>

              <!-- Map Location Picker -->
              <div class="nearby-section" style="margin-bottom: 20px;">
                <div class="nearby-title"><i class="fa-solid fa-map-pin"></i> Xaritada Uyni Belgilang (Avtomatik Infratuzilma Hisoblash)</div>
                <div id="postMapPicker" style="height: 250px; border-radius: var(--radius-md); overflow: hidden; margin-top: 8px;"></div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;" id="postPoiStatus">Xaritaning ustiga bosing — tizim avtomatik yaqin maktab va do'konlar masofasini hisoblaydi.</div>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%;">
                <i class="fa-solid fa-paper-plane"></i> E'lonni Moderatsiyaga Yuborish
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      MapEngine.initMap('postMapPicker');
      MapEngine.enableLocationPicker((lat, lng, calculatedPois) => {
        window.pickedLat = lat;
        window.pickedLng = lng;
        window.pickedPois = calculatedPois;
        const status = document.getElementById('postPoiStatus');
        if (status) status.innerHTML = `✅ Joylashuv belgilandi (${lat.toFixed(4)}, ${lng.toFixed(4)}). <strong>${calculatedPois.length} ta yaqin infratuzilma masofasi hisoblandi!</strong>`;
      });
    }, 100);
  },

  submitNewProperty(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const price = parseInt(document.getElementById('postPrice').value);
    const rooms = parseInt(document.getElementById('postRooms').value);
    const area = parseInt(document.getElementById('postArea').value);
    const address = document.getElementById('postAddress').value;
    const kuulaUrl = document.getElementById('postKuula').value;

    const newProp = {
      id: 'prop_' + Date.now(),
      title,
      category,
      price,
      priceUSD: Math.round(price / 12600),
      address,
      lat: window.pickedLat || 41.3111,
      lng: window.pickedLng || 69.2406,
      rooms,
      area,
      floor: 5,
      totalFloors: 12,
      isVip: false,
      status: 'pending', // Pending Super Admin Moderation
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      kuulaUrl: kuulaUrl || 'https://kuula.co/share/collection/7fW2v?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
      panorama360: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=2000&q=80',
      rooms360: [
        { id: 'bedroom', name: 'Yotoqxona (3D)', panorama: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80' }
      ],
      seller: {
        id: Store.currentUser.id,
        name: Store.currentUser.name,
        phone: Store.currentUser.phone,
        avatar: Store.currentUser.avatar,
        rating: 5.0,
        verified: true
      },
      description: 'Yangi tayyorlangan 3D va 360° virtual turga ega ko\'chmas mulk.',
      nearbyPoi: window.pickedPois || MapEngine.calculateNearbyPoiForCoordinates(41.3111, 69.2406)
    };

    Store.properties.unshift(newProp);
    this.closeModal(null, true);
    this.showToast('Yangi e\'loningiz Super Admin moderatsiyasiga muvaffaqiyatli yuborildi!', 'success');
  },

  // --------------------------------------------------------------------------
  // 7. SUPER ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  renderAdminView(container) {
    const pendingProps = Store.properties.filter(p => p.status === 'pending');
    const approvedProps = Store.properties.filter(p => p.status === 'approved');

    container.innerHTML = `
      <section>
        <div class="section-header">
          <h2 class="section-title"><i class="fa-solid fa-user-shield gold-text"></i> Super Admin Boshqaruv Portali</h2>
          <span class="tag-badge tag-vip">SUPER ADMIN PORTAL</span>
        </div>

        <!-- Admin Stats -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px;">
          <div class="nearby-section" style="text-align: center;">
            <div style="font-size: 12px; color: var(--text-muted);">Jami E'lonlar</div>
            <div style="font-size: 28px; font-weight: 800; color: var(--accent-cyan);">${Store.properties.length}</div>
          </div>
          <div class="nearby-section" style="text-align: center;">
            <div style="font-size: 12px; color: var(--text-muted);">Moderatsiyada</div>
            <div style="font-size: 28px; font-weight: 800; color: var(--accent-gold);">${pendingProps.length}</div>
          </div>
          <div class="nearby-section" style="text-align: center;">
            <div style="font-size: 12px; color: var(--text-muted);">Tasdiqlangan</div>
            <div style="font-size: 28px; font-weight: 800; color: var(--accent-emerald);">${approvedProps.length}</div>
          </div>
          <div class="nearby-section" style="text-align: center;">
            <div style="font-size: 12px; color: var(--text-muted);">Platforma Komissiyasi</div>
            <div style="font-size: 28px; font-weight: 800; color: var(--accent-cyan);">24,500,000 UZS</div>
          </div>
        </div>

        <!-- Moderation List -->
        <h3 style="font-size: 18px; margin-bottom: 16px;">Moderatsiyadagi E'lonlar</h3>
        ${pendingProps.length === 0 ? `
          <div style="padding: 30px; text-align: center; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); color: var(--text-muted);">
            Hozircha moderatsiyada kutilayotgan e'lonlar mavjud emas.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${pendingProps.map(p => `
              <div class="poi-item" style="padding: 16px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; font-size: 16px;">${p.title}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${p.address} — ${Store.formatMoney(p.price)}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="btn-primary" style="padding: 6px 14px; font-size: 12px;" onclick="App.approveProperty('${p.id}')">
                    <i class="fa-solid fa-check"></i> Tasdiqlash
                  </button>
                  <button class="btn-secondary" style="padding: 6px 14px; font-size: 12px; color: var(--accent-rose);" onclick="App.rejectProperty('${p.id}')">
                    <i class="fa-solid fa-xmark"></i> Rad Etish
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </section>
    `;
  },

  approveProperty(id) {
    const prop = Store.properties.find(p => p.id === id);
    if (prop) prop.status = 'approved';
    this.showToast('E\'lon tasdiqlandi va katalogga qo\'shildi!', 'success');
    this.renderAdminView(document.getElementById('mainContent'));
  },

  rejectProperty(id) {
    const prop = Store.properties.find(p => p.id === id);
    if (prop) prop.status = 'rejected';
    this.showToast('E\'lon rad etildi.', 'error');
    this.renderAdminView(document.getElementById('mainContent'));
  },

  // Switch Role helper
  openProfileMenu() {
    const roles = ['buyer', 'seller', 'admin'];
    const currentIdx = roles.indexOf(Store.currentUser.role);
    const nextRole = roles[(currentIdx + 1) % roles.length];
    Store.currentUser.role = nextRole;
    this.renderUserMenu();
    this.showToast(`Rol o'zgartirildi: ${nextRole.toUpperCase()}`, 'info');
    if (nextRole === 'admin') this.navigateTo('admin');
    else this.navigateTo('catalog');
  },

  closeModal(e, force = false) {
    if (force || (e && e.target.classList.contains('modal-overlay'))) {
      const container = document.getElementById('modalContainer');
      if (container) container.innerHTML = '';
      Tour360.destroy();
    }
  },

  showToast(msg, type = 'info') {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 9999;
        padding: 12px 20px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600;
        box-shadow: var(--shadow-modal); backdrop-filter: blur(16px); border: 1px solid var(--glass-border);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(toast);
    }

    if (type === 'success') {
      toast.style.background = 'rgba(16, 185, 129, 0.9)';
      toast.style.color = 'white';
    } else if (type === 'error') {
      toast.style.background = 'rgba(239, 68, 68, 0.9)';
      toast.style.color = 'white';
    } else {
      toast.style.background = 'rgba(0, 242, 254, 0.9)';
      toast.style.color = '#0A0E1A';
    }

    toast.innerText = msg;
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3000);
  }
};

// Initialize App when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
