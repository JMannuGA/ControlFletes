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
    public class TractosController : ApiController
    {
        private FletesEntities db = new FletesEntities();

        [HttpPost]
        [Route("api/Tractos/CreateTracto")]
        public IHttpActionResult CreateTracto(TractoCreateModel model)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return BadRequest("El usuario no está autenticado.");
            }

            try
            {
                string userEmail = User.Identity.Name;

                var usuario = db.Usuario.Include("Roles").FirstOrDefault(u => u.Correo == userEmail);
                if (usuario == null || usuario.Roles.Rol != "Admin")
                {
                    return Unauthorized();
                }

                Console.WriteLine("Datos recibidos para crear el flete:");
                Console.WriteLine($"Id_Tracto: {model.Id_Tracto}");
                Console.WriteLine($"Marca: {model.Marca}");
                Console.WriteLine($"Placa: {model.Placa}");
                Console.WriteLine($"Numero: {model.Numero}");

                var nuevoTracto = new Tractos
                {

                    Id_Tracto = Guid.NewGuid(),
                    Marca = model.Marca,
                    Placa = model.Placa,
                    Numero = model.Numero,
                    Activo = model.Activo
                };

                db.Tractos.Add(nuevoTracto);
                db.SaveChanges();

                return Ok(new { success = true, message = "Tracto creado con éxito." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al crear el Tracto: " + ex.Message);
                Console.WriteLine("StackTrace: " + ex.StackTrace);
                return InternalServerError(new Exception("Ocurrió un error interno. Por favor, verifica los datos e intenta nuevamente."));
            }
        }

        [HttpGet]
        [Route("api/Tractos/GetTractos")]
        public IHttpActionResult GetTractos()
        {
            var tractos = db.Tractos.Select(t => new
            {
                t.Id_Tracto,
                t.Marca,
                t.Placa,
                t.Numero,
                Vinculado = db.Fletes.Any(tab1 => tab1.Id_Tracto == t.Id_Tracto),
                t.Activo
            }).ToList();

            return Ok(tractos);
        }

        [HttpPut]
        [Route("api/Tractos/UpdateTracto/{id}")]
        public IHttpActionResult UpdateTracto(Guid id, TractoUpdateModel model)
        {
            try
            {
                var tracto = db.Tractos.FirstOrDefault(t => t.Id_Tracto == id);
                if (tracto == null) return NotFound();

                tracto.Marca = model.Marca;
                tracto.Placa = model.Placa;
                tracto.Numero = model.Numero;
                tracto.Activo = model.Activo;
                db.SaveChanges();

                return Ok(new { success = true, message = "Tracto actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al actualizar el tracto.", ex));
            }
        }

        [HttpGet]
        [Route("api/Tractos/GetTractoById/{id}")]
        public IHttpActionResult GetTractoById(Guid id)
        {
            Console.WriteLine($"ID recibido en el backend: {id}");

            var tracto = db.Tractos
                           .Where(t => t.Id_Tracto == id)
                           .Select(t => new
                           {
                               t.Marca,
                               t.Placa,
                               t.Numero,
                               t.Activo
                           })
                           .FirstOrDefault();

            if (tracto == null)
            {
                Console.WriteLine($"Tracto no encontrado para el ID: {id}");
                return NotFound();
            }

            Console.WriteLine($"Tracto encontrado: {JsonConvert.SerializeObject(tracto)}");
            return Ok(tracto);
        }

        [HttpDelete]
        [Route("api/Tractos/DeleteTracto/{id}")]
        public IHttpActionResult DeleteTracto(Guid id)
        {
            try
            {
                bool estaVinculado =
                    db.Fletes.Any(t => t.Id_Tracto == id);

                if (estaVinculado)
                {
                    return BadRequest("El tracto no puede ser eliminado porque está vinculado a otras tablas.");
                }

                var tracto = db.Tractos.FirstOrDefault(t => t.Id_Tracto == id);
                if (tracto == null) return NotFound();

                db.Tractos.Remove(tracto);
                db.SaveChanges();

                return Ok(new { success = true, message = "Tracto eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al eliminar el tracto.", ex));
            }
        }

    }
}
