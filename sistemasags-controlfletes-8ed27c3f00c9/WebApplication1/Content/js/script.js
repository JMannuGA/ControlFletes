var tabla_fletes;
var recipient;
var tabla_pagos;
$(document).ready(function () {
    tabla_fletes = $('#dataTable').DataTable({
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json',
        },
        ajax: {
            url: '../api/Fletes/GetAll'
        },
        columns: [
            {
                "data": 'Id_Flete'
            },
            {
                "data": 'Id_Cliente'
            },
            {
                "data": 'Cliente'
            },
            {
                "data": 'Chofer'
            },
            {
                "data": 'Origen'
            },
            {
                "data": 'Destino'
            },
            {
                "data": 'Precio'
            },
            {
                "data": 'Factura'
            },
            {
                "data": 'Saldo', render: function (data, type, row) {

                    return data + "<button type='button' data-toggle='modal' data-target='#addPagoModal' data-whatever='" + row['Factura'] +"' class='btn btn-outline-light'><i class='fas fa-search' style='color: #000000;'></i></button>";
                }
            }
        ],
        columnDefs: [
            {
                targets: [0],
                visible: false
            },
            {
                targets: [1],
                visible: false
            }
        ]
    });
    cargarDatos();
    $("#submitFlete").click(function () {
        crearFlete();
    });
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
            // Si el usuario es Admin, muestra el apartado de Usuarios
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

    tabla_pagos = $('#historialPagos').DataTable({
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json',
        },
        columns: [
            {
                "data": 'Fecha_Pago'
            },
            {
                "data": 'Folio_Pago'
            },
            {
                "data": 'Monto'
            },
            {
                "data": 'Forma_Pago'
            },
            {
                "data": 'Cuenta_Banco'
            }
        ],
    });
});


function cargarDatos() {
    $.getJSON("/api/Tractos/GetTractos")
        .done(function (data) {
            data.forEach(item => {
                // Agregar opción al select
                $("#Id_Tracto").append(
                    `<option value="${item.Id_Tracto}" ${!item.Activo ? "disabled" : ""}>
                        ${item.Marca} ${item.Activo ? "": "- Inactivo"}
                    </option>`
                );
            });
        })
        .fail(function () {
            alert("Error al cargar los tractos. Inténtalo más tarde.");
        });

    $.getJSON("/api/Fletes/GetChoferes")
        .done(function (data) {
            data.forEach(item => {
                $("#Id_Usuario").append(
                    `<option value="${item.Id_Usuario}" ${!item.Activo ? "disabled" : ""}>
                        ${item.Nombre} ${item.Activo ? "" : "- Inactivo"}
                    </option >`
                );
            });
        })
        .fail(function () {
            alert("Error al cargar los choferes. Inténtalo más tarde.");
        });

    $.getJSON("/api/Clientes/GetClientes")
        .done(function (data) {
            data.forEach(item => {
                $("#Id_Cliente").append(
                    `<option value="${item.Id_Cliente}" ${!item.Activo ? "disabled" : ""} >
                        ${ item.nombre_comercial} ${item.Activo ? "" : "- Inactivo"}
                        </option >`
                );
            });
        })
        .fail(function () {
            alert("Error al cargar los clientes. Inténtalo más tarde.");
        });

    $.getJSON("/api/Pagos/GetMDP")
        .done(function (data) {
            data.forEach(fdp => {
                $("#FDP").append(
                    `<option value="${fdp.Clave}">${fdp.Clave}-${fdp.Descripcion}</option>`
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

function crearFlete() {
    const fleteData = {
        Id_Flete: crypto.randomUUID(), // Generar un UUID para el nuevo flete
        Id_Tracto: $("#Id_Tracto").val(),
        Id_Usuario: $("#Id_Usuario").val(),
        Id_Cliente: $("#Id_Cliente").val(),
        Origen: $("#Origen").val(),
        Destino: $("#Destino").val(),
        Toneladas: parseFloat($("#Toneladas").val()), // Convertir a número
        Precio: parseFloat($("#Precio").val()),       // Convertir a número
        Factura: $("#Factura").val(),
        Pago: parseFloat($("#Pago").val())           // Convertir a número
    };

    console.log("Datos enviados al servidor:", fleteData);

    if (!fleteData.Id_Tracto || !fleteData.Id_Usuario || !fleteData.Id_Cliente) {
        alert("Por favor, selecciona todos los campos.");
        return;
    }

    fetch('../api/Fletes/CreateFlete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fleteData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Flete creado con éxito.");
                document.getElementById("crearFleteForm").reset();
                $('#addFleteModal').modal('hide')
                tabla_fletes.rows().remove().draw();
                tabla_fletes.ajax.url('/api/Fletes/GetAll').load();
            } else {
                alert("Error al crear el flete: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al crear el flete: " + error.message);
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

$('#addPagoModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    recipient = button.data('whatever')
    var modal = $(this)
    modal.find('#Factura').val(recipient)
    tabla_pagos.ajax.url('/api/Pagos/GetPagosI?Factura=' + recipient).load();
})
function AgregarPago() {
    var Fecha = $("#Fecha").val();
    const now = new Date();
    const Fecha_form = new Date(Fecha);
    Fecha_form.setMinutes(Fecha_form.getMinutes() + Fecha_form.getTimezoneOffset());
    if (Fecha_form.toDateString() === now.toDateString()) {
        Fecha_form.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    } else {
        Fecha_form.setHours(12, 0, 0);
    }
    const Fecha_Pago = Fecha_form.toISOString().substring(0, 19);
    var Forma_Pago = $("#FDP").val();
    var Factura = recipient;
    var Observaciones = $("#Observaciones").val();
    var Monto = $("#Monto").val();
    var Cuenta_Banco = $("#CDB").val();

    $.ajax({
        type: 'post',
        url: '../api/Pagos/AddPago',
        cache: false,
        contentType: 'application/x-www-form-urlencoded',
        data: { Fecha_Pago: Fecha_Pago, Forma_Pago: Forma_Pago, Factura: Factura, Observaciones: Observaciones, Monto: Monto, Cuenta_Banco: Cuenta_Banco},
        success: function (data) {
            if (data.success) {
                document.getElementById("crearPagoForm").reset();
                fechaForm();
                $('#addPagoModal').modal('hide')
                tabla_fletes.rows().remove().draw();
                tabla_fletes.ajax.url('/api/Fletes/GetAll').load();
                tabla_pagos.rows().remove().draw();
            } else {
                alert(data.message);
            }
        },
        error: function (xhr, desc, err) {
            alert("Error");
        }
    });
}