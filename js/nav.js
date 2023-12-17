const $ = (selector) => document.querySelector(selector)

// localStorage
document.addEventListener('DOMContentLoaded', function() {
    const modoAlmacenado = localStorage.getItem('modo')
    if (modoAlmacenado === 'oscuro') {
        document.body.classList.add('dark-mode')
        $('#check').checked = true
        $('.switch__label').innerText = 'Modo Oscuro'
    }
})

$('.navbar-toggler').addEventListener('click', () => {
    $('.navbar-dropdown').classList.remove('none')
    $('.navbar-dropdown').classList.remove('hide')
})

$('.btn-close').addEventListener('click', () => {
    $('.navbar-dropdown').classList.add('none')
    $('.navbar-dropdown').classList.add('hide')
})

const settings = document.querySelector('.settings')

$('.icon-settings').addEventListener('click', () => {
    settings.classList.remove('none')
    settings.classList.remove('hide')
    $("#check").addEventListener("input", (e) => {
        if(e.target.checked){ 
            $('.switch__label').innerText = 'Modo Oscuro' 
            document.body.classList.add('dark-mode') 
            localStorage.setItem('modo', 'oscuro')
        }else{ 
            $('.switch__label').innerText = 'Modo Claro'
            document.body.classList.remove('dark-mode')
            localStorage.setItem('modo', 'claro')
        }
    })
})

$('.close-settings').addEventListener('click', () => {
    settings.classList.add('none')
    settings.classList.add('hide')
})

// Navbar Active 
let linkElements = document.querySelectorAll('.nav-link')

for(let i=0; i<linkElements.length-1; i++){
    linkElements[i].addEventListener('click', () => {
        $('.active').classList.remove('active')
        linkElements[i].classList.add('active')
    })
}

// Scroll
const navbar = $(".navbar")
const navbarDrop = $(".navbar-dropdown")
document.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.style.backgroundColor = 'var(--bg-nav-scroll)'
        if (window.innerWidth >= 992)
            navbarDrop.style.backgroundColor = 'transparent'
    } else {
        navbarDrop.style.backgroundColor = 'var(--bg-color-main)'
        navbar.style.backgroundColor = 'var(--bg-color-main)'
    }
})