// ============================================================
//  BOOK HAVEN - Main JavaScript (Cart + Products + UI)
// ============================================================

/* ---------- Cart Management ---------- */
const Cart = {
  get() {
    return JSON.parse(localStorage.getItem('bookHavenCart') || '[]');
  },
  save(items) {
    localStorage.setItem('bookHavenCart', JSON.stringify(items));
    Cart.updateBadge();
  },
  add(book, qty = 1) {
    const items = Cart.get();
    const idx = items.findIndex(i => i.id === book.id);
    if (idx >= 0) {
      items[idx].qty += qty;
    } else {
      items.push({ ...book, qty });
    }
    Cart.save(items);
    showToast(`"${book.title}" added to cart! 🛒`, 'success');
  },
  remove(id) {
    const items = Cart.get().filter(i => i.id !== id);
    Cart.save(items);
  },
  updateQty(id, qty) {
    const items = Cart.get();
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) {
      if (qty <= 0) {
        items.splice(idx, 1);
      } else {
        items[idx].qty = qty;
      }
    }
    Cart.save(items);
  },
  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  count() {
    return Cart.get().reduce((sum, i) => sum + i.qty, 0);
  },
  clear() {
    localStorage.removeItem('bookHavenCart');
    Cart.updateBadge();
  },
  updateBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) {
      const count = Cart.count();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
};

/* ---------- Toast Notification ---------- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '📢'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

/* ---------- Loading Spinner ---------- */
function showLoading() {
  const el = document.getElementById('loadingSpinner');
  if (el) el.style.display = 'flex';
}
function hideLoading() {
  const el = document.getElementById('loadingSpinner');
  if (el) el.style.display = 'none';
}

