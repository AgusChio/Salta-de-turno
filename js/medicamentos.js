// Inyectables
function cargarInyectables() {
    fetch('https://api-salta-de-turno.onrender.com/api/inyectables')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error: ' + response.status)
            }
            return response.json()
        })
        .then(data => {
            if (!data || !Array.isArray(data)) {
                throw new Error('Los datos recibidos no son válidos')
            }
            const containerSyringe = document.querySelector("#container-cards-syringe")
            data.forEach(({ nombreInyectable, principioActivo, descripcion }) => {
                const card = document.createElement("div")
                card.className = "card-syringe d-flex align-items-center p-3 rounded-4"
                card.innerHTML = `
                <div class="syringe-img">
                    <img src="../assets/images/syringe.png" alt="Dibujo de jeringa">
                </div>
                <div>
                    <h4 class="fw-bold">${nombreInyectable}</h4>
                    <h6 class="fw-semibold">${principioActivo}</h6>
                    <p class="mb-0">${descripcion}</p>
                </div>`
                containerSyringe.appendChild(card)
            })
        })
        .catch(error => {
            console.error("Hubo un problema con la operación: " + error.message)
        })
}

// Plantas medicinales 
function cargarPlantas() {
    fetch('https://api-salta-de-turno.onrender.com/api/plantasmedicinales')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error: ' + response.status)
            }
            return response.json()
        })
        .then(data => {
            if (!data.plantasMedicinales || !Array.isArray(data.plantasMedicinales)) {
                throw new Error('Los datos recibidos no son válidos')
            }
            const buttons = document.querySelectorAll(".table-plants-category .plants")
            const bodyTable = document.querySelector("#body-table-plants")
            buttons.forEach(button => {
                const category = button.getAttribute("data-category")
                button.addEventListener("click", () => {
                    buttons.forEach(btn => btn.classList.remove("active-plants"))
                    const plantas = data.plantasMedicinales.filter(({ categorias }) => categorias.includes(category))
                    bodyTable.innerHTML = ''
                    plantas.forEach(planta => {
                        bodyTable.innerHTML += `
                <tr>
                    <td class="p-3 | border-right-cell | border-right-cell-plants">${planta.nombreLocal}</td>
                    <td class="p-3 | border-right-cell | border-right-cell-plants">${planta.aplicacionTerapeutica}</td>
                    <td class="p-3 | border-right-cell | border-right-cell-plants">${planta.preparacionYAdministracion}</td>
                    <td class="p-3">${planta.organosVegetalesEmpleados}</td>
                </tr>`
                    })
                    button.classList.add("active-plants")
                })
            })
        })
        .catch(error => {
            console.error("Hubo un problema con la operación: " + error.message)
        })
}


// medicamentos venta libre/venta bajo receta
let medicamentosVentaLibre = [];
let medicamentosBajoReceta = [];

// Función para cargar los medicamentos desde la API
function cargarMedicamentos() {
    fetch('https://api-salta-de-turno.onrender.com/api/medicamentos')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error" + response.status);
            }
            return response.json();
        })
        .then(apiData => {
            if (!apiData.medicamentos || !Array.isArray(apiData.medicamentos)) {
                throw new Error('Los datos recibidos no son válidos');
            }

            medicamentosVentaLibre = apiData.medicamentos.filter(m => m.categoria === 'Venta libre');
            medicamentosBajoReceta = apiData.medicamentos.filter(m => m.categoria === 'Bajo receta');

            renderizarMedicamentos(medicamentosVentaLibre, "contenedor-venta-libre");
            renderizarMedicamentos(medicamentosBajoReceta, "contenedor-bajo-receta");
        })
        .catch(error => {
            console.error("Hubo un problema con la operación fetch: " + error.message);
        });
}

