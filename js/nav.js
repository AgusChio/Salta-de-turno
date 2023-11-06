const $ = (selector) => document.querySelector(selector)

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
        }else{ 
            $('.switch__label').innerText = 'Modo Claro'
            document.body.classList.remove('dark-mode')}
    })
})

$('.close-settings').addEventListener('click', () => {
    settings.classList.add('none')
    settings.classList.add('hide')
})

