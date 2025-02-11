function AgregarUsuario() {
    console.log("Función AgregarUsuario ejecutada");

    const nombre = document.querySelector("#form1Example1c");
    const apellidoPaterno = document.querySelector("#form2Example1c");
    const apellidoMaterno = document.querySelector("#form3Example1c");
    const correo = document.querySelector("#form4Example1c");
    const telefono = document.querySelector("#formPhone");
    const password = document.querySelector("#formPassword");
    const repeatPassword = document.querySelector("#formRepeatPassword");
    const rol = document.querySelector("#formRole");

    let valido = true;

    if (!valido) {
        alert("Por favor, corrige los campos marcados en rojo.");
        return;
    }

    const usuarioData = {
        nombre: nombre.value.trim(),
        Apellido01: apellidoPaterno.value.trim(),
        Apellido02: apellidoMaterno.value.trim(),
        correo: correo.value.trim(),
        telefono: telefono.value.trim(),
        password: password.value.trim(),
        rol: rol.value
    };

    console.log("Enviando datos al servidor:", usuarioData);

    fetch('/api/User/CreateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);

            if (data.success) {
                $('#addUserModal').modal('hide');
                document.querySelector("#registerForm").reset(); 

                mostrarTablaSegunRol(usuarioData.rol); 

                switch (usuarioData.rol) {
                    case 'Admin':
                        $('#adminTable').DataTable().ajax.reload();
                        break;
                    case 'Chofer':
                        $('#choferTable').DataTable().ajax.reload();
                        break;
                    case 'Facturacion':
                        $('#facturacionTable').DataTable().ajax.reload();
                        break;
                    default:
                        console.error('Rol desconocido:', usuarioData.rol);
                        break;
                }

                alert("Usuario registrado correctamente.");
            } else {
                alert(data.message || "Error al registrar el usuario.");
            }
        })
        .catch(error => {
            console.error("Error al registrar el usuario:", error);
            alert("Hubo un error al procesar el registro.");
        });

}

function agregarUsuarioATabla(usuario) {
    let tableId = '';

    switch (usuario.rol) {
        case 'Admin':
            tableId = 'adminTable';
            break;
        case 'Chofer':
            tableId = 'choferTable';
            break;
        case 'Facturacion':
            tableId = 'facturacionTable';
            break;
        default:
            console.error('Rol desconocido:', usuario.rol);
            return;
    }

    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) {
        console.error(`No se encontró el cuerpo de la tabla con ID "${tableId}".`);
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${usuario.nombre}</td>
        <td>${usuario.Apellido01}</td>
        <td>${usuario.Apellido02}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.telefono}</td>
    `;
    tableBody.appendChild(newRow);
    console.log('Usuario agregado a la tabla correctamente.');
}

function mostrarTablaSegunRol(rol) {
    console.log('Mostrando tabla para el rol:', rol);

    let tabId = '';
    let paneId = '';
    switch (rol) {
        case 'Admin':
            tabId = 'admin-tab';
            paneId = 'pestana-admin';
            break;
        case 'Chofer':
            tabId = 'choferes-tab';
            paneId = 'pestana-choferes';
            break;
        case 'Facturacion':
            tabId = 'facturacion-tab';
            paneId = 'pestana-facturacion';
            break;
        default:
            console.error('Rol desconocido:', rol);
            return;
    }

    // Desactivar todas las pestañas activas
    document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
    });

    // Activar la pestaña y el contenido correspondientes al rol
    const tabElement = document.querySelector(`#${tabId}`);
    const paneElement = document.querySelector(`#${paneId}`);

    if (tabElement) {
        tabElement.classList.add('active');
    } else {
        console.error(`No se encontró la pestaña con ID: ${tabId}`);
    }

    if (paneElement) {
        paneElement.classList.add('show', 'active');
    } else {
        console.error(`No se encontró el panel con ID: ${paneId}`);
    }
}



function validarFormulario() {
    let valido = true;

    // Validar nombre
    const nombre = document.getElementById("form1Example1c");
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(nombre.value.trim())) {
        nombre.classList.add("is-invalid");
        valido = false;
    } else {
        nombre.classList.remove("is-invalid");
    }

    // Validar apellido paterno
    const apellidoPaterno = document.getElementById("form2Example1c");
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(apellidoPaterno.value.trim())) {
        apellidoPaterno.classList.add("is-invalid");
        valido = false;
    } else {
        apellidoPaterno.classList.remove("is-invalid");
    }

    // Validar apellido materno
    const apellidoMaterno = document.getElementById("form3Example1c");
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(apellidoMaterno.value.trim())) {
        apellidoMaterno.classList.add("is-invalid");
        valido = false;
    } else {
        apellidoMaterno.classList.remove("is-invalid");
    }

    // Validar correo
    const correo = document.getElementById("form4Example1c");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim())) {
        correo.classList.add("is-invalid");
        valido = false;
    } else {
        correo.classList.remove("is-invalid");
    }

    // Validar teléfono
    const telefono = document.getElementById("formPhone");
    if (!/^\d{10}$/.test(telefono.value.trim())) {
        telefono.classList.add("is-invalid");
        valido = false;
    } else {
        telefono.classList.remove("is-invalid");
    }

    // Validar contraseña
    const password = document.getElementById("formPassword");
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password.value.trim())) {
        password.classList.add("is-invalid");
        valido = false;
    } else {
        password.classList.remove("is-invalid");
    }

    // Validar repetición de contraseña
    const repeatPassword = document.getElementById("formRepeatPassword");
    if (password.value.trim() !== repeatPassword.value.trim()) {
        repeatPassword.classList.add("is-invalid");
        valido = false;
    } else {
        repeatPassword.classList.remove("is-invalid");
    }

    // Si todo es válido, llama a la función para agregar el usuario
    if (valido) {
        AgregarUsuario();
    } else {
        alert("Por favor, corrige los campos marcados en rojo.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

