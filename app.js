(() => {
  const CART_KEY = "miniblend_cart_v1";

  function formatPrice(number) {
    return new Intl.NumberFormat("vi-VN").format(number) + "đ";
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function updateCartBadge() {
    const totalQty = getCart().reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = String(totalQty);
    });
  }

  function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart(cart);
    updateCartBadge();
    alert("Da them vao gio hang: " + name);
  }

  function bindAddToCartButtons() {
    document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name") || "San pham";
        const price = Number(button.getAttribute("data-price") || 0);
        addToCart(name, price);
      });
    });
  }

  function renderCartCheckout() {
    const cartItemsWrap = document.getElementById("cartItems");
    const cartTotalText = document.getElementById("cartTotalText");
    if (!cartItemsWrap || !cartTotalText) return;

    const cart = getCart();
    if (cart.length === 0) {
      cartItemsWrap.innerHTML = `
        <article class="support-card">
          <h3>Gio hang dang trong</h3>
          <p>Hay them san pham tu trang danh muc hoac trang chu.</p>
        </article>
      `;
      cartTotalText.textContent = "0đ";
      return;
    }

    cartItemsWrap.innerHTML = cart
      .map((item) => {
        const lineTotal = item.price * item.qty;
        return `
          <article class="support-card">
            <h3>${item.name}</h3>
            <p>So luong: ${item.qty} - Don gia: ${formatPrice(item.price)}</p>
            <p><strong>Tam tinh: ${formatPrice(lineTotal)}</strong></p>
          </article>
        `;
      })
      .join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalText.textContent = formatPrice(total);
  }

  bindAddToCartButtons();
  updateCartBadge();
  renderCartCheckout();
})();
