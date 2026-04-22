(() => {
  const CART_KEY = "miniblend_cart_v1";
  const PRODUCT_CATALOG = {
    air: {
      name: "MiniBlend Air",
      price: 299000,
      desc: "Dòng nhẹ và gọn nhất, phù hợp nhu cầu xay trái cây mềm hàng ngày.",
      image: "IMG/Picture5.png",
      imageSub1: "IMG/Picture2.png",
      imageSub2: "IMG/Picture3.png",
    },
    basic: {
      name: "MiniBlend Basic",
      price: 329000,
      desc: "Mẫu tiêu chuẩn, nhỏ gọn, phù hợp sinh viên và nhu cầu xay cá nhân mỗi ngày.",
      image: "IMG/Picture6.png",
      imageSub1: "IMG/Picture3.png",
      imageSub2: "IMG/Picture4.png",
    },
    pro: {
      name: "MiniBlend Pro",
      price: 399000,
      desc: "Động cơ khỏe hơn, xay mịn nhanh, phù hợp người dùng thường xuyên.",
      image: "IMG/Picture7.png",
      imageSub1: "IMG/Picture4.png",
      imageSub2: "IMG/Picture8.png",
    },
    plus: {
      name: "MiniBlend Plus",
      price: 459000,
      desc: "Dung tích 500ml, pin 2000mAh, sạc USB-C, tối ưu cho nhu cầu xay đa dạng.",
      image: "IMG/Picture8.png",
      imageSub1: "IMG/Picture3.png",
      imageSub2: "IMG/Picture4.png",
    },
    sport: {
      name: "MiniBlend Sport",
      price: 489000,
      desc: "Thiết kế năng động, xay nhanh và tiện mang theo cho người tập luyện.",
      image: "IMG/Picture9.png",
      imageSub1: "IMG/Picture11.png",
      imageSub2: "IMG/Picture12.png",
    },
    family: {
      name: "MiniBlend Family",
      price: 539000,
      desc: "Dung tích lớn hơn, phù hợp gia đình trẻ hoặc nhu cầu chuẩn bị nhiều phần.",
      image: "IMG/Picture3.png",
      imageSub1: "IMG/Picture4.png",
      imageSub2: "IMG/Picture13.png",
    },
    premium: {
      name: "MiniBlend Premium",
      price: 599000,
      desc: "Bản cao cấp với pin khỏe, thân máy chắc chắn và phụ kiện đầy đủ.",
      image: "IMG/Picture4.png",
      imageSub1: "IMG/Picture14.png",
      imageSub2: "IMG/Picture15.png",
    },
  };

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

  function bindProductDetailLinks() {
    document.querySelectorAll(".chart-item[data-product]").forEach((item) => {
      item.style.cursor = "pointer";
      item.addEventListener("click", (event) => {
        if (event.target.closest("[data-add-to-cart]")) return;
        const productKey = item.getAttribute("data-product");
        if (!productKey) return;
        window.location.href = `chi-tiet-san-pham.html?product=${encodeURIComponent(productKey)}`;
      });
    });
  }

  function renderProductDetailPage() {
    const detailName = document.getElementById("detailName");
    const detailDesc = document.getElementById("detailDesc");
    const detailPrice = document.getElementById("detailPrice");
    const detailImage = document.getElementById("detailImage");
    const detailImageSub1 = document.getElementById("detailImageSub1");
    const detailImageSub2 = document.getElementById("detailImageSub2");
    const detailAddBtn = document.getElementById("detailAddToCartBtn");
    if (!detailName || !detailDesc || !detailPrice || !detailImage || !detailAddBtn) return;

    const params = new URLSearchParams(window.location.search);
    const key = params.get("product") || "plus";
    const product = PRODUCT_CATALOG[key] || PRODUCT_CATALOG.plus;

    detailName.textContent = product.name;
    detailDesc.textContent = product.desc;
    detailPrice.textContent = formatPrice(product.price);
    detailImage.src = product.image;
    detailImage.alt = product.name;
    if (detailImageSub1) detailImageSub1.src = product.imageSub1 || product.image;
    if (detailImageSub2) detailImageSub2.src = product.imageSub2 || product.image;
    detailAddBtn.setAttribute("data-name", product.name);
    detailAddBtn.setAttribute("data-price", String(product.price));
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
  bindProductDetailLinks();
  renderProductDetailPage();
  updateCartBadge();
  renderCartCheckout();
})();
