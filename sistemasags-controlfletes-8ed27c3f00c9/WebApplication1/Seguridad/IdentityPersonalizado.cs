using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;

namespace WebApplication1.Seguridad
{
    public class IdentityPersonalizado : IIdentity
    {
        public string Name
        {
            get { return correo; }
        }

        public string AuthenticationType
        {
            get { return Identity.AuthenticationType; }
        }

        public bool IsAuthenticated
        {
            get { return Identity.IsAuthenticated; }
        }

        public Guid id { get; set; }
        public string correo { get; set; }
        public string password { get; set; }
        public string nombre { get; set; }

        public IIdentity Identity { get; set; }

        public IdentityPersonalizado(IIdentity identity)
        {
            this.Identity = identity;
            var us = Membership.GetUser(identity.Name) as UsuarioMembership;
            id = us.id;
            correo = us.correo;
            nombre = us.nombre;
            password = us.password;

          
        }
    }
}