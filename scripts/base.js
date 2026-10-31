const navbutton = document.querySelector('#nav-button');
const navlinks = document.querySelector('#nav-bar');

navbutton.addEventListener('click', () => {
    const open = navbutton.classList.toggle('show');
    navlinks.classList.toggle('show');
    navbutton.setAttribute('aria-expanded', open);
});

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#lastModified').textContent = document.lastModified;