// ============================================================
//  BOOK HAVEN - Cart Page JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  renderCartPage();
});

function renderCartPage() {
  const items = Cart.get();
  const wrapper = document.getElementById('cartWrapper');
  const summary = document.getElementById('cartSummary');

  if (!items.length) {
    wrapper.innerHTML = `
      <div class="empty-cart" style="grid-column:1/-1;">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="color:#6c757d;margin-bottom:24px;">Browse our collection and add books you love.</p>
        <a href="products.html" class="btn btn-primary">🔍 Browse Books</a>
      </div>`;
    if (summary) summary.style.display = 'none';
    return;
  }

  // Items
  wrapper.innerHTML = `
    <div class="cart-table">
      <div class="cart-table-header">
        <div>Product</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Total</div>
        <div></div>
      </div>
      ${items.map(item => `
        <div class="cart-item" id="item-${item.id}">
          <div class="cart-item-info">
            <div class="cart-item-img" style="background:${getCoverGradient(item.category)};">
              ${item.cover_image
                ? `<img src="${item.cover_image}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.style.display='none'">`
                : '📚'
              }
            </div>
            <div>
              <div class="cart-item-name">${escapeHtml(item.title)}</div>
              <div class="cart-item-author">by ${escapeHtml(item.author || 'Unknown')}</div>
              <div style="font-size:0.75rem;color:#e94560;margin-top:4px;">${escapeHtml(item.category || '')}</div>
            </div>
          </div>
          <div style="font-weight:600;">Rs. ${Number(item.price).toLocaleString()}</div>
          <div>
            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
              <span class="qty-num" id="qty-${item.id}">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <div style="font-weight:700;color:#e94560;" id="total-${item.id}">Rs. ${(item.price * item.qty).toLocaleString()}</div>
          <div>
            <button class="remove-btn" onclick="removeItem(${item.id})" title="Remove">🗑️</button>
          </div>
        </div>`).join('')}
      <div style="padding:16px 24px;display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap;">
        <a href="products.html" class="btn btn-outline btn-sm">← Continue Shopping</a>
        <button class="btn btn-sm" style="background:#fff3f3;color:#e94560;border:1.5px solid #e94560;" onclick="clearCart()">🗑️ Clear Cart</button>
      </div>
    </div>`;

  renderSummary();
}

function renderSummary() {
  const items = Cart.get();
  const subtotal = Cart.total();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + shipping;

  const summary = document.getElementById('cartSummary');
  if (!summary) return;
  summary.style.display = 'block';
  summary.innerHTML = `
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Subtotal (${Cart.count()} items)</span>
        <span>Rs. ${subtotal.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? '<span style="color:#28a745;font-weight:600">FREE</span>' : 'Rs. ' + shipping}</span>
      </div>
      ${shipping > 0 ? `<div style="font-size:0.78rem;color:#6c757d;margin-bottom:12px;">Add Rs. ${(2000-subtotal).toLocaleString()} more for free shipping!</div>` : ''}
      <div class="summary-row total">
        <span>Total</span>
        <span>Rs. ${total.toLocaleString()}</span>
      </div>
      <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:16px;">
        🔒 Proceed to Checkout
      </a>
      <div style="text-align:center;margin-top:14px;font-size:0.78rem;color:#6c757d;">
        🔒 Secure & Safe Payment
      </div>
      <div style="display:flex;justify-content:center;gap:8px;margin-top:10px;font-size:1.4rem;">
        💳 🏦 💵
      </div>
    </div>`;
}

function changeQty(id, delta) {
  const items = Cart.get();
  const item = items.find(i => i.id === id);
  if (!item) return;
  const newQty = item.qty + delta;
  Cart.updateQty(id, newQty);

  if (newQty <= 0) {
    const el = document.getElementById(`item-${id}`);
    if (el) el.remove();
    const remaining = Cart.get();
    if (!remaining.length) renderCartPage();
    else renderSummary();
    return;
  }

  const qtyEl = document.getElementById(`qty-${id}`);
  const totalEl = document.getElementById(`total-${id}`);
  if (qtyEl) qtyEl.textContent = newQty;
  if (totalEl) totalEl.textContent = 'Rs. ' + (item.price * newQty).toLocaleString();
  renderSummary();
}

function removeItem(id) {
  Cart.remove(id);
  renderCartPage();
  showToast('Item removed from cart', 'info');
}

function clearCart() {
  if (confirm('Remove all items from cart?')) {
    Cart.clear();
    renderCartPage();
  }
}
