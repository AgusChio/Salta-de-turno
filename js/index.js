document.addEventListener("DOMContentLoaded", function () {
  // Selecciona el elemento del input date y el span del marcador de posición
    const dateInput = document.getElementById("date-input");
    const placeholder = document.querySelector(".placeholder-date");

  // Agrega un evento al input date para mostrar u ocultar el marcador de posición
    dateInput.addEventListener("focus", function () {
        placeholder.style.display = "none";
    });

    dateInput.addEventListener("blur", function () {
        (dateInput.value === "") ? placeholder.style.display = "block" : placeholder.style.display = "none"
        
    });
});


// $(function() {
//     // Configura el datepicker
//     $("#fechaSelect").datepicker({
//       dateFormat: "dd/mm/yy", // Formato de fecha
//     onSelect: function(dateText, inst) {
//         // Cuando se selecciona una fecha, actualiza el valor del select
//         $("#fechaSelect").val(dateText);
//     },
//     });
// });