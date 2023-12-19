function checkLoginStatus() {
    var isLoggedIn = document.cookie.split(';').some((item) => item.trim().startsWith('username='));
    var loginLink = document.getElementById('login-link');
    var logoutLink = document.getElementById('logout-link');
    var medicamentosLink = document.getElementById('medicamentos-link');
    var medicamentosDropdown = document.getElementById('medicamentos-dropdown');

    loginLink.style.display = isLoggedIn ? 'none' : 'block';
    logoutLink.style.display = isLoggedIn ? 'block' : 'none';

    if (isLoggedIn) {
        medicamentosLink.dataset.bsToggle = 'dropdown';
        medicamentosDropdown.innerHTML = `
        <li><a class="dropdown-item" href="./medicamentos.html#free">Venta libre</a></li>
        <li><a class="dropdown-item" href="./medicamentos.html#recipes">Venta bajo receta</a></li>
        <li><a class="dropdown-item" href="./medicamentos.html#types-med">Tipos</a></li>
        <li><a class="dropdown-item" href="./medicamentos.html#injectables">Inyectables</a></li>
        <li><a class="dropdown-item" href="./medicamentos.html#plants">Plantas medicinales</a></li>
        `;
    } else {
        medicamentosLink.dataset.bsToggle = 'dropdown';
        medicamentosDropdown.innerHTML = `
            <li><span class="dropdown-item dropdown-item-noLogued disabled" tabindex="-1" aria-disabled="true">Debes iniciar sesión y aceptar los términos y condiciones para acceder a esta sección.</span></li>
        `;
    }
}

// farmacias
const contenedorFarmacias = document.querySelector("#container-cards")
const zona = document.querySelectorAll("#zona")

function cargarFarmacias() {
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

// cargar acordeon
const cargarAcordeon = (farmacias) => {
    acordeonFarmacias.innerHTML = ''
    const todasFarmacias = farmacias
    todasFarmacias.forEach(({nombre, direccion, telefono, ubicacion, horario, imagen, Zona}) =>{
        const acordeon = document.createElement("div")
        acordeon.className = "accordion"
        if (!imagen)
        imagen = "../assets/images/img-card-farmacia.png"
        acordeon.innerHTML =  `
        <div class="accordion-body">
            <div id="container-cards" class="container-cards | w-100 | d-flex | justify-content-center | flex-wrap">
            <img src="${imagen}" alt="imagen de farmacia"/>
            <div class="w-100">
                <h2>Farmacia ${nombre}</h2>
                <div class="w-100 | d-flex | flex-column | justify-content-center | text-start | p-2">
                    <p><strong>Zona:</strong> ${Zona}</p>
                    <p><strong>Dirección:</strong> ${direccion}</p>
                    <p><strong>Horarios:</strong> ${horario}</p>
                </div>
                <div class="container-buttons | w-100 | mt-3 | d-flex | justify-content-between">
                    <a href="${telefono}" class="button-call | fw-bold | text-decoration-none | p-2 | ps-4 | pe-4 | rounded-3">Llamar</a>
                    <a href="${ubicacion}" target="__BLANK" class="button-map | fw-bold | text-decoration-none | p-2 | ps-4 | pe-4 | rounded-3">Ver mapa</a>
                </div>
            </div>
        </div> `
        acordeonFarmacias.appendChild(acordeon)
    })
}

// filtro por zona
const filtroZona = (data) =>{
    const searchTerm = search.value.toLowerCase()

    if(zona.value === 'Zona' && searchTerm === '') {
        cargarAcordeon();
    }
}

function cargarAcordeonyFiltro() {
    cargarFarmacias()
    .then(farmaciasData => {
        filtroZona(farmaciasData)
        zona.addEventListener("change", () => filtroZona(farmaciasData))
    })
    .catch(error => {
        console.error("Error durante la carga de datos:", error)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    cargarAcordeonyFiltro();
});

function obtenerNombreDia(fecha) {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return diasSemana[fecha.getDay()];
}

function cargarCronogramaParaMes(mes) {
    const bodyTable = document.querySelector("#dias-zona");

    cargarFarmaciasDeTurno()
        .then(farmacias => {
            bodyTable.innerHTML = '';
            const farmaciasActivas = farmacias.filter(({ estado }) => estado === "Activo");

            farmaciasActivas.forEach(({ nombre, turnos, Zona }) => {
                if (turnos && turnos[mes]) {
                    turnos[mes].forEach(fecha => {
                        const fechaObj = new Date(fecha);
                        const nombreDia = obtenerNombreDia(fechaObj);
                        const diaMes = fechaObj.getDate();

                        bodyTable.innerHTML += `
                            <tr>
                                <td class="farma-fecha borde-right">${nombreDia} ${diaMes}</td>
                                <td class="farma-lugar borde-right">${nombre}</td>
                                <td class="farma-lugar">${Zona}</td>
                            </tr>`;
                    });
                }
            });
        })
        .catch(error => {
            console.error("Hubo un error al cargar las farmacias:", error);
        });
}

function cargarCronogramaParaMesActual() {
    const buttonsMonths = document.querySelectorAll(".tabla-meses a.mesAnual");
    const fechaActual = new Date();
    const nombreMesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fechaActual);

    let botonActivo = null;

    buttonsMonths.forEach(button => {
        const nombreMes = button.getAttribute("data-month");

        button.addEventListener("click", () => {
            buttonsMonths.forEach(btn => btn.classList.remove("active-month"));

            if (nombreMes.toLowerCase() === nombreMesActual.toLowerCase()) {
                botonActivo = button;
            }

            button.classList.add("active-month");
            cargarCronogramaParaMes(nombreMes);
        });
    });

    if (botonActivo === null) {
        const botonMesActual = Array.from(buttonsMonths).find(btn => btn.getAttribute("data-month").toLowerCase() === nombreMesActual.toLowerCase());
        if (botonMesActual) {
            botonMesActual.click();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCronogramaParaMesActual();
});


// Función para manejar el cierre de sesión
function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkLoginStatus();
    window.location.href = '../index.html';
}

window.onload = checkLoginStatus;