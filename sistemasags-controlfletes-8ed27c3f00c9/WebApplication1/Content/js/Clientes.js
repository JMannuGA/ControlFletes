function AgregarCliente() {
    console.log("Función usuario ejecutada");

    // Captura los valores del formulario
    const nombre_comercial = document.querySelector("#nombre_comercial");
    let valido = true;

    // Validar campos
    if (nombre_comercial.value.trim() === "") {
        nombre_comercial.classList.add("is-invalid");
        valido = false;
    } else {
        nombre_comercial.classList.remove("is-invalid");
    }

    if (!valido) {
        alert("Por favor, corrige los campos marcados en rojo.");
        return;
    }

    // Crea el objeto del usuario
    const nuevoCliente = {
        nombre_comercial: nombre_comercial.value.trim()
    };

    console.log("Enviando datos al servidor:", nuevoCliente);

    const botonGuardar = document.querySelector(".btn-primary");
    botonGuardar.disabled = true;
    
    fetch('/api/Clientes/AgregarClientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente)
    })
        .then(response => response.json())
        .then(data => {
            botonGuardar.disabled = false;
            console.log("Respuesta del servidor:", data);

            if (data.success) {
                $('#addClienteModal').modal('hide')

                document.querySelector("#crearClienteForm").reset();
                alert("Usuario registrado correctamente.");
                window.location.reload();
            } else {
                alert(data.message || "Error al registrar el usuario.");
            }
        })
        .catch(error => {
            botonGuardar.disabled = false;
            console.error("Error al registrar el usuario:", error);
            alert("Hubo un error al procesar el registro.");
        });
}

$(document).ready(function () {
    $('#tableClientes').DataTable({
        responsive: true,
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json'
        },
        ajax: {
            url: 'api/Clientes/GetClientes',
            dataSrc: ''
        },
        columns: [
            { "data": 'nombre_comercial' },
            {
                "data": 'Activo',
                "render": function (data, type, row) {
                    return data ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-danger">Inactivo</span>';
                },
                "className": "text-center"
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                    <button class="btn btn-warning btn-sm btn-edit" data-id="${row.Id_Cliente}">Editar</button>
                    <!-- <button class="btn btn-danger btn-sm btn-delete" data-id="${row.Id_Cliente}" 
                        ${row.Vinculado ? 'disabled' : ''}>Eliminar</button> -->
                `;
                },
                "className": "text-center" 
            },
        ]
    });
});

$(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    console.log("ID del cliente a editar:", id);


    fetch(`/api/Clientes/GetClientesById/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos del tracto recibidos:", data);

            $('#Edit_nombre_comercial').val(data.nombre_comercial);

            $('#editClienteModal').modal('show');

            $('#editClienteModal').data('id', id);
        })
        .catch(error => console.error('Error al cargar los datos:', error));
});

$(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    console.log("ID del cliente a eliminar:", id);

    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        fetch(`/api/Clientes/DeleteCliente/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Cliente eliminado con éxito.');
                    $('#tableClientes').DataTable().ajax.reload();
                } else {
                    alert(data.message || 'Error al eliminar el cliente 1.');
                }
            })
            .catch(error => console.error('Error al eliminar el cliente 2:', error));
    }
});

function EditarCliente() {
    const id = $('#editClienteModal').data('id');
    console.log("ID del cliente enviado al backend:", id);

    const updatedCliente = {
        nombre_comercial: $('#Edit_nombre_comercial').val().trim(),
        Activo: $('#EditActivo').val() === "true"
    };


    fetch(`/api/Clientes/UpdateClientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCliente)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#editClienteModal').modal('hide');
                $('#tableClientes').DataTable().ajax.reload();
                alert('Cliente actualizado con éxito.');
            } else {
                alert(data.message || 'Error al actualizar el cliente.');
            }
        })
        .catch(error => console.error('Error al actualizar el cliente:', error));
}

