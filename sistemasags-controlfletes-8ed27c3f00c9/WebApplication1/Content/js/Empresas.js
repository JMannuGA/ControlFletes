document.addEventListener('DOMContentLoaded', function () {
    //mostrarEmpresaDefecto();

    var openEmpresaModal = document.getElementById('openEmpresaModal');

    openEmpresaModal.addEventListener('click', function (event) {
        event.preventDefault();

        var empresaModal = new bootstrap.Modal(document.getElementById('empresaModal'));
        empresaModal.show();

        verificarEmpresaDefecto(); // Cargar la empresa por defecto al abrir el modal
    });
});

function verificarEmpresaDefecto() {
    // Solicitar al API la empresa por defecto
    fetch('/api/Empresas/ObtenerEmpresaDefecto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                cargarEmpresas(data.empresa ? data.empresa.Id_Empresa : null); 
            } else {
                cargarEmpresas();
            }
        })
        .catch(error => {
            console.error('Error al verificar la empresa por defecto:', error);
        });
}

function cargarEmpresas(empresaIdDefecto = null) {
    fetch('/api/Empresas/ObtenerEmpresas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const empresaList = document.getElementById('empresaList');
                empresaList.innerHTML = ''; 

                data.empresas.forEach(empresa => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');

                    const a = document.createElement('a');
                    a.href = "#";
                    a.textContent = empresa.Nombre;
                    a.classList.add('text-decoration-none');

                    if (empresaIdDefecto && empresa.Id_Empresa === empresaIdDefecto) {
                        a.classList.add('text-primary', 'fw-bold'); 
                    }

                    a.addEventListener('click', function (e) {
                        e.preventDefault(); 
                        actualizarEmpresaDefecto(empresa.Id_Empresa); 
                    });

                    li.appendChild(a);
                    empresaList.appendChild(li);
                });
            } else {
                console.error('Error al cargar las empresas:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al cargar las empresas:', error);
        });
}

function actualizarEmpresaDefecto(empresaId) {
    // Actualizar la empresa por defecto y recargar la página con un retraso
    fetch('/api/Empresas/ActualizarEmpresaDefecto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ empresaId: empresaId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Empresa por defecto actualizada.');

                setTimeout(function () {
                    location.reload(); 
                }, 500);
            } else {
                console.error('Error al actualizar la empresa por defecto:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al actualizar la empresa por defecto:', error);
        });
}
