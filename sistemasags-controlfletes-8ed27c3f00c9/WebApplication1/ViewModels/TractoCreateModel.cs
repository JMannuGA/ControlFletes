using System;
using System.Web;

namespace WebApplication1.ViewModels
{
    public class TractoCreateModel
    {
        public Guid Id_Tracto { get; set; }
        public string Marca { get; set; }
        public string Placa { get; set; }
        public int Numero { get; set; }
        public bool Activo { get; set; }
    }

    public class TractoUpdateModel
    {
        public string Marca { get; set; }
        public string Placa { get; set; }
        public int Numero { get; set; }
        public bool Activo { get; set; }
    }

}
