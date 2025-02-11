using System;
using System.Web;

namespace WebApplication1.ViewModels
{
    public class ClientesCreateModel
    {
        public Guid Id_Cliente { get; set; }
        public string nombre_comercial { get; set; }
        public bool Activo { get; set; }
    }

    public class ClientesUpdateModel
    {
        public string nombre_comercial { get; set; }
        public bool Activo { get; set; }
    }

}