/* ---------- Render Book Cards ---------- */
function renderBookCard(book) {
  const coverBg = getCoverGradient(book.category);
  const coverHtml = book.cover_image
    ? `<img src="${book.cover_image}" alt="${escapeHtml(book.title)}" loading="lazy" onerror="this.parentElement.innerHTML=getPlaceholderCover('${escapeHtml(book.title)}','${escapeHtml(book.author||'')}','${coverBg}')">`
    : `<div class="book-cover-placeholder" style="background:${coverBg}">
        <div class="book-icon">📚</div>
        <div class="placeholder-title">${escapeHtml(book.title)}</div>
        <div class="placeholder-author">${escapeHtml(book.author || '')}</div>
       </div>`;

  const badge = book.is_featured ? '<span class="book-badge badge-gold">⭐ Featured</span>' :
                book.stock === 0 ? '<span class="book-badge badge-accent">Out of Stock</span>' :
                book.stock < 5 ? '<span class="book-badge" style="background:#fd7e14;color:#fff">Low Stock</span>' : '';

  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover">
        ${coverHtml}
        ${badge}
        <div class="book-actions">
          <button class="action-btn" title="Quick view" onclick="quickView(${book.id})">👁️</button>
          <button class="action-btn" title="Add to wishlist">♡</button>
        </div>
      </div>
      <div class="book-info">
        <div class="book-category">${escapeHtml(book.category || 'General')}</div>
        <h3 class="book-title">${escapeHtml(book.title)}</h3>
        <p class="book-author">by ${escapeHtml(book.author || 'Unknown')}</p>
        <div class="book-rating">
          <span class="stars">★★★★★</span>
          <span class="rating-count">(${Math.floor(Math.random()*200)+20})</span>
        </div>
        <div class="book-footer">
          <div class="book-price">
            <span class="price-rs">Rs. ${Number(book.price).toLocaleString()}</span>
          </div>
          ${book.stock > 0
            ? `<button class="add-to-cart" onclick="addBookToCart(this, ${JSON.stringify(book).replace(/"/g,'&quot;')})">
                🛒 Add
               </button>`
            : `<span style="font-size:0.8rem;color:#dc3545;font-weight:600">Out of Stock</span>`
          }
        </div>
      </div>
    </div>`;
}

function addBookToCart(btn, book) {
  Cart.add(book, 1);
  btn.textContent = '✓ Added!';
  btn.style.background = '#28a745';
  setTimeout(() => { btn.innerHTML = '🛒 Add'; btn.style.background = ''; }, 1500);
}

/* ---------- Gradient Covers ---------- */
const gradients = {
  'Fiction': 'linear-gradient(135deg,#667eea,#764ba2)',
  'Non-Fiction': 'linear-gradient(135deg,#f093fb,#f5576c)',
  'Science': 'linear-gradient(135deg,#4facfe,#00f2fe)',
  'History': 'linear-gradient(135deg,#43e97b,#38f9d7)',
  'Religion': 'linear-gradient(135deg,#fa709a,#fee140)',
  'Technology': 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'Business': 'linear-gradient(135deg,#ffecd2,#fcb69f)',
  'Children': 'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
  'Poetry': 'linear-gradient(135deg,#fccb90,#d57eeb)',
  'Default': 'linear-gradient(135deg,#667eea,#764ba2)'
};
function getCoverGradient(category) {
  return gradients[category] || gradients.Default;
}
function getPlaceholderCover(title, author, bg) {
  return `<div class="book-cover-placeholder" style="background:${bg}">
    <div class="book-icon">📚</div>
    <div class="placeholder-title">${title}</div>
    <div class="placeholder-author">${author}</div>
  </div>`;
}

/* ---------- Fetch & Render Products ---------- */
async function loadProducts(filters = {}) {
  const grid = document.getElementById('booksGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

  try {
    let query = supabase.from(TABLES.BOOKS).select('*').eq('is_active', true).gt('stock', 0).order('created_at', { ascending: false });

    if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    if (filters.sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false });
    if (filters.featured) query = query.eq('is_featured', true);

    const { data, error } = await query;
    if (error) throw error;

    const countEl = document.getElementById('resultsCount');
    if (countEl) countEl.textContent = `${data.length} books found`;

    if (data.length === 0) {
      grid.innerHTML = `<div class="no-results">
        <div class="no-results-icon">📚</div>
        <h3>No books found</h3>
        <p>Try different filters or search terms</p>
      </div>`;
      return;
    }
    grid.innerHTML = data.map(renderBookCard).join('');
  } catch (err) {
    grid.innerHTML = `<div class="no-results"><div class="no-results-icon">⚠️</div><h3>Failed to load books</h3><p>${err.message}</p></div>`;
  }
}

/* ---------- Category Counts ---------- */
async function loadCategoryCounts() {
  try {
    const { data } = await supabase.from(TABLES.BOOKS).select('category').eq('is_active', true).gt('stock', 0);
    const counts = {};
    if (data) data.forEach(b => { counts[b.category] = (counts[b.category] || 0) + 1; });
    document.querySelectorAll('.category-card').forEach(card => {
      const cat = card.dataset.category;
      const countEl = card.querySelector('.category-count');
      if (countEl && cat) countEl.textContent = (counts[cat] || 0) + ' books';
    });
  } catch {}
}

/* ---------- Search ---------- */
function initSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  if (!form || !input) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    loadProducts({ search: input.value.trim() });
  });
}

/* ---------- Filters ---------- */
function initFilters() {
  const sort = document.getElementById('sortSelect');
  const cat = document.getElementById('categoryFilter');
  const apply = () => {
    const filters = {};
    if (sort) filters.sort = sort.value;
    if (cat) filters.category = cat.value;
    const search = document.getElementById('searchInput');
    if (search) filters.search = search.value.trim();
    loadProducts(filters);
  };
  if (sort) sort.addEventListener('change', apply);
  if (cat) cat.addEventListener('change', apply);

  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const filters = { category: card.dataset.category === 'all' ? '' : card.dataset.category };
      if (cat) cat.value = card.dataset.category || 'all';
      loadProducts(filters);
    });
  });
}

/* ---------- Helpers ---------- */
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatCurrency(amount) {
  return 'Rs. ' + Number(amount).toLocaleString('en-PK');
}

/* ---------- Quick View (simple) ---------- */
async function quickView(bookId) {
  const { data: book } = await supabase.from(TABLES.BOOKS).select('*').eq('id', bookId).single();
  if (!book) return;
  const existing = document.getElementById('quickViewModal');
  if (existing) existing.remove();

  const coverBg = getCoverGradient(book.category);
  const coverHtml = book.cover_image
    ? `<img src="${book.cover_image}" alt="${escapeHtml(book.title)}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
    : `<div style="width:100%;height:100%;background:${coverBg};border-radius:12px;display:flex;align-items:center;justify-content:center;flex-direction:column;color:white;font-size:3rem;">📚</div>`;

  const modal = document.createElement('div');
  modal.id = 'quickViewModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:700px;border-radius:20px;overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 1.5fr;">
        <div style="height:350px;background:${coverBg};">${coverHtml}</div>
        <div style="padding:30px;overflow-y:auto;">
          <button onclick="document.getElementById('quickViewModal').remove()" style="float:right;background:none;border:none;font-size:1.3rem;cursor:pointer;">✕</button>
          <div style="font-size:0.8rem;font-weight:700;color:#e94560;text-transform:uppercase;margin-bottom:8px;">${escapeHtml(book.category || 'General')}</div>
          <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:6px;">${escapeHtml(book.title)}</h2>
          <p style="color:#6c757d;margin-bottom:16px;">by ${escapeHtml(book.author || 'Unknown')}</p>
          <p style="font-size:0.9rem;color:#444;line-height:1.7;margin-bottom:20px;">${escapeHtml(book.description || 'No description available.')}</p>
          <div style="font-size:2rem;font-weight:800;color:#e94560;margin-bottom:20px;">Rs. ${Number(book.price).toLocaleString()}</div>
          <div style="display:flex;gap:10px;">
            ${book.stock > 0
              ? `<button class="btn btn-primary" onclick="Cart.add(${JSON.stringify(book).replace(/"/g,'&quot;')},1);document.getElementById('quickViewModal').remove();">🛒 Add to Cart</button>`
              : '<span style="color:#dc3545;font-weight:600">Out of Stock</span>'}
          </div>
          <div style="margin-top:16px;font-size:0.82rem;color:#6c757d;">
            ${book.stock > 0 ? `✅ ${book.stock} in stock` : '❌ Out of stock'}
            ${book.pages ? ` • ${book.pages} pages` : ''}
            ${book.isbn ? ` • ISBN: ${book.isbn}` : ''}
          </div>
        </div>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initSearch();
  initFilters();

  if (document.getElementById('booksGrid')) {
    loadProducts();
    loadCategoryCounts();
  }
});
