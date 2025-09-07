
            // Function to update a cart item in Shopify
      async function updateCartElemnts(variantId, newQuantity) {
        try {
          const response = await fetch("/cart/change.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              id: variantId,
              quantity: newQuantity
            }),
            credentials: "same-origin" 
          });

          if (!response.ok) {
            throw new Error(`Error updating cart: ${response.statusText}`);
          }

          const cartData = await response.json();
          return cartData;

        } catch (error) {
          console.error("Cart update failed:", error);
          return null;
        }
      }

      // Event listener on the cart list
      const lists = document.getElementById("cart-items");

      lists.addEventListener("click", async (e) => {
        if (e.target.matches(".add-btn")) {
          const card = e.target.closest(".product-card");
          const id = card.dataset.id;
          let itemQty = parseInt(card.querySelector(".item-qty").value, 10) || 0;

          itemQty += 1;
          const cartData = await updateCartElemnts(id, itemQty);
          if (cartData) {
            card.querySelector(".item-qty").value = itemQty;
            const lineItem = cartData.items.find(i => i.id === id);
            if (lineItem) {
              card.querySelector(".line-price").textContent = Shopify.formatMoney(lineItem.line_price);
            }

            card.querySelector('.show-msg').textContent  = 'added ✔'
          }else{
            alert("can't add more to cart")
          }
        }

        if (e.target.matches(".reduce-btn")) {
          const card = e.target.closest(".product-card");
          const id = card.dataset.id;
          let itemQty = parseInt(card.querySelector(".item-qty").value, 10) || 0;

          if (itemQty > 1) {
            itemQty --;
            const cartData = await updateCartElemnts(id, itemQty);
            if (cartData) {
              card.querySelector(".item-qty").value = itemQty;

              const lineItem = cartData.items.find(i => i.id === id);
              if (lineItem) {
                card.querySelector(".line-price").textContent = Shopify.formatMoney(lineItem.line_price);
              }

              card.querySelector('.show-msg').textContent  = 'Reduced ❌'
              card.update()
            }else{
              alert("can't reduce the cart")
            }
            

          } else {
            // remove when reaching 0
            const cartData = await updateCartElemnts(id, 0);
            if (cartData) {
              card.remove();
              alert( "item removed" );
              
            }
          }
        }

        if (e.target.matches(".remove-btn")) {
          const card = e.target.closest(".product-card");
          const id = card.dataset.id;

          const cartData = await updateCartElemnts(id, 0);
          if (cartData) {
            card.remove();
            
            alert( "item removed" );
          }else{
            alert('failed to remove the item')
          }
        }
      });
            
