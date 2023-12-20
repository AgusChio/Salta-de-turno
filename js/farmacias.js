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

// farmacias
async function cargarFarmacias() {
    try {
        const response = await fetch('https://api-salta-de-turno.onrender.com/api/farmacias');
        if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }
        const apiData = await response.json();
        if (!apiData.farmacias || !Array.isArray(apiData.farmacias)) {
            throw new Error('Los datos recibidos no son válidos');
        }
        return apiData.farmacias;
    } catch (error) {
        console.error("Hubo un problema con la operación: " + error.message);
    }
}

function obtenerHorariosDeApertura(horario) {
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
    let aperturaHoy, aperturaHoy2 = false;

    if (esFinDeSemana) {
        aperturaHoy = horario.finDeSemana['apertura' + (diaSemana === 0 ? '2' : '')];
        aperturaHoy2 = horario.finDeSemana['apertura2' + (diaSemana === 0 ? '2' : '')];
    } else {
        aperturaHoy = horario.semana['apertura' + (diaSemana === 0 ? '2' : '')] || horario.semana.apertura;
        aperturaHoy2 = horario.semana['apertura2' + (diaSemana === 0 ? '2' : '')] || horario.semana.apertura2;
    }
    
    const result = {
        apertura: aperturaHoy
    };

    if (aperturaHoy2) {
        result.apertura2 = aperturaHoy2;
    }

    return result;
}

function obtenerHorariosDeCierre(horario) {
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
    let cierreHoy, cierreHoy2, cierrePronto = false;

    try {
        if (horario && (esFinDeSemana ? horario.finDeSemana : horario.semana)) {
            if (esFinDeSemana) {
                cierreHoy = horario.finDeSemana['cierre' + (diaSemana === 0 ? '2' : '')];
                cierreHoy2 = horario.finDeSemana['cierre2' + (diaSemana === 0 ? '2' : '')];
            } else {
                cierreHoy = horario.semana['cierre' + (diaSemana === 0 ? '2' : '')] || horario.semana.cierre;
                cierreHoy2 = horario.semana['cierre2' + (diaSemana === 0 ? '2' : '')] || horario.semana.cierre2;
            }

            if (cierreHoy === '00:00') {
                cierreHoy = '23:59';
            }

            const [horasCierre, minutosCierre] = cierreHoy.split(':').map(Number);
            const horaCierre = horasCierre + minutosCierre / 60;
            const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

            if (horaCierre - horaActual <= 1 && horaCierre - horaActual > 0) {
                cierrePronto = true;
            }
        } else {
            throw new Error('Propiedades no definidas');
        }

        const result = {
            cierre: cierreHoy
        };

        if (cierreHoy2) {
            result.cierre2 = cierreHoy2;
            result.cierrePronto = cierrePronto;
        }

        return result;
    } catch (error) {
        return {
            cierre: 'ABIERTO 24 HORAS',
            cierrePronto: false
        };
    }
}

async function cargarAcordeonFarmacias() {
    try {
        const farmacias = await cargarFarmacias();
        if (farmacias) {
            document.querySelectorAll('.container-cards').forEach(container => container.innerHTML = '');

            farmacias.forEach(farmacia => {
                if (farmacia.Zona) { // Comprobar que la propiedad Zona existe
                    const card = document.createElement('div');
                    const horarioHoy = obtenerHorariosDeCierre(farmacia.horario);
                    const horarioApertura = obtenerHorariosDeApertura(farmacia.horario);
                    card.className = 'card-farmacia';
                    card.innerHTML = `
                        <img src="${farmacia.imagen || '../assets/images/img-card-farmacia.png'}" />
                        <div>
                            <h2>${farmacia.nombre}</h2>
                            ${horarioHoy.cierrePronto ?
                                `<div class="alert | alert-danger | fw-bold" role="alert">CIERRA PRONTO</div>`
                            :
                                `<div class="alert | alert-danger | fw-bold | d-none" role="alert">CIERRA PRONTO</div>`}
                            <div class="w-100 d-flex flex-column justify-content-center text-start">
                                <p><strong>Dirección:</strong> ${farmacia.direccion}</p>
                                ${horarioHoy.cierre === 'ABIERTO 24 HORAS' ?
                                `<p class="text-danger"><strong>ABIERTO 24 HORAS</strong></p>`
                                : horarioHoy.cierre ?
                                    `<div class="d-flex gap-3">
                                        <p><strong>Abre:</strong> ${horarioApertura.apertura}</p>
                                        <p><strong>Cierra:</strong> ${horarioHoy.cierre}</p>
                                    </div>`
                                : `
                                <div class="d-flex gap-3">
                                        <p><strong>Abre:</strong> ---</p>
                                        <p><strong>Cierra:</strong> ---</p>
                                </div>` }
                                ${horarioApertura.apertura2 ? `
                                <div class="d-flex gap-3">
                                        <p><strong>Abre:</strong> ${horarioApertura.apertura2}</p>
                                        <p><strong>Cierra:</strong> ${horarioHoy.cierre2}</p>
                                </div>` : '' }
                            </div>
                            <div class="container-buttons w-100 mt-3 d-flex justify-content-between">
                                <a href="${farmacia.telefono}" class="button-call fw-bold text-decoration-none rounded-3">Llamar</a>
                                <a href="${farmacia.ubicacion}" target="__BLANK" class="button-map fw-bold text-decoration-none rounded-3">Ver mapa</a>
                            </div>
                        </div>`;

                    const containerId = `container-zona-${farmacia.Zona.toLowerCase()}`;
                    const container = document.getElementById(containerId);
                    if (container) {
                        container.appendChild(card);
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error al cargar farmacias en el acordeón: ", error);
    }
}


function obtenerHorarioDeCierre(horario) {
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

    let cierreHoy, cierrePronto = false;

    try {
        if (esFinDeSemana) {
            cierreHoy = horario.finDeSemana['cierre' + (diaSemana === 0 ? '2' : '')]
        } else {
            cierreHoy = horario.semana.cierre;
        }

        if (cierreHoy === '00:00') {
            cierreHoy = '23:59'
        }

        const [horasCierre, minutosCierre] = cierreHoy.split(':').map(Number);
        const horaCierre = horasCierre + minutosCierre / 60;
        const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

        if (horaCierre - horaActual <= 1 && horaCierre - horaActual > 0) {
            cierrePronto = true;
        }
    } catch (error) {
        return {
            cierre: 'ABIERTO 24 HORAS',
            cierrePronto: false
        }
    }

    return {
        cierre: cierreHoy,
        cierrePronto: cierrePronto
    }
}


function obtenerNombreDia(fecha) {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return diasSemana[fecha.getDay()];
}

function cargarCronogramaParaMes(mes) {
    const bodyTable = document.querySelector("#dias-zona");

    cargarFarmacias()
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
    cargarAcordeonFarmacias();
    checkLoginStatus();
});


// Función para manejar el cierre de sesión
function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkLoginStatus();
    window.location.href = '../index.html';
}

window.onload = checkLoginStatus;