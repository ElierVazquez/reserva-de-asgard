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