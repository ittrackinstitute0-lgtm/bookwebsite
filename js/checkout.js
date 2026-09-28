// ============================================================
//  BOOK HAVEN - Checkout JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  renderOrderReview();
  setupCheckoutForm();
});

function renderOrderReview() {
  const items = Cart.get();
  const container = document.getElementById('orderItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const shippingEl = document.getElementById('checkoutShipping');
  const totalEl = document.getElementById('checkoutTotal');

  if (!items.length) {
    window.location.href = 'cart.html';
    return;
  }

  const subtotal = Cart.total();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (container) {
    container.innerHTML = items.map(item => `
      <div class="review-item">
        <div class="review-item-img" style="background:${getCoverGradient(item.category)};">
          ${item.cover_image
            ? `<img src="${item.cover_image}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'">`
            : '📚'
          }
        </div>
        <div class="review-item-info">
          <div class="review-item-name">${escapeHtml(item.title)}</div>
          <div class="review-item-qty">Qty: ${item.qty}</div>
        </div>
        <div class="review-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</div>
      </div>`).join('');
  }

  if (subtotalEl) subtotalEl.textContent = 'Rs. ' + subtotal.toLocaleString();
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : 'Rs. ' + shipping;
  if (totalEl) totalEl.textContent = 'Rs. ' + total.toLocaleString();
}

function setupCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('placeOrderBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display:inline-block;width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;"></span> Placing Order...';

    try {
      const items = Cart.get();
      if (!items.length) { showToast('Cart is empty!', 'error'); return; }

      const subtotal = Cart.total();
      const shipping = subtotal >= 2000 ? 0 : 150;
      const total = subtotal + shipping;

      const formData = new FormData(form);
      const orderData = {
        customer_name: formData.get('name').trim(),
        customer_email: formData.get('email').trim(),
        customer_phone: formData.get('phone').trim(),
        customer_address: formData.get('address').trim(),
        customer_city: formData.get('city').trim(),
        payment_method: formData.get('payment'),
        notes: formData.get('notes') || '',
        subtotal: subtotal,
        shipping_fee: shipping,
        total_amount: total,
        status: 'pending',
        items_count: Cart.count()
      };

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from(TABLES.ORDERS)
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        book_id: item.id,
        book_title: item.title,
        book_author: item.author || '',
        quantity: item.qty,
        unit_price: item.price,
        total_price: item.price * item.qty
      }));

      const { error: itemsError } = await supabase.from(TABLES.ORDER_ITEMS).insert(orderItems);
      if (itemsError) throw itemsError;

      // Decrease stock
      for (const item of items) {
        await supabase.rpc('decrement_stock', { book_id: item.id, qty: item.qty }).catch(() => null);
      }

      // Clear cart & redirect
      Cart.clear();
      localStorage.setItem('lastOrderId', order.id);
      localStorage.setItem('lastOrderData', JSON.stringify(orderData));
      window.location.href = 'order-success.html';

    } catch (err) {
      console.error(err);
      showToast('Failed to place order: ' + err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '🔒 Place Order';
    }
  });
}
