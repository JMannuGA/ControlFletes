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