// Farmacias de turno 
const contenedorFarmacias = document.querySelector("#container-cards")
const zone = document.querySelector("#zona")
const day = document.querySelector("#date-input")
const search = document.querySelector("#search-input")
const today = new Date()
const fechaHoy = new Date(today.getFullYear(), today.getMonth(), today.getDate())
day.valueAsDate = fechaHoy

const currentMonth = today.getMonth()
const currentDay = today.getDate()
const currentYear = today.getFullYear()

function cargarFarmaciasDeTurno() {
    return fetch('https://api-salta-de-turno.onrender.com/api/farmacias')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error: ' + response.status)
            }
            return response.json()
        })
        .then(apiData => {
            if (!apiData.farmacias || !Array.isArray(apiData.farmacias)) {
                throw new Error('Los datos recibidos no son válidos')
            }
            return apiData.farmacias
        })
        .catch(error => {
            console.error("Hubo un problema con la operación: " + error.message)
        })
}


const obtenerTurnos = (day, month, year, data) => {
    const deTurno24 = data.filter(({ abierto24Horas }) => abierto24Horas)
    const deTurno = data.filter(({ turnos }) => {
        if (turnos && typeof turnos === 'object' && Object.keys(turnos).length > 0) {
            const currentMonthTurnos = turnos ? turnos[Object.keys(turnos)[month]] : undefined

            if (Array.isArray(currentMonthTurnos) && currentMonthTurnos.length > 0) {
                const turnosParaHoy = currentMonthTurnos.filter(turno => {
                    const turnoDate = new Date(turno);
                    return (
                        turnoDate.getMonth() === month &&
                        turnoDate.getDate() === day &&
                        turnoDate.getFullYear() === year
                    )
                })

                return turnosParaHoy.length > 0
            }
        }
        return false
    })
    return farmaciasDeTurno = [...deTurno24, ...deTurno]
}

const mostrarMensajeNoResultados = () => {
    contenedorFarmacias.innerHTML = `
        <div class="div-search">
            <p class="fw-semibold">No se encontraron resultados. Por favor, prueba con otra búsqueda.</p>
            <figure class="w-75 | m-auto"><img src="./assets/images/img-notFound.png" alt="img-notFound"></figure>
        </div>`
}

const cargarFarmacias = (farmacias) => {
    contenedorFarmacias.innerHTML = ''
    const farmaciasActivas = farmacias.filter(({ estado }) => estado === "Activo")
    farmaciasActivas.forEach(({ nombre, direccion, telefono, ubicacion, imagen, Zona }) => {
        const card = document.createElement("div")
        card.className = "card-farmacia"
        if (!imagen)
            imagen = "../assets/images/img-card-farmacia.png"

        card.innerHTML = `
            <img src="${imagen}" alt="imagen de farmacia"/>
            <div class="w-100">
                <h2>Farmacia ${nombre}</h2>
                <div class="w-100 | d-flex | flex-column | justify-content-center | text-start | p-2">
                    <p><strong>Zona:</strong> ${Zona}</p>
                    <p><strong>Dirección:</strong> ${direccion}</p>
                </div>
                <div class="container-buttons | w-100 | mt-3 | d-flex | justify-content-between">
                    <a href="${telefono}" class="button-call | fw-bold | text-decoration-none | p-2 | ps-4 | pe-4 | rounded-3">Llamar</a>
                    <a href="${ubicacion}" target="__BLANK" class="button-map | fw-bold | text-decoration-none | p-2 | ps-4 | pe-4 | rounded-3">Ver mapa</a>
                </div>
            </div>`
        contenedorFarmacias.appendChild(card)
    })
}

const filters = (data) => {
    const dateSelected = new Date(day.value)
    const dayInput = dateSelected.getDate() + 1
    const monthInput = dateSelected.getMonth()
    const yearInput = dateSelected.getFullYear()
    const turnosInput = obtenerTurnos(dayInput, monthInput, yearInput, data)
    const searchTerm = search.value.toLowerCase()

    if (zone.value === 'Zona' && searchTerm === '') {
        cargarFarmacias(turnosInput);
    } else {
        const filteredTurnos = turnosInput.filter(({ Zona, nombre }) =>
            (zone.value === 'Zona' || zone.value === Zona) &&
            nombre.toLowerCase().includes(searchTerm)
        )

        if (filteredTurnos.length > 0) {
            cargarFarmacias(filteredTurnos)
        } else {
            mostrarMensajeNoResultados()
        }
    }
}

