const cartButton = document.getElementById('cart-button');
const cartPanel = document.getElementById('cart-panel');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  cartItemsList.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - ${item.precio}€`;
    cartItemsList.appendChild(li);
    total += parseFloat(item.precio);
  });

  cartTotal.textContent = total.toFixed(2) + '€';
  cartCount.textContent = cart.length;
  localStorage.setItem('cart', JSON.stringify(cart));
}

document.querySelectorAll('.comprar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const nombre = btn.getAttribute('data-nombre');
    const precio = btn.getAttribute('data-precio');
    cart.push({ nombre, precio });
    updateCart();
    cartPanel.classList.add('active');
  });
});

cartButton.addEventListener('click', () => {
  cartPanel.classList.toggle('active');
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    cartButton.classList.add('scrolled');
  } else {
    cartButton.classList.remove('scrolled');
  }
});

updateCart();
