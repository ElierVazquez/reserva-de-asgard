/* ---------------- Helpers cookies / storage ---------------- */
function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim();
    if (c.startsWith(name + '=')) {
      try {
        return decodeURIComponent(c.substring(name.length + 1));
      } catch (e) {
        return c.substring(name.length + 1);
      }
    }
  }
  return null;
}

function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function safeJSONParse(val, fallback = null) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

/* ---------------- Elementos del DOM (con guardas) ---------------- */
const cartIcon = document.getElementById('cart-icon');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart');
const addCartBtn = document.getElementById('add-cart');
const closeCartBtn = document.getElementById('iconCartClose');

/* ---------------- Inicializar carrito (cookie -> localStorage -> vacío) ---------------- */
let cart = [];

// 1) intentar leer cookie 'cart'
const cookieVal = getCookie('cart');
if (cookieVal) {
  const parsed = safeJSONParse(cookieVal, null);
  if (Array.isArray(parsed)) {
    cart = parsed;
  }
}

// 2) si no hay cookie válida, intentar localStorage
if (!Array.isArray(cart) || cart.length === 0) {
  try {
    const ls = localStorage.getItem('cart');
    const parsedLS = safeJSONParse(ls, null);
    if (Array.isArray(parsedLS) && parsedLS.length > 0) {
      cart = parsedLS;
    }
  } catch (e) {
    // ignore
  }
}

// Asegurar estructura consistente
cart = Array.isArray(cart) ? cart : [];

/* ---------------- Guardar carrito (cookie + localStorage) ---------------- */
function saveCart() {
  try {
    const serialized = JSON.stringify(cart);
    localStorage.setItem('cart', serialized);
    setCookie('cart', serialized, 30); // expira en 30 días
  } catch (e) {
    console.error('No se pudo guardar el carrito:', e);
  }
}

/* ---------------- UI / Lógica ---------------- */
function formatEuro(n) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function updateCartDisplay() {
  // Protecciones por si los elementos no existen
  if (cartItemsContainer) cartItemsContainer.innerHTML = '';
  let total = 0;

  if (!Array.isArray(cart) || cart.length === 0) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = '<p style="opacity:.8">Tu carrito está vacío.</p>';
  } else {
    cart.forEach((item, index) => {
      // normalizar item (seguro si viene de cookie/localStorage)
      const name = item.name || item.nombre || 'Producto';
      const price = Number(item.price ?? item.precio ?? 0);

      const div = document.createElement('div');
      div.className = 'cart-row';
      div.innerHTML = `
        <div class="cart-row-left">
          <div class="cart-thumb" aria-hidden="true"></div>
          <div class="cart-meta">
            <strong class="cart-name">${escapeHtml(name)}</strong>
            <div class="cart-price">${formatEuro(price)}</div>
          </div>
        </div>
        <div class="cart-row-right">
          <button class="remove-btn" data-action="remove" data-index="${index}">Eliminar</button>
        </div>
      `;
      if (cartItemsContainer) cartItemsContainer.appendChild(div);
      total += isNaN(price) ? 0 : price;
    });
  }

  if (cartTotal) cartTotal.textContent = `Total: ${formatEuro(total)}`;
  if (cartCount) cartCount.textContent = String(cart.length);

  saveCart();
}

/* small helper to avoid XSS if nombres vienen de fuera */
function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ---------------- Abrir/Cerrar panel ---------------- */
function toggleCartPanel(show) {
  if (!cartPanel) return;
  const isOpen = cartPanel.classList.contains('open');
  if (typeof show === 'boolean') {
    if (show && !isOpen) cartPanel.classList.add('open');
    if (!show && isOpen) cartPanel.classList.remove('open');
  } else {
    cartPanel.classList.toggle('open');
  }
}

/* listeners seguros (si existen los elementos) */
if (cartIcon) cartIcon.addEventListener('click', () => toggleCartPanel(true));
if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCartPanel(false));

/* ---------------- Remover item vía delegación si existe contenedor ---------------- */
if (cartItemsContainer) {
  cartItemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="remove"]');
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    if (!Number.isNaN(idx) && idx >= 0 && idx < cart.length) {
      cart.splice(idx, 1);
      updateCartDisplay();
    }
  });
}

/* ---------------- Botones .add para añadir productos ----------------
   Espera que el DOM tenga botones con clase 'add' y atributos:
   data-name y data-price  (tal como en tu HTML original)
*/
document.querySelectorAll('.add').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.closest('[data-name][data-price]') || btn.parentElement;
    const name = product?.dataset?.name || product?.getAttribute('data-name') || 'Producto';
    const priceRaw = product?.dataset?.price || product?.getAttribute('data-price') || '0';
    const price = parseFloat(priceRaw.toString().replace(',', '.')) || 0;

    cart.push({ name: String(name), price: Number(price) });
    updateCartDisplay();

    // animación botón "añadido" si existe addCartBtn (id='add-cart') o btn mismo
    const btnToAnimate = addCartBtn || btn;
    if (btnToAnimate) {
      const originalText = btnToAnimate.textContent;
      btnToAnimate.textContent = '¡Añadido al carrito!';
      btnToAnimate.classList?.add('glow');
      setTimeout(() => {
        btnToAnimate.textContent = originalText;
        btnToAnimate.classList?.remove('glow');
      }, 1600);
    }
  });
});

/* ---------------- Vaciar carrito ---------------- */
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    saveCart();
    updateCartDisplay();
  });
}

/* ---------------- Inicialización UI ---------------- */
updateCartDisplay();

/* ---------------- Opcional: permitir cerrar con ESC ---------------- */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleCartPanel(false);
});
