/*
var table;

$(document).ready(function () {
    // Crear la tabla de reportes
    table = new DataTable('#tabreg', {
        "columns": [
            { "data": "Id_Flete" },
            { "data": "Id_Tracto" },
            { "data": "Id_Usuario" },
            { "data": "Id_Cliente" },
            { "data": "Destino" },
            { "data": "Origen" },
            { "data": "Toneladas" },
            { "data": "Precio" },
            { "data": "Factura" },
            { "data": "Pago" }
        ],
        paging: true,
        searching: true,
        order: [[3, 'asc']],
        bDestroy: true,
        language: {
            emptyTable: "No existen datos registrados"
        }
    });

    // Obtener reportes al cargar la página
    getReportes();
});

// Función para obtener los reportes
async function getReportes() {
    try {
        const response = await $.ajax({
            url: `/api/Registros/GetReportes`,
            type: 'GET',
            cache: false,
            contentType: 'application/json'
        });

        // Limpiar y actualizar la tabla
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        console.error('Error al obtener los reportes:', error);
        alert('Hubo un error al obtener los reportes. Por favor, inténtelo de nuevo más tarde.');
    }
}
*/

