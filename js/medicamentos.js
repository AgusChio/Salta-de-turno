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
        
        const contenedorVentaLibre = document.getElementById("contenedor-venta-libre");
        const contenedorBajoReceta = document.getElementById("contenedor-bajo-receta");

        apiData.medicamentos.forEach(medicamento => {
            const card = document.createElement("div");
            card.className = "medicineBox"; 
            if (medicamento.categoria === 'Venta libre') {
                card.classList.add("MedVentaLibre");
            } else if (medicamento.categoria === 'Bajo receta') {
                card.classList.add("MedBajoRec");
            }
            card.innerHTML = `
                <div class="text-betw">
                    <p><strong>${medicamento.atc || medicamento.codigoNacional}</strong></p>
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

            if (medicamento.categoria === 'Venta libre') {
                contenedorVentaLibre.appendChild(card);
            } else if (medicamento.categoria === 'Bajo receta') {
                contenedorBajoReceta.appendChild(card);
            }
        });
    })
    .catch(error => {
        console.error("Hubo un problema con la operación fetch: " + error.message);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    cargarPlantas()
    cargarInyectables()
    cargarMedicamentos()
})


function checkLoginStatus() {
    console.log('Cookie username:', document.cookie.includes('username='));
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