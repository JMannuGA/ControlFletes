$(document).ready(function () {
    $.ajax({
        url: '/api/User/GetUserProfile',
        type: 'GET',
        success: function (data) {
            console.log(data);
            // Mostrar los datos en el formulario
            $('#userName').text(data.Nombre);
            $('#input-username').val(data.Nombre);
            $('#input-first-name').val(data.Apellido01);
            $('#input-last-name').val(data.Apellido02);
            $('#input-email').val(data.Correo);
            $('#input-phone').val(data.Telefono);
            $('#input-role').val(data.Rol);

            // Verificar el rol del usuario
            if (data.Rol === 'Admin') {
                $('.admin-only').show();
            } else {
                $('.admin-only').hide();
                $('#settingsMenu').hide();
                $('#empresaMenu').hide();
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar el perfil del usuario:', error);
            alert('No se pudo cargar la información del perfil.');
        }
    });
});
