using System;
using System.Web;

namespace WebApplication1.ViewModels
{
    public class PagosModel
    {
        public String Fecha_Pago { get; set; }
        public string Forma_Pago { get; set; }
        public string Factura { get; set; }
        public string Observaciones { get; set; }
        public decimal Monto { get; set; }
        public string Cuenta_Banco { get; set; }
    }

}
