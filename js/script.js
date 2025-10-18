// Menú lateral
function sideMenu() {
    const menuBtn = document.getElementById('icon');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('iconClose');

    function toggleMenu() {
        if (sideMenu.style.right === '0px') {
            sideMenu.style.right = '-250px';
            sideMenu.style.visibility = 'hidden';
        } else {
            sideMenu.style.right = '0px';
            sideMenu.style.visibility = 'visible';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
}

// Carrito
const cartIcon = document.getElementById('cart-icon');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart');
const buyNowBtn = document.getElementById('buy-now');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
}

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
  updateCartDisplay();
});

cartIcon.addEventListener('click', () => {
  cartPanel.classList.toggle('open');
});

buyNowBtn.addEventListener('click', () => {
  cartPanel.classList.add('open');
});

updateCartDisplay();