function cargarFarmaciasYFiltros() {
    cargarFarmaciasDeTurno()
        .then(farmaciasData => {
            const turnos = obtenerTurnos(currentDay, currentMonth, currentYear, farmaciasData)
            cargarFarmacias(turnos)
            filters(farmaciasData)
            zone.addEventListener("change", () => filters(farmaciasData))
            day.addEventListener("change", () => filters(farmaciasData))
            search.addEventListener("input", () => filters(farmaciasData))
        })
        .catch(error => {
            console.error("Error durante la carga de datos:", error)
        })
}

const form = document.querySelector('#form')
const btn = document.querySelector('.button-submit')

document.addEventListener("DOMContentLoaded", () => {
    cargarFarmaciasYFiltros();
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        btn.innerText = 'Enviando...';

        const serviceID = 'default_service';
        const templateID = 'template_z5jpplf';

        emailjs.sendForm(serviceID, templateID, this).then(() => {
            btn.innerText = 'Enviar';
            resetForm(form);
            // Muestra la alerta SweetAlert
            Swal.fire({
                title: '¡Enviado!',
                text: 'Tu mensaje ha sido enviado correctamente.',
                icon: 'success',
                timer: 3000, // Tiempo en milisegundos
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        }, (err) => {
            btn.innerText = 'Enviar';
            alert(JSON.stringify(err));
        });
    });

    function resetForm(form) {
        form.reset();
    }
});


function checkLoginStatus() {
    var isLoggedIn = document.cookie.split(';').some((item) => item.trim().startsWith('username='));
    var loginLink = document.getElementById('login-link');
    var logoutLink = document.getElementById('logout-link');
    var medicamentosLink = document.getElementById('medicamentos-link');
    var medicamentosDropdown = document.getElementById('medicamentos-dropdown');
    var footerMedicamentosLinks = document.getElementById('footer-links-medicamentos');

    loginLink.style.display = isLoggedIn ? 'none' : 'block';
    logoutLink.style.display = isLoggedIn ? 'block' : 'none';

    if (isLoggedIn) {
        medicamentosLink.dataset.bsToggle = 'dropdown';
        medicamentosDropdown.innerHTML = `
            <li><a class="dropdown-item" href="./pages/medicamentos.html#free">Venta libre</a></li>
            <li><a class="dropdown-item" href="./pages/medicamentos.html#recipes">Venta bajo receta</a></li>
            <li><a class="dropdown-item" href="./pages/medicamentos.html#types-med">Tipos</a></li>
            <li><a class="dropdown-item" href="./pages/medicamentos.html#injectables">Inyectables</a></li>
            <li><a class="dropdown-item" href="./pages/medicamentos.html#plants">Plantas medicinales</a></li>`; // Contenido para usuarios logueados
        footerMedicamentosLinks.innerHTML = `
            <li><a href="./pages/medicamentos.html#free" class="text-decoration-none">Venta libre</a></li>
            <li><a href="./pages/medicamentos.html#recipes" class="text-decoration-none">Venta bajo receta</a></li>
            <li><a href="./pages/medicamentos.html#types-med" class="text-decoration-none">Tipos</a></li>
            <li><a href="./pages/medicamentos.html#injectables" class="text-decoration-none">Inyectables de venta libre</a></li>
            <li><a href="./pages/medicamentos.html#plants" class="text-decoration-none">Plantas medicinales</a></li>
        `; 
    } else {
        medicamentosLink.dataset.bsToggle = 'dropdown';
        medicamentosDropdown.innerHTML = `
            <li><span class="dropdown-item dropdown-item-noLogued disabled" tabindex="-1" aria-disabled="true">Debes iniciar sesión y aceptar los términos y condiciones para acceder a esta sección.</span></li>
        `;
        footerMedicamentosLinks.innerHTML = `
            <li><span class="dropdown-item dropdown-item-noLogued disabled" tabindex="-1" aria-disabled="true">Debes iniciar sesión y aceptar los términos y condiciones para acceder a esta sección.</span></li>
        `;
    }
}

// Función para manejar el cierre de sesión
function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkLoginStatus();
    window.location.href = 'index.html';
}

window.onload = checkLoginStatus;