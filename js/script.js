document.addEventListener('DOMContentLoaded', () => {
  const cart = [];
  const addButtons = document.querySelectorAll('.add');

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product;
      cart.push(product);
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = `${product} añadido al carrito!`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    });
  });
});

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