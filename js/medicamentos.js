// Plantas medicinales 
function cargarPlantas () {
    fetch ('https://api-salta-de-turno.onrender.com/api/plantasmedicinales')
    .then(response => {
        if(!response.ok){
            throw new Error ('HTTP error: ' + response.status)
        }
        return response.json()
    })
    .then(data => {
        if (!data.plantasMedicinales || !Array.isArray(data.plantasMedicinales)){
            throw new Error ('Los datos recibidos no son válidos')
        }
        const buttons = document.querySelectorAll(".table-plants-category .plants")
        const bodyTable = document.querySelector("#body-table-plants")
        buttons.forEach(button => {
            const category = button.getAttribute("data-category")
            button.addEventListener("click", () => {
                buttons.forEach(btn => btn.classList.remove("active-plants"))
                const plantas = data.plantasMedicinales.filter(({categorias}) => categorias.includes(category))
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

document.addEventListener("DOMContentLoaded", cargarPlantas)

fetch('https://api-salta-de-turno.onrender.com/api/medicamentos')
        .then(response =>{
            if(!response.ok){
                throw new Error("HTTP error" + response.status);
            }
            return response.json();
        })
        .then(data =>{
            console.log(data);
        })
        .catch(error =>{
            console.error(error);
        })
        