using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Helpers;
using System.Web.Http;
using WebApplication1.Models;
using WebApplication1.ViewModels;


namespace WebApplication1.ApiControllers
{
    public class FletesController : ApiController
    {
        private FletesEntities db = new FletesEntities();

        [HttpPost]
        [Route("api/Fletes/CreateFlete")]
        public IHttpActionResult CreateFlete(FleteCreateModel model)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return BadRequest("El usuario no está autenticado.");
            }

            try
            {
                string userEmail = User.Identity.Name;

                // Verificar si el usuario es Admin
                var usuario = db.Usuario.Include("Roles").FirstOrDefault(u => u.Correo == userEmail);
                if (usuario == null || usuario.Roles.Rol != "Admin")
                {
                    return Unauthorized(); // Solo admins pueden crear fletes
                }

                // Validar datos obligatorios
                if (model.Id_Tracto == Guid.Empty || model.Id_Usuario == Guid.Empty ||
                    model.Id_Cliente == Guid.Empty || string.IsNullOrEmpty(model.Origen) ||
                    string.IsNullOrEmpty(model.Destino) || model.Toneladas <= 0 ||
                    model.Precio <= 0 || model.Pago < 0)
                {
                    return BadRequest("Por favor, asegúrate de llenar todos los campos obligatorios correctamente.");
                }

                // Validar si los IDs existen en la base de datos
                if (!db.Tractos.Any(t => t.Id_Tracto == model.Id_Tracto))
                {
                    return BadRequest("El tracto seleccionado no existe.");
                }
                if (!db.Usuario.Any(u => u.Id_Usuario == model.Id_Usuario && u.Roles.Rol == "Chofer"))
                {
                    return BadRequest("El chofer seleccionado no existe o no tiene el rol correcto.");
                }
                if (!db.Clientes.Any(c => c.Id_Cliente == model.Id_Cliente))
                {
                    return BadRequest("El cliente seleccionado no existe.");
                }

                // Log de los datos recibidos
                Console.WriteLine("Datos recibidos para crear el flete:");
                Console.WriteLine($"Id_Tracto: {model.Id_Tracto}");
                Console.WriteLine($"Id_Usuario: {model.Id_Usuario}");
                Console.WriteLine($"Id_Cliente: {model.Id_Cliente}");
                Console.WriteLine($"Origen: {model.Origen}");
                Console.WriteLine($"Destino: {model.Destino}");
                Console.WriteLine($"Toneladas: {model.Toneladas}");
                Console.WriteLine($"Precio: {model.Precio}");
                Console.WriteLine($"Factura: {model.Factura}");
                Console.WriteLine($"Pago: {model.Pago}");

                // Crear el nuevo flete
                var nuevoFlete = new Fletes
                {
                    Id_Flete = Guid.NewGuid(),
                    Id_Tracto = model.Id_Tracto,
                    Id_Usuario = model.Id_Usuario,
                    Id_Cliente = model.Id_Cliente,
                    Origen = model.Origen,
                    Destino = model.Destino,
                    Toneladas = (decimal)model.Toneladas,
                    Precio = (decimal)model.Precio,
                    Factura = model.Factura,
                    Pago = (decimal)model.Pago
                };

                db.Fletes.Add(nuevoFlete);
                db.SaveChanges();

                return Ok(new { success = true, message = "Flete creado con éxito." });
            }
            catch (Exception ex)
            {
                // Captura y registra el error
                Console.WriteLine("Error al crear el flete: " + ex.Message);
                Console.WriteLine("StackTrace: " + ex.StackTrace);
                return InternalServerError(new Exception("Ocurrió un error interno. Por favor, verifica los datos e intenta nuevamente."));
            }
        }

        [HttpGet]
        [Route("api/Fletes/GetChoferes")]
        public IHttpActionResult GetChoferes()
        {
            var choferes = db.Usuario
                             .Where(u => u.Roles.Rol == "Chofer")
                             .Select(u => new
                             {
                                 u.Id_Usuario,
                                 Nombre = u.Nombre + " " + u.Apellido01 + " " + u.Apellido02,
                                 u.Activo

                             })
                             .ToList();

            return Ok(choferes);
        }

        [HttpGet]
        [Route("api/Fletes/GetAll")]
        public HttpResponseMessage GetAll()
        {
            var fletes = (from cl in db.Clientes from x in db.Fletes where cl.Id_Cliente == x.Id_Cliente from us in db.Usuario where us.Id_Usuario == x.Id_Usuario select new { x.Id_Flete, x.Id_Cliente, Cliente = cl.nombre_comercial, Chofer = us.Nombre, x.Origen, x.Destino, Precio = x.Precio.ToString(), x.Factura, Saldo = x.Pago.ToString() }).ToList();
            var result = new { data = fletes };

            return new HttpResponseMessage()
            {
                Content = new StringContent(JsonConvert.SerializeObject(result, Newtonsoft.Json.Formatting.None).ToString(), Encoding.UTF8, "application/json")
            };
        }
    }
}
