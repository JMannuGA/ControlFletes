using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using WebApplication1.Models;
using WebApplication1.Utilidades;

namespace WebApplication1.Seguridad
{
    public class UsuarioMembership : MembershipUser
    {
        public Guid id { get; set; }
        public string correo { get; set; }
        public string password { get; set; }
        public string nombre { get; set; }
    

        public UsuarioMembership(Usuario us)
        {
            id = us.Id_Usuario;
            correo = us.Correo;
            password = SeguridadUtilidades.GetSha1(us.Password);
            nombre = us.Nombre;
        }

    }
}