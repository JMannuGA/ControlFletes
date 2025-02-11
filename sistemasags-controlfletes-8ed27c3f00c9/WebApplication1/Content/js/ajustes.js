/* document.addEventListener("DOMContentLoaded", function () {
    const profileTab = document.getElementById("content-profile-tab");
    const securityTab = document.getElementById("content-security-tab");
    const profileContent = document.getElementById("content-profile");
    const securityContent = document.getElementById("content-security");

    profileTab.addEventListener("click", function (e) {
        e.preventDefault();
        profileTab.classList.add("active");
        securityTab.classList.remove("active");
        profileContent.classList.add("active");
        securityContent.classList.remove("active");
    });

    securityTab.addEventListener("click", function (e) {
        e.preventDefault();
        securityTab.classList.add("active");
        profileTab.classList.remove("active");
        securityContent.classList.add("active");
        profileContent.classList.remove("active");
    });
});

document.getElementById("btnModificarPrecio").addEventListener("click", function (e) {
    e.preventDefault();
    var precioActual = document.getElementById('precioPorHora').value;

    $.ajax({
        type: 'POST',
        url: '/api/BD/AgregaPrecio',
        cache: false,
        contentType: 'application/x-www-form-urlencoded',
        data: { Precio: precioActual },
        success: function (data) {
            location.href = '/Settings/Index/';
        },
        error: function (xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
});
*/

document.addEventListener('DOMContentLoaded', function () {
    // Hacer la solicitud AJAX al cargar la página
    fetch('/api/Settings/EnviarCorreoAlApi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            // Imprimir la respuesta completa para ver si llega correctamente
            console.log("Respuesta completa del servidor:", response);

            return response.text().then(text => {
                try {
                    // Si es JSON válido, lo convertimos
                    return JSON.parse(text);
                } catch (error) {
                    // Si no es JSON válido, devolvemos el texto plano
                    return { success: false, message: text };
                }
            });
        })
        .then(data => {
            // Imprimir los datos para verificar su estructura
            console.log("Datos recibidos:", data);

            if (data.success) {
                console.log("Configuraciones obtenidas desde el API:", data.configuraciones);

                // Mostrar las configuraciones obtenidas en la consola
                data.configuraciones.forEach(config => {
                    console.log(`Precio: ${config.Precio}, Tolerancia: ${config.Tolerancia}, Horario: ${config.Horario}`);
                });
            } else {
                console.error("Error:", data.message);
            }
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error);
        });
});
