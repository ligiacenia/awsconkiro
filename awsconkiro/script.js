// ===========================
// PRODUCT DATA
// ===========================
const products = [
  {
    id: 1,
    name: "Sueño Nórdico",
    category: "invierno",
    categoryLabel: "Invierno",
    desc: "Relleno de plumas de ganso 90/10. Ultra cálido para noches frías.",
    price: 189.99,
    oldPrice: 229.99,
    emoji: "🌨️",
    bg: "linear-gradient(135deg, #E8F0FE 0%, #B3C8F7 100%)",
    badge: "Más vendido",
    badgeClass: ""
  },
  {
    id: 2,
    name: "Brisa de Algodón",
    category: "verano",
    categoryLabel: "Verano",
    desc: "100% algodón egipcio, transpirable y fresco. Ideal para climas cálidos.",
    price: 129.99,
    oldPrice: null,
    emoji: "☀️",
    bg: "linear-gradient(135deg, #FFFDE7 0%, #FFE082 100%)",
    badge: "Nuevo",
    badgeClass: "new"
  },
  {
    id: 3,
    name: "Polar Luxe",
    category: "invierno",
    categoryLabel: "Invierno",
    desc: "Microfibra de alta densidad con tecnología de calor infrarrojo.",
    price: 259.99,
    oldPrice: 299.99,
    emoji: "❄️",
    bg: "linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)",
    badge: "Premium",
    badgeClass: ""
  },
  {
    id: 4,
    name: "Primavera Rosa",
    category: "verano",
    categoryLabel: "Verano",
    desc: "Diseño floral exclusivo en algodón orgánico certificado.",
    price: 149.99,
    oldPrice: 179.99,
    emoji: "🌸",
    bg: "linear-gradient(135deg, #FCE4EC 0%, #F48FB1 100%)",
    badge: "Oferta",
    badgeClass: "sale"
  },
  {
    id: 5,
    name: "Serenidad Premium",
    category: "premium",
    categoryLabel: "Premium",
    desc: "Seda natural combinada con plumas de pato seleccionadas a mano.",
    price: 349.99,
    oldPrice: 399.99,
    emoji: "👑",
    bg: "linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)",
    badge: "Premium",
    badgeClass: ""
  },
  {
    id: 6,
    name: "Terra Natural",
    category: "premium",
    categoryLabel: "Premium",
    desc: "Relleno de bambú con funda artesanal bordada a mano.",
    price: 299.99,
    oldPrice: null,
    emoji: "🌿",
    bg: "linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%)",
    badge: "Eco",
    badgeClass: "new"
  },
  {
    id: 7,
    name: "Noche Estrellada",
    category: "invierno",
    categoryLabel: "Invierno",
    desc: "Estampado exclusivo con tejido de franela térmica premium.",
    price: 219.99,
    oldPrice: 249.99,
    emoji: "🌙",
    bg: "linear-gradient(135deg, #EDE7F6 0%, #9575CD 100%)",
    badge: "Oferta",
    badgeClass: "sale"
  },
  {
    id: 8,
    name: "Dunas del Mediterráneo",
    category: "verano",
    categoryLabel: "Verano",
    desc: "Lino y algodón de secado rápido, perfecto para viajes y verano.",
    price: 169.99,
    oldPrice: null,
    emoji: "🏖️",
    bg: "linear-gradient(135deg, #FFF8E1 0%, #FFCC80 100%)",
    badge: "Nuevo",
    badgeClass: "new"
  }
];

// ===========================
// CART STATE
// ===========================
let cart = [];

// ===========================
// RENDER PRODUCTS
// ===========================
function renderProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  grid.innerHTML = "";

  filtered.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div class="product-img" style="background: ${product.bg}">
        <span>${product.emoji}</span>
        ${product.badge ? `<span class="product-badge ${product.badgeClass}">${product.badge}</span>` : ""}
      </div>
      <div class="product-info">
        <p class="product-category">${product.categoryLabel}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toFixed(2)}</span>` : ""}
          </div>
          <button class="btn-add" data-id="${product.id}">+ Agregar</button>
        </div>
      </div>
    `;

    // Add to cart
    card.querySelector(".btn-add").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id);
    });

    grid.appendChild(card);
  });
}

// ===========================
// CART FUNCTIONS
// ===========================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`✅ ${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalQty;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Tu carrito está vacío</p>`;
    cartFooter.style.display = "none";
  } else {
    cartFooter.style.display = "block";
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji}</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join("");
  }
}

// ===========================
// TOAST NOTIFICATION
// ===========================
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ===========================
// FILTERS
// ===========================
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

// ===========================
// CART MODAL
// ===========================
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

function openCart() {
  cartModal.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCartFn() {
  cartModal.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartFn);
cartOverlay.addEventListener("click", closeCartFn);

// Checkout button
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return;
  cart = [];
  updateCartUI();
  closeCartFn();
  showToast("🎉 ¡Pedido realizado con éxito! Gracias por tu compra.");
});

// ===========================
// CONTACT FORM
// ===========================
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const success = document.getElementById("formSuccess");
  success.classList.add("visible");
  e.target.reset();

  setTimeout(() => {
    success.classList.remove("visible");
  }, 5000);
});

// ===========================
// MOBILE MENU
// ===========================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 20) {
    navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
  } else {
    navbar.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
  }
});

// ===========================
// SCROLL REVEAL ANIMATION
// ===========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".benefit-item, .testimonial-card, .about-text, .contact-info").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// ===========================
// INIT
// ===========================
renderProducts();
