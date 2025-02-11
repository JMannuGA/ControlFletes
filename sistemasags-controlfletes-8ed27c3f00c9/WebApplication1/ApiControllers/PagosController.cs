using Microsoft.Ajax.Utilities;
using Microsoft.Win32;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebApplication1.Models;
using WebApplication1.Seguridad;
using WebApplication1.ViewModels;


namespace WebApplication1.ApiControllers
{
    public class PagosController : ApiController
    {
        private FletesEntities db = new FletesEntities();

        [HttpGet]
        [Route("api/Pagos/GetMDP")]
        public HttpResponseMessage GetMDP()
        {
            var mdp = (from x in db.MetodosPago orderby x.Clave ascending select x).ToList();
            
            return new HttpResponseMessage()
            {
                Content = new StringContent(JsonConvert.SerializeObject(mdp, Newtonsoft.Json.Formatting.None).ToString(), Encoding.UTF8, "application/json")
            };
        }

        
        [ActionName("AddPago")]
        [HttpPost]
        public HttpResponseMessage AddPago([FromBody] PagosModel p)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var json = "";
            try
            {
                if (p == null)
                {
                    throw new Exception("El objeto de entrada es null.");
                }

                var current = (IdentityPersonalizado)User.Identity;

                var usuario = db.Usuario.FirstOrDefault(u => u.Id_Usuario == current.id);

                if (usuario == null || usuario.RolId.ToString().ToUpper() !=  "C1CFB07C-5457-48AD-A015-AF7D279CD164")
                {
                    throw new Exception("El usuario no tiene permisos.");
                }

                Pagos pago = new Pagos();
                FacturaPagos facturaPagos = new FacturaPagos();
                pago.Fecha_Pago = p.Fecha_Pago;
                pago.id_Pago = Guid.NewGuid();
                pago.Monto = p.Monto;
                pago.Forma_Pago = p.Forma_Pago;
                pago.Observaciones = string.IsNullOrEmpty(p.Observaciones) ? null : p.Observaciones;
                var folio = (from x in db.Pagos orderby x.Folio_Pago descending select x.Folio_Pago).FirstOrDefault();
                int folio_siguiente = (int)((folio == null) ? 1 : folio + 1);
                pago.Folio_Pago = folio_siguiente;
                pago.Cuenta_Banco = p.Cuenta_Banco;
                db.Pagos.Add(pago);

                var Montoflete = (from x in db.Fletes where x.Factura == p.Factura select x).FirstOrDefault();
                Montoflete.Pago += p.Monto;

                facturaPagos.id_FacturaPagos = Guid.NewGuid();
                var idFactura = (from f in db.Facturas where f.Folio == p.Factura select f).FirstOrDefault();
                facturaPagos.id_Facturas = idFactura.id_Facturas;
                facturaPagos.id_Pagos = pago.id_Pago;
                facturaPagos.Monto = p.Monto;
                facturaPagos.SaldoNuevo = Montoflete.Precio - Montoflete.Pago; //900
                facturaPagos.MetodoPago = "PUE";
                facturaPagos.SaldoAnterior = Montoflete.Precio - Montoflete.Pago + p.Monto;
                db.FacturaPagos.Add(facturaPagos);

                var SaldoFactura = (from x in db.Facturas where x.Folio == p.Factura select x).FirstOrDefault();
                SaldoFactura.Saldo += p.Monto;



                db.SaveChanges();


                json = serializer.Serialize(new
                {
                    success = true,
                    message = "Se agregó con éxito",
                });
            }
            catch (Exception e)
            {
                json = serializer.Serialize(new
                {
                    success = false,
                    message = $"Error al agregar: {e.Message}"
                });
            }

            return new HttpResponseMessage()
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        }

        [HttpGet]
        [Route("api/Pagos/GetPagosI")]
        public HttpResponseMessage GetPagosI(String Factura)
        {

            var pagosFactura = from f in db.Facturas join fp in db.FacturaPagos on f.id_Facturas equals fp.id_Facturas join p in db.Pagos on fp.id_Pagos equals p.id_Pago where f.Folio == Factura select new { Fecha_Pago = p.Fecha_Pago, Folio_Pago = p.Folio_Pago, Monto = p.Monto, Forma_Pago = p.Forma_Pago, Cuenta_Banco = p.Cuenta_Banco };
            var result = new { data = pagosFactura };


            return new HttpResponseMessage()
            {
                Content = new StringContent(JsonConvert.SerializeObject(result, Newtonsoft.Json.Formatting.None).ToString(), Encoding.UTF8, "application/json")
            };
        }

        [HttpGet]
        [Route("api/Pagos/TodosLosPagos")]
        public HttpResponseMessage TodosLosPagos()
        {
            var pagos = from p in db.Pagos join fp in db.FacturaPagos on p.id_Pago equals fp.id_Pagos join f in db.Facturas on fp.id_Facturas equals f.id_Facturas join c in db.Clientes on f.id_Cliente equals c.Id_Cliente select new { Folio_Pago = p.Folio_Pago, Nombre_comercial = c.nombre_comercial, Fecha_Pago = p.Fecha_Pago, Monto = p.Monto, Observaciones = p.Observaciones };
            var result = new { data = pagos };

            return new HttpResponseMessage()
            {
                Content = new StringContent(JsonConvert.SerializeObject(result, Newtonsoft.Json.Formatting.None).ToString(), Encoding.UTF8, "application/json")
            };
        }

        [HttpGet]
        [Route("api/Pagos/FPendientes")]
        public HttpResponseMessage FPendientes(String Cliente)
        {
            var pendientes = (from f in db.Facturas join c in db.Clientes on f.id_Cliente equals c.Id_Cliente where f.id_Cliente.ToString().ToLower() == Cliente.ToLower() && f.Saldo < f.Total orderby f.Fecha ascending select new { f.id_Facturas, f.Folio, f.Fecha, f.FormaPago, f.Total, f.MetodoPago, f.Saldo, Nombre_comercial = c.nombre_comercial });

            var result = new { data = pendientes };

            return new HttpResponseMessage()
            {
                Content = new StringContent(JsonConvert.SerializeObject(result, Newtonsoft.Json.Formatting.None).ToString(), Encoding.UTF8, "application/json")
            };
        }

        

    }
}
