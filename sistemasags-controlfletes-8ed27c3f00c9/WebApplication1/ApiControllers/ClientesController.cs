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
    public class ClientesController : ApiController
    {
        private FletesEntities db = new FletesEntities();

        [HttpPost]
        [Route("api/Clientes/AgregarClientes")]
        public IHttpActionResult AgregarClientes(ClientesCreateModel model)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return BadRequest("El usuario no está autenticado.");
            }

            if (model == null || string.IsNullOrWhiteSpace(model.nombre_comercial))
            {
                return BadRequest("Los datos enviados no son válidos. Asegúrate de que todos los campos están llenos.");
            }

            try
            {
                string userEmail = User.Identity.Name;

                var usuario = db.Usuario.Include("Roles").FirstOrDefault(u => u.Correo == userEmail);
                if (usuario == null || usuario.Roles.Rol != "Admin")
                {
                    return Unauthorized(); 
                }

                Console.WriteLine($"Datos recibidos: Nombre Comercial: {model.nombre_comercial}");

                var nuevoCliente = new Clientes
                {
                    Id_Cliente = Guid.NewGuid(),
                    nombre_comercial = model.nombre_comercial,
                    Activo = model.Activo
                };

                db.Clientes.Add(nuevoCliente);
                db.SaveChanges();

                return Ok(new { success = true, message = "Cliente creado con éxito." });
            }
            catch (Exception ex)
            {
                // Captura y registra el error
                Console.WriteLine("Error al crear el cliente: " + ex.Message);
                Console.WriteLine("StackTrace: " + ex.StackTrace);
                return InternalServerError(new Exception("Ocurrió un error interno. Por favor, verifica los datos e intenta nuevamente."));
            }
        }

        [HttpGet]
        [Route("api/Clientes/GetClientes")]
        public IHttpActionResult GetClientes()
        {
            var clientes = db.Clientes.Select(c => new { 
                c.Id_Cliente, 
                c.nombre_comercial,
                c.Activo,
                Vinculado = db.Fletes.Any(tab1 => tab1.Id_Cliente == c.Id_Cliente)
            }).ToList();
            return Ok(clientes);
        }

        [HttpPut]
        [Route("api/Clientes/UpdateClientes/{id}")]
        public IHttpActionResult UpdateClientes(Guid id, ClientesUpdateModel model)
        {
            try
            {
                var cliente = db.Clientes.FirstOrDefault(t => t.Id_Cliente == id);
                if (cliente == null) return NotFound();

                cliente.nombre_comercial = model.nombre_comercial;
                cliente.Activo = model.Activo;
                db.SaveChanges();

                return Ok(new { success = true, message = "Cliente actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al actualizar el Cliente.", ex));
            }
        }

        [HttpGet]
        [Route("api/Clientes/GetClientesById/{id}")]
        public IHttpActionResult GetClientesById(Guid id)
        {
            Console.WriteLine($"ID recibido en el backend: {id}");

            var tracto = db.Clientes
                           .Where(t => t.Id_Cliente == id)
                           .Select(t => new
                           {
                               t.nombre_comercial,
                               t.Activo
                           })
                           .FirstOrDefault();

            if (tracto == null)
            {
                Console.WriteLine($"Cliente no encontrado para el ID: {id}");
                return NotFound();
            }

            Console.WriteLine($"Cliente encontrado: {JsonConvert.SerializeObject(tracto)}");
            return Ok(tracto);
        }

        [HttpDelete]
        [Route("api/Clientes/DeleteCliente/{id}")]
        public IHttpActionResult DeleteCliente(Guid id)
        {
            try
            {
                bool estaVinculado =
                    db.Fletes.Any(t => t.Id_Cliente == id);

                if (estaVinculado)
                {
                    return BadRequest("El cliente no puede ser eliminado porque está vinculado a otras tablas.");
                }

                var cliente = db.Clientes.FirstOrDefault(t => t.Id_Cliente == id);
                if (cliente == null) return NotFound();

                db.Clientes.Remove(cliente);
                db.SaveChanges();

                return Ok(new { success = true, message = "Cliente eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al eliminar el cliente.", ex));
            }
        }
    }
}
