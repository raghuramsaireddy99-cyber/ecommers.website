/* ============================================================
   SHOPEX — script.js
   Cart, Wishlist, Filters, Toasts, UI interactions
   ============================================================ */

// ── State ──────────────────────────────────────────────────
const state = {
  cart: JSON.parse(localStorage.getItem('shopex-cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('shopex-wishlist') || '[]'),
};

// ── Persist ────────────────────────────────────────────────
function saveCart()     { localStorage.setItem('shopex-cart',     JSON.stringify(state.cart)); }
function saveWishlist() { localStorage.setItem('shopex-wishlist', JSON.stringify(state.wishlist)); }

// ── Toast ──────────────────────────────────────────────────
function showToast(msg, type = 'success', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ── Cart ───────────────────────────────────────────────────
function addToCart(product) {
  const idx = state.cart.findIndex(i => i.id === product.id);
  if (idx > -1) {
    state.cart[idx].qty += product.qty || 1;
  } else {
    state.cart.push({ ...product, qty: product.qty || 1 });
  }
  saveCart();
  updateCartCount();
  showToast(`"${product.name}" added to cart`);
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateCartQty(id, qty) {
  if (qty < 1) { removeFromCart(id); return; }
  const item = state.cart.find(i => i.id === id);
  if (item) { item.qty = qty; saveCart(); renderCart(); }
}

function updateCartCount() {
  const total = state.cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total ? 'flex' : 'none';
  });
}

// ── Wishlist ───────────────────────────────────────────────
function toggleWishlist(id, name) {
  const idx = state.wishlist.indexOf(id);
  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    showToast(`Removed from wishlist`, 'info');
  } else {
    state.wishlist.push(id);
    showToast(`"${name}" added to wishlist`);
  }
  saveWishlist();
  document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', state.wishlist.includes(id));
  });
}

function isWishlisted(id) { return state.wishlist.includes(id); }

