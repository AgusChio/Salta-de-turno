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

document.addEventListener("DOMContentLoaded", () => {
    cargarPlantas()
    cargarInyectables()
})

fetch('https://api-salta-de-turno.onrender.com/api/medicamentos')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error" + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
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
}

// Asegúrate de llamar a checkLoginStatus cuando la ventana se cargue
window.onload = checkLoginStatus;