// Función para renderizar medicamentos en el contenedor correspondiente
function renderizarMedicamentos(medicamentos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = '';

    if (medicamentos.length > 0) {
        medicamentos.forEach(medicamento => {
            const card = document.createElement("div");
            card.className = "medicineBox " + (medicamento.categoria === 'Venta libre' ? "MedVentaLibre" : "MedBajoRec");
            card.innerHTML = `
                <div class="text-betw">
                    <p class="text-start m-0"><strong>${medicamento.atc || medicamento.codigoNacional}</strong></p>
                    <p class="text-end m-0">${medicamento.presentacion + " " + medicamento.cantidad}</p>
                </div>
                <div class="nameContent">
                    <h4>${medicamento.nombreComercial}</h4>
                    <p class="line-height-medicamento">${medicamento.principioActivo}</p>
                </div>
                <div class="text-betw">
                    <p class="descripcion-medicamento">${medicamento.descripcion}</p>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } else {
        mostrarMensajeNoEncontrado(contenedorId);
    }
}

// Funciones de búsqueda
function buscarEnVentaLibre() {
    const textoBusqueda = document.getElementById("search-input-medicamento-libre").value;
    if (textoBusqueda.trim() === '') {
        renderizarMedicamentos(medicamentosVentaLibre, "contenedor-venta-libre");
    } else {
        const resultados = medicamentosVentaLibre.filter(m =>
            m.nombreComercial.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
            m.principioActivo.toLowerCase().includes(textoBusqueda.toLowerCase())
        );
        renderizarMedicamentos(resultados, "contenedor-venta-libre");
    }
}

function buscarBajoReceta() {
    const textoBusqueda = document.getElementById("search-input-medicamento-bajo-receta").value;
    if (textoBusqueda.trim() === '') {
        renderizarMedicamentos(medicamentosBajoReceta, "contenedor-bajo-receta");
    } else {
        const resultados = medicamentosBajoReceta.filter(m =>
            m.nombreComercial.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
            m.principioActivo.toLowerCase().includes(textoBusqueda.toLowerCase())
        );
        renderizarMedicamentos(resultados, "contenedor-bajo-receta");
    }
}

// Función para mostrar mensaje de no encontrado
function mostrarMensajeNoEncontrado(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = `
        <div class="mensaje-no-encontrado text-center">
            <img src="../assets/images/img-notFound.png" alt="No encontrado">
            <p>No se encontró el medicamento que buscaba.</p>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    cargarMedicamentos();

    const inputVentaLibre = document.getElementById("search-input-medicamento-libre");
    const inputBajoReceta = document.getElementById("search-input-medicamento-bajo-receta");

    if (inputVentaLibre) {
        inputVentaLibre.addEventListener("input", buscarEnVentaLibre);
    } else {
        console.error("No se encontró el elemento 'search-input-medicamento-libre'");
    }

    if (inputBajoReceta) {
        inputBajoReceta.addEventListener("input", buscarBajoReceta);
    } else {
        console.error("No se encontró el elemento 'search-input-medicamento-bajo-receta'");
    }

    document.getElementById("search-input-medicamento-libre").addEventListener("input", buscarEnVentaLibre);
    document.getElementById("search-input-medicamento-bajo-receta").addEventListener("input", buscarBajoReceta);
});


document.addEventListener("DOMContentLoaded", async () => {
    mostrarLoader();
    try {
        await Promise.all([cargarMedicamentos(), cargarPlantas(), cargarInyectables()]);
        setTimeout(ocultarLoader, 2000);
    } catch (error) {
        console.error("Error durante la carga de datos:", error);
        ocultarLoader();
    }
});



function checkLoginStatus() {
    var isLoggedIn = document.cookie.split(';').some((item) => item.trim().startsWith('username='));

    var loginLink = document.getElementById('login-link');
    var logoutLink = document.getElementById('logout-link');

    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkLoginStatus();
    window.location.href = '../index.html';
}

window.onload = checkLoginStatus;

function mostrarLoader() {
    const contenedorLoader = document.querySelector('#contenedor-loader');
    const loaderHTML = `
        <div class="loadingio-spinner-ripple-xm2ty3k97d">
            <div class="ldio-8ty988q2u8f">
                <div></div>
                <div></div>
            </div>
        </div>`;
    if (contenedorLoader) {
        contenedorLoader.innerHTML = loaderHTML;
    }
}

function ocultarLoader() {
    const loader = document.querySelector('.loadingio-spinner-ripple-xm2ty3k97d');
    if (loader) {
        loader.remove();
    }
}