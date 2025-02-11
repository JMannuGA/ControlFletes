$(document).ready(function () {
    // Llamada para obtener los usuarios Admin
    $('#adminTable').DataTable({
        responsive: true,
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json',
        },
        ajax: {
            url: '../api/User/GetAdmins'
        },
        columns: [
            {"data": 'Nombre'},
            {"data": 'Apellido01'},
            {"data": 'Apellido02'},
            {"data": 'Correo'},
            { "data": 'Telefono' },
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
                        <button class="btn btn-warning btn-sm btn-edit" data-id="${row.Id_Usuario}">Editar</button>
                    `;
                },
                "className": "text-center" 
           }
        ]
    });

    // Llamada para obtener los usuarios Chofer
    $('#choferTable').DataTable({
        responsive: true,
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json',
        },
        ajax: {
            url: '../api/User/GetChoferes'
        },
        columns: [
            {"data": 'Nombre'},
            {"data": 'Apellido01'},
            {"data": 'Apellido02' },
            {"data": 'Correo'},
            { "data": 'Telefono' },
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
                        <button class="btn btn-warning btn-sm btn-edit" data-id="${row.Id_Usuario}">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete"
                            data-id="${row.Id_Usuario}" 
                            ${row.AsignadoAFlete ? 'disabled' : ''}>
                        Eliminar
                    </button>
                    `;
                }
            }
        ]
    });

    // Llamada para obtener los usuarios de Facturación
    $('#facturacionTable').DataTable({
        responsive: true,
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json',
        },
        ajax: {
            url: '../api/User/GetFacturacion'
        },
        columns: [
            {"data": 'Nombre'},
            {"data": 'Apellido01'},
            {"data": 'Apellido02'},
            {"data": 'Correo'},
            { "data": 'Telefono' },
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
                        <button class="btn btn-warning btn-sm btn-edit" data-id="${row.Id_Usuario}">Editar</button>
                    `;
                },
                "className": "text-center" 
            }
        ]
    });
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

function EditarUsuario() {
    const id = $('#editUserModal').data('id');
    console.log("ID del usuario enviado al backend:", id);

    const updatedUser = {
        Correo: $('#EditCorreo').val().trim(),
        Telefono: $('#EditTelefono').val().trim(),
        Nombre: $('#EditNombre').val().trim(),
        Apellido01: $('#EditApellido01').val().trim(),
        Apellido02: $('#EditApellido02').val().trim(),
        Activo: $('#EditActivo').val() === "true" // Convertir a booleano
    };

    fetch(`/api/User/UpdateUser/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#editUserModal').modal('hide');
                $('#adminTable, #choferTable, #facturacionTable').DataTable().ajax.reload();
                alert('Usuario actualizado con éxito.');
            } else {
                alert(data.message || 'Error al actualizar el usuario.');
            }
        })
        .catch(error => console.error('Error al actualizar el usuario:', error));
}


$(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    console.log("ID del usuario a editar:", id);

    fetch(`/api/User/GetUserById/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos del usuario recibidos:", data);

            $('#EditCorreo').val(data.Correo || '');
            $('#EditTelefono').val(data.Telefono || '');
            $('#EditNombre').val(data.Nombre || '');
            $('#EditApellido01').val(data.Apellido01 || '');
            $('#EditApellido02').val(data.Apellido02 || '');

            // Validar el campo Activo para evitar errores si está undefined o null
            const isActive = data.Activo != null ? data.Activo.toString() : "true";
            $('#EditActivo').val(isActive);

            $('#editUserModal').modal('show');

            $('#editUserModal').data('id', id);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            alert('No se pudieron cargar los datos del usuario.');
        });
});



$(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    console.log("ID del usuario a eliminar:", id);

    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch(`/api/User/DeleteUser/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el usuario.');
                }
                return response.json();
            })
            .then(data => {
                console.log("Respuesta del servidor:", data);
                if (data.success) {
                    alert('Usuario eliminado con éxito.');
                    $('#choferTable').DataTable().ajax.reload(); 
                } else {
                    alert(data.message || 'No se pudo eliminar el usuario.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar el usuario:', error);
                alert('Hubo un error al procesar la eliminación.');
            });
    }
});

