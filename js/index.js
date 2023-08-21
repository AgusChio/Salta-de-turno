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

