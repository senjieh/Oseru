const btnMenu = Array.from(document.querySelectorAll('.button'));

btnMenu.forEach((btns) => {
    btns.addEventListener('click', () => {
        btnMenu.forEach((btns) => {
            btns.classList.remove('selected');
        });
        btns.classList.add('selected');
    });
});