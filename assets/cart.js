
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const key = btn.dataset.key;
      const change = parseInt(btn.dataset.change);
      const qtyEl = document.getElementById(`qty-${key}`);
      const newQty = Math.max(0, parseInt(qtyEl.textContent) + change);

      // update cart
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: newQty })
      });
      const cart = await res.json();

      // find the updated line item
      const updatedItem = cart.items.find(i => i.key === key);

      // update quantity
      qtyEl.textContent = updatedItem ? updatedItem.quantity : 0;

      // update line price
      const linePriceEl = qtyEl.closest('li').querySelector('.line-price');
      if (linePriceEl && updatedItem) {
        linePriceEl.textContent = Shopify.formatMoney(updatedItem.line_price);
      }

      // update cart total
      const totalEl = document.querySelector('.cart-total');
      if (totalEl) {
        totalEl.textContent = Shopify.formatMoney(cart.total_price);
      }

      // update cart badge
      const badgeEl = document.querySelector('.cart-badge');
      if (badgeEl) {
        badgeEl.textContent = cart.item_count;
      }
    });
  });


  // Update item in cart by variant ID
async function updateCartItem(variantId, newQuantity) {
  try {
    const response = await fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        id: variantId,      //variant ID
        quantity: newQuantity
      })
    });

    if (!response.ok) {
      throw new Error(`Error updating cart: ${response.statusText}`);
    }

    const cartData = await response.json();

    
    const item = cartData.items.find(i => i.id === variantId);
    const itemQuantity = item ? item.quantity : 0;
    const cartQuantity = cartData.item_count;

    return {
      cartData,       
      itemQuantity,   
      cartQuantity
    };

  } catch (error) {
    console.error("Cart update failed:", error);
    return null;
  }
}

