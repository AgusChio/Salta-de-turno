$(function() {
    // Configura el datepicker
    $("#fechaSelect").datepicker({
      dateFormat: "dd/mm/yy", // Formato de fecha
    onSelect: function(dateText, inst) {
        // Cuando se selecciona una fecha, actualiza el valor del select
        $("#fechaSelect").val(dateText);
    },
    });
});

fetch ('https://api-salta-de-turno.onrender.com/api/plantasmedicinales')
.then(response => {
    if(!response.ok){
        throw new Error ('HTTP error: ' + response.status)
    }
    return response.json()
})
.then(data => {
    console.log(data)
})
.catch(error => {
    console.error(error)
})

fetch ('https://api-salta-de-turno.onrender.com/api/medicamentos')
.then(response => {
    if(!response.ok){
        throw new Error ('HTTP error: ' + response.status)
    }
    return response.json()
})
.then(data => {
    console.log(data)
})
.catch(error => {
    console.error(error)
})