const $ = (selector) => document.querySelector(selector)

const btn = $('.button-submit')

$('#form').addEventListener('submit', function(e) {
    e.preventDefault();

    btn.innerText = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_z5jpplf';

    emailjs.sendForm(serviceID, templateID, this).then(() => {
        btn.innerText = 'Enviar';
        $("#modal-container").style.display = "block"
        $("#btn-close-modal").addEventListener("click", () => {
            $("#modal-container").style.display = "none"
        })
    }, (err) => {
        btn.innerText = 'Enviar';
        alert(JSON.stringify(err));
    });
});


// Navbar Active 
let linkElements = document.querySelectorAll('.nav-link')

for(let i=0; i<linkElements.length-1; i++){
    linkElements[i].addEventListener('click', () => {
        $('.active').classList.remove('active')
        linkElements[i].classList.add('active')
    })
}
