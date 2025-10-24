// Slide botones
const buttons = document.getElementById('buttons');

window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
        buttons.classList.remove('buttonsBottom');
        buttons.classList.add('buttonsTop');
    } else if (window.scrollY = 100) {
        buttons.classList.remove('buttonsTop');
        buttons.classList.add('buttonsBottom');
    }
});
