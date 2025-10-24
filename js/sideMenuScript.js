// Menú lateral
const menuBtn = document.getElementById('menu-icon');
const sideMenu = document.getElementById('sideMenu');
const closeMenuBtn = document.getElementById('iconMenuClose');

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