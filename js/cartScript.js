// Carrito
const cartIcon = document.getElementById('cart-icon');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart');
const addCartBtn = document.getElementById('add-cart');
const closeCartBtn = document.getElementById('iconCartClose');

function getCookie(nombre) {
  const cookies = document.cookie.split(';'); // Separa todas las cookies en un array
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim(); // Elimina los espacios en blanco al inicio
    // Busca si el nombre de la cookie coincide
    if (cookie.startsWith(nombre + '=')) {
      // Devuelve el valor de la cookie
      return cookie.substring(nombre.length + 1);
    }
  }
  // Devuelve nada si no se encuentra la cookie
  return "";
}

let cart = JSON.parse(getCookie('cart') || []);

function updateCartDisplay() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${item.name} - ${item.price}€ <button onclick="removeItem(${index})">❌</button>`;
    cartItemsContainer.appendChild(div);
    total += item.price;
  });
  cartTotal.textContent = `Total: ${total}€`;
  cartCount.textContent = cart.length;
  localStorage.setItem('cart', JSON.stringify(cart));
  document.cookie = "cart=" + JSON.stringify(cart) + "; path=/;";
}

function openCart() {
  if (cartPanel.classList.contains('open')) {
      cartPanel.classList.remove('open');
  } else {
      cartPanel.classList.add('open');
  }
}

cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', openCart);

function removeItem(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

document.querySelectorAll('.add').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.parentElement;
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    cart.push({ name, price });
    updateCartDisplay();
  });
});

clearCartBtn.addEventListener('click', () => {
  cart = [];
  document.cookie = "cart=" + JSON.stringify(cart) + "; path=/;";
  updateCartDisplay();
});

updateCartDisplay();

if (addCartBtn !== null) {
  addCartBtn.addEventListener('click', () => {
    var auxBtnContent = addCartBtn.textContent;

    addCartBtn.textContent = '¡Añadido al carrito!';
    addCartBtn.classList.add('glow')
    setTimeout(() => {
      addCartBtn.textContent = auxBtnContent;
      addCartBtn.classList.remove('glow');
    }, 2000);
  });
}