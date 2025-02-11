/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
//
// Scripts
//

function LoginForm(e) {
    if ((e.keyCode === 13 && e.currentTarget.id === "password") || e.keyCode === undefined) {
        e.preventDefault();
        //$body.addClass("loading");
        const form = document.getElementById("LoginForm");
        form.submit();
    }
}

window.addEventListener('DOMContentLoaded', event => {
});

