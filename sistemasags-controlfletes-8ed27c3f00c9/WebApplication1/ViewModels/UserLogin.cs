using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class UsuariosLoginApp
    {
        public string Correo { get; set; }
        public string Password { get; set; }
    }
    public class UsuariosLogin
    {
        public string Correo { get; set; }
        public string Password { get; set; }
        public string remember { get; set; }
    }
    public class FPassword
    {
        public string error { get; set; }   
        public bool vista { get; set; }
        public Guid id { get; set; }
        public string correo { get; set; }
        public string NewP { get; set; }
        public string ConfP { get; set; }
    }

    public class UsersCreate
    {
        public string nombre { get; set; }
        public string Apellido01 { get; set; }
        public string Apellido02 { get; set; }
        public string correo { get; set; }
        public string telefono { get; set; }
        public string password { get; set; }
        public string rol { get; set; }
    }


    public class UserLoginDto
    {
        public string correo { get; set; }
        public string Password { get; set; }
    }

    public class UserUpdateModel
    {
        public string correo { get; set; }
        public string telefono { get; set; }
        public string nombre { get; set; }
        public string apellido01 { get; set; }
        public string apellido02 { get; set; }
        public bool Activo { get; set; }
    }
}