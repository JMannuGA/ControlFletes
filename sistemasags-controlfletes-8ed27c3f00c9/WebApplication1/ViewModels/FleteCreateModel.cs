using System;
using System.Web;

namespace WebApplication1.ViewModels
{
    public class FleteCreateModel
    {
        public Guid Id_Tracto { get; set; }
        public Guid Id_Usuario { get; set; }
        public Guid Id_Cliente { get; set; }
        public string Origen { get; set; }
        public string Destino { get; set; }
        public decimal Toneladas { get; set; }
        public decimal Precio { get; set; }
        public string Factura { get; set; }
        public decimal Pago { get; set; }
    }

}