// ── Products Data ──────────────────────────────────────────
const PRODUCTS = [
  { id: 1,  name: 'Minimalist Leather Watch',         category: 'Accessories', price: 189,  oldPrice: 249,  badge: 'Sale',    rating: 4.8, reviews: 124, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { id: 2,  name: 'Merino Wool Crewneck',             category: 'Clothing',    price: 129,  oldPrice: null, badge: 'New',     rating: 4.6, reviews: 89,  img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80' },
  { id: 3,  name: 'Ceramic Pour-Over Set',            category: 'Home',        price: 84,   oldPrice: null, badge: null,      rating: 4.9, reviews: 213, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
  { id: 4,  name: 'Structured Canvas Tote',           category: 'Accessories', price: 68,   oldPrice: null, badge: 'New',     rating: 4.5, reviews: 57,  img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
  { id: 5,  name: 'Slim Fit Oxford Shirt',            category: 'Clothing',    price: 95,   oldPrice: 130,  badge: 'Sale',    rating: 4.7, reviews: 176, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80' },
  { id: 6,  name: 'Walnut Desk Organiser',            category: 'Home',        price: 112,  oldPrice: null, badge: null,      rating: 4.8, reviews: 94,  img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
  { id: 7,  name: 'Wireless Noise-Cancel Headphones', category: 'Electronics', price: 299,  oldPrice: 379,  badge: 'Sale',    rating: 4.9, reviews: 342, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { id: 8,  name: 'Hand-Thrown Stoneware Mug',        category: 'Home',        price: 38,   oldPrice: null, badge: null,      rating: 4.7, reviews: 68,  img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80' },
  { id: 9,  name: 'Linen Blend Trousers',             category: 'Clothing',    price: 109,  oldPrice: null, badge: 'New',     rating: 4.5, reviews: 42,  img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80' },
  { id: 10, name: 'Brushed Gold Cufflinks',           category: 'Accessories', price: 56,   oldPrice: null, badge: null,      rating: 4.6, reviews: 33,  img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88578?w=600&q=80' },
  { id: 11, name: 'Smart Fitness Tracker',            category: 'Electronics', price: 149,  oldPrice: 199,  badge: 'Sale',    rating: 4.4, reviews: 211, img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80' },
  { id: 12, name: 'Italian Leather Wallet',           category: 'Accessories', price: 79,   oldPrice: null, badge: null,      rating: 4.8, reviews: 89,  img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80' },
];

// ── Render Stars ───────────────────────────────────────────
function renderStars(r) {
  const full = Math.floor(r), half = r % 1 >= .5 ? 1 : 0, empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ── Product Card HTML ──────────────────────────────────────
function productCardHTML(p) {
  const badge = p.badge
    ? `<span class="product-badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : '';
  const oldPrice = p.oldPrice
    ? `<span class="price-old">₹${p.oldPrice}</span>` : '';
  return `
    <div class="product-card" data-id="${p.id}" data-category="${p.category}">
      <div class="product-image-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${badge}
        <button class="product-wishlist ${isWishlisted(p.id) ? 'active' : ''}"
                data-wishlist="${p.id}" data-name="${p.name}" aria-label="Wishlist">
          <svg width="16" height="16" fill="${isWishlisted(p.id) ? 'currentColor' : 'none'}"
               stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <a href="product-detail.html?id=${p.id}">
          <div class="product-name">${p.name}</div>
        </a>
        <div class="product-rating">
          <span class="stars">${renderStars(p.rating)}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">₹${p.price}</span>
            ${oldPrice}
          </div>
          <button class="add-to-cart" data-id="${p.id}" data-name="${p.name}"
                  data-price="${p.price}" data-img="${p.img}">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>`;
}

// ── Render Products Grid ───────────────────────────────────
function renderProducts(products, containerId = 'productsGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = products.length
    ? products.map(productCardHTML).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--muted)">
         <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
         <p>No products found.</p>
       </div>`;
  attachProductEvents(grid);
}

function attachProductEvents(container) {
  container.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const b = e.currentTarget;
      addToCart({ id: +b.dataset.id, name: b.dataset.name, price: +b.dataset.price, img: b.dataset.img });
      b.classList.add('added'); b.textContent = '✓ Added';
      setTimeout(() => { b.classList.remove('added'); b.innerHTML = `
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg> Add`; }, 1500);
    });
  });
  container.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleWishlist(+btn.dataset.wishlist, btn.dataset.name);
    });
  });
}

// ── Filter & Search ────────────────────────────────────────
function initFilters() {
  let activeCategory = 'All', searchQuery = '', sortBy = 'default';

  function filteredProducts() {
    let list = [...PRODUCTS];
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sortBy === 'price-asc')  list.sort((a,b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (sortBy === 'rating')     list.sort((a,b) => b.rating - a.rating);
    if (sortBy === 'newest')     list = list.filter(p => p.badge === 'New').concat(list.filter(p => p.badge !== 'New'));
    return list;
  }

  function update() {
    const list = filteredProducts();
    renderProducts(list);
    const countEl = document.getElementById('productsCount');
    if (countEl) countEl.textContent = `${list.length} Products`;
  }

  // Chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category || 'All';
      update();
    });
  });

  // Sort
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.addEventListener('change', () => { sortBy = sortSel.value; update(); });

  // Search
  document.querySelectorAll('.search-input').forEach(inp => {
    inp.addEventListener('input', () => { searchQuery = inp.value; update(); });
  });

  update();
}

// ── Cart Page Render ───────────────────────────────────────
function renderCart() {
  const container = document.getElementById('cartItems');
  const emptyMsg  = document.getElementById('emptyCart');
  const cartMain  = document.getElementById('cartMain');
  if (!container) return;

  if (!state.cart.length) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (cartMain) cartMain.style.display = 'none';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (cartMain) cartMain.style.display = 'grid';

  container.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Unit price: ₹${item.price}</div>
        <div class="cart-item-qty">
          <div class="qty-control">
            <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty - 1})">−</button>
            <input class="qty-input" type="number" value="${item.qty}" min="1"
                   onchange="updateCartQty(${item.id}, +this.value)">
            <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            </svg> Remove
          </button>
        </div>
      </div>
      <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
    </div>`).join('');

  // Totals
  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = 0;
  const total    = subtotal + shipping - discount;

  const el = id => document.getElementById(id);
  if (el('summarySubtotal')) el('summarySubtotal').textContent = `₹${subtotal.toLocaleString()}`;
  if (el('summaryShipping')) el('summaryShipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
  if (el('summaryTotal'))    el('summaryTotal').textContent    = `₹${total.toLocaleString()}`;
}

// ── Navbar Hamburger ───────────────────────────────────────
function initNavbar() {
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  if (ham && nav) {
    ham.addEventListener('click', () => nav.classList.toggle('open'));
  }
  updateCartCount();
}

// ── Coupon ─────────────────────────────────────────────────
function applyCoupon() {
  const val = document.getElementById('couponInput')?.value.trim().toUpperCase();
  const codes = { 'SHOPEX10': 10, 'SAVE20': 20 };
  if (codes[val]) {
    showToast(`Coupon applied! ${codes[val]}% off`);
  } else {
    showToast('Invalid coupon code', 'info');
  }
}

// ── Homepage featured products ─────────────────────────────
function initHomepage() {
  const featured = document.getElementById('featuredGrid');
  if (featured) {
    featured.innerHTML = PRODUCTS.slice(0, 4).map(productCardHTML).join('');
    attachProductEvents(featured);
  }
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHomepage();

  if (document.getElementById('productsGrid')) initFilters();
  if (document.getElementById('cartItems'))    renderCart();

  // Product detail page
  if (document.getElementById('detailSection')) initProductDetail();
});

// ── Product Detail ─────────────────────────────────────────
function initProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id     = parseInt(params.get('id')) || 1;
  const p      = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

  document.getElementById('detailCategory').textContent  = p.category;
  document.getElementById('detailTitle').textContent     = p.name;
  document.getElementById('detailPriceCurrent').textContent = `₹${p.price}`;
  document.getElementById('detailRatingStars').textContent  = renderStars(p.rating);
  document.getElementById('detailRatingCount').textContent  = `(${p.reviews} reviews)`;
  document.getElementById('detailMainImg').src            = p.img;

  if (p.oldPrice) {
    document.getElementById('detailPriceOld').textContent = `₹${p.oldPrice}`;
  }

  document.getElementById('detailAddToCart')?.addEventListener('click', () => {
    const qty = parseInt(document.getElementById('detailQty')?.value || 1);
    addToCart({ id: p.id, name: p.name, price: p.price, img: p.img, qty });
  });

  document.getElementById('detailWishlist')?.addEventListener('click', function () {
    toggleWishlist(p.id, p.name);
    this.classList.toggle('active', isWishlisted(p.id));
  });

  // Qty controls
  window.detailQtyChange = (delta) => {
    const inp = document.getElementById('detailQty');
    inp.value = Math.max(1, parseInt(inp.value) + delta);
  };

  // Related
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid) { relGrid.innerHTML = related.map(productCardHTML).join(''); attachProductEvents(relGrid); }
}
