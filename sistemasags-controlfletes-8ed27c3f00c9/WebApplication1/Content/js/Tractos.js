function AgregarTractos() {
    console.log("Función AgregarTractos ejecutada");

    // Captura los valores del formulario
    const Marca = document.querySelector("#Marca");
    const Placa = document.querySelector("#Placa");
    const Numero = document.querySelector("#Numero");
    let valido = true;

    // Validar campos
    if (Marca.value.trim() === "") {
        Marca.classList.add("is-invalid");
        valido = false;
    } else {
        Marca.classList.remove("is-invalid");
    }

    if (Placa.value.trim() === "") {
        Placa.classList.add("is-invalid");
        valido = false;
    } else {
        Placa.classList.remove("is-invalid");
    }

    if (Numero.value.trim() === "") {
        Numero.classList.add("is-invalid");
        valido = false;
    } else {
        Numero.classList.remove("is-invalid");
    }

    if (!valido) {
        alert("Por favor, corrige los campos marcados en rojo.");
        return;
    }

    // Crea el objeto del usuario
    const nuevoTracto = {
        Marca: Marca.value.trim(),
        Placa: Placa.value.trim(),
        Numero: Numero.value.trim()
    };

    console.log("Enviando datos al servidor:", nuevoTracto);

    const botonGuardar = document.querySelector(".btn-primary");
    botonGuardar.disabled = true;

    fetch('/api/Tractos/CreateTracto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoTracto)
    })
        .then(response => response.json())
        .then(data => {
            botonGuardar.disabled = false;
            console.log("Respuesta del servidor:", data);

            if (data.success) {
                $('#addTractoModal').modal('hide')

                document.querySelector("#crearTractoForm").reset();
                alert("Tracto registrado correctamente.");
                window.location.reload();
            } else {
                alert(data.message || "Error al registrar el usuario.");
            }
        })
        .catch(error => {
            botonGuardar.disabled = false;
            console.error("Error al registrar el tracto:", error);
            alert("Hubo un error al procesar el registro.");
        });
}

$(document).ready(function () {
    $('#tableTractos').DataTable({
        responsive: true,
        language: {
            url: '../Content/assets/vendor/datatables/language/es-MX.json'
        },
        ajax: {
            url: '/api/Tractos/GetTractos',
            dataSrc: ''
        },
        columns: [
            { "data": 'Marca' },
            { "data": 'Placa' },
            { "data": 'Numero' },
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
                        <button class="btn btn-warning btn-sm btn-edit" data-id="${row.Id_Tracto}">Editar</button>
                       <!-- <button class="btn btn-danger btn-sm btn-delete" data-id="${row.Id_Tracto}" 
                            ${row.Vinculado ? 'disabled' : ''}>Eliminar</button> -->
                    `;
                },
                "className": "text-center" 
            }
        ]
    });
});

$(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id'); 
    console.log("ID del tracto a editar:", id);

 
    fetch(`/api/Tractos/GetTractoById/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos del tracto recibidos:", data);
     
            $('#EditMarca').val(data.Marca);
            $('#EditPlaca').val(data.Placa);
            $('#EditNumero').val(data.Numero);

            $('#editTractoModal').modal('show');

            $('#editTractoModal').data('id', id);
        })
        .catch(error => console.error('Error al cargar los datos:', error));
});

$(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    console.log("ID del tracto a eliminar:", id);

    if (confirm('¿Estás seguro de que deseas eliminar este tracto?')) {
        fetch(`/api/Tractos/DeleteTracto/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Tracto eliminado con éxito.');
                    $('#tableTractos').DataTable().ajax.reload();
                } else {
                    alert(data.message || 'Error al eliminar el tracto.');
                }
            })
            .catch(error => console.error('Error al eliminar el tracto:', error));
    }
});


function EditarTracto() {
    const id = $('#editTractoModal').data('id'); 
    console.log("ID del tracto enviado al backend:", id);

    const updatedTracto = {
        Marca: $('#EditMarca').val().trim(),
        Placa: $('#EditPlaca').val().trim(),
        Numero: $('#EditNumero').val().trim(),
        Activo: $('#EditActivo').val() === "true"
    };

    fetch(`/api/Tractos/UpdateTracto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTracto)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#editTractoModal').modal('hide');
                $('#tableTractos').DataTable().ajax.reload();
                alert('Tracto actualizado con éxito.');
            } else {
                alert(data.message || 'Error al actualizar el tracto.');
            }
        })
        .catch(error => console.error('Error al actualizar el tracto:', error));
}




