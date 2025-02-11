using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Seguridad
{
    public class PrincipalPersonalizado : IPrincipal
    {
        FletesEntities db = new FletesEntities();
        public bool IsInRole(string role)
        {
            var current = (IdentityPersonalizado)this.Identity;
            Roles rol = db.Roles.Where(x => x.Rol.ToLower() == role.ToLower()).First();
            return db.Usuario.Any(x => x.RolId == rol.Id && x.Id_Usuario == current.id);
        }

        public IIdentity Identity { get; private set; }

        public IdentityPersonalizado MiIdentidadPersonalizada
        {
            get { return (IdentityPersonalizado)Identity; }
            set { Identity = value; }
        }

        public PrincipalPersonalizado(IdentityPersonalizado identity)
        {
            Identity = identity;
        }

    }
}