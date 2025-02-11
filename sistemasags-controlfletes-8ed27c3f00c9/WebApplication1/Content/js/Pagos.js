var tablaPagos;
var tablaVPagos;
$(document).ready(function () {
    tablaPagos = $('#tablePagos').DataTable({
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json',
        },
        ajax: {
            url: '../api/Pagos/TodosLosPagos'
        },
        columns: [
            {
                "data": 'Folio_Pago'
            },
            {
                "data": 'Nombre_comercial'
            },
            {
                "data": 'Fecha_Pago', render: function (data, type, row) {
                    return data.toString().substring(0, 10);
                }
            },
            {
                "data": 'Monto'
            },
            {
                "data": 'Observaciones'
            }
        ]
    });
    tablaVPagos = $('#VariosPagos').DataTable({
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json',
        },
        columns: [
            {
                "data": 'Folio'
            },
            {
                "data": 'Fecha', render: function (data, type, row) {
                    return data.toString().substring(0, 10);
                }
            },
            {
                "data": 'Nombre_comercial'
            },
            {
                "data": 'Saldo'
            },
            {
                "data": 'Total'
            },
            {
                "data": 'Total', render: function (data, type, row) {
                    return "<p id='Abono'></p>";
                }
            }
        ],
        order: {
            name: 'Fecha',
            dir: 'asc'
        }
    });

    cargarDatos();
});

function cargarDatos() {

    $.getJSON("/api/Clientes/GetClientes")
        .done(function (data) {
            console.log(data);
            data.forEach(item => {
                $("#Cliente").append(
                    `<option value="${item.Id_Cliente}">${item.nombre_comercial}</option>`
                );
            });
        })
        .fail(function () {
            alert("Error al cargar los clientes. Inténtalo más tarde.");
        });

    fechaForm();

}

function fechaForm() {
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('sv-SE');
    document.getElementById('Fecha').value = fecha;
}
var result;
function GetFacturasPendientes() {
    var id = document.getElementById("Cliente").value;
    tablaVPagos.rows().remove().draw();
    tablaVPagos.ajax.url('/api/Pagos/FPendientes?Cliente=' + id).load();
    $.getJSON("/api/Pagos/FPendientes?Cliente=" + id)
        .done(function (data) {
            result = data;
        })
        .fail(function () {
            alert("Error al cargar los clientes. Inténtalo más tarde.");
        });
}

function CalcularMontos() {
    var monto = $("#Monto").val();
    result.data.forEach(factura => {
        if (monto > 0) {
            const porPagar = factura.Total - factura.Saldo;
            const abono = Math.min(porPagar, monto);
            factura.Saldo += abono;
            monto -= abono;
        }
    });
}

$.ajax({
    url: '/api/User/GetUserProfile',
    type: 'GET',
    success: function (data) {
        $('.text-gray-600.small').text(data.Nombre);
    },
    error: function (xhr, status, error) {
        console.error('Error al cargar el perfil del usuario:', error);
    }
});

$.ajax({
    url: '/api/User/GetUserRole',
    type: 'GET',
    success: function (data) {

        if (data.Rol === 'Admin') {
            $('.admin-only').show();
        } else {
            $('.admin-only').hide();
            $('#settingsMenu').hide();
            $('#empresaMenu').hide();
        }
    },
    error: function (xhr, status, error) {
        console.error('Error al obtener el rol del usuario:', error);
        alert('No se pudo verificar el rol del usuario.');
    }
});