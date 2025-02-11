using System;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using WebApplication1.Models;
using WebApplication1.Utilidades;

namespace WebApplication1.ApiControllers
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        private readonly FletesEntities db = new FletesEntities();

        // Crear Usuario
        [HttpPost]
        [Route("CreateUser")]
        public IHttpActionResult CreateUser(UsersCreate model)
        {
            try
            {
                if (model == null) return BadRequest("Datos inválidos.");

                var rol = db.Roles.FirstOrDefault(r => r.Rol.ToLower() == model.rol.ToLower());
                if (rol == null) return BadRequest("Rol no encontrado.");

                var hashedPassword = SeguridadUtilidades.GetSha1(model.password);

                var usuario = new Usuario
                {
                    Id_Usuario = Guid.NewGuid(),
                    Nombre = model.nombre,
                    Apellido01 = model.Apellido01,
                    Apellido02 = model.Apellido02,
                    Correo = model.correo,
                    Password = hashedPassword,
                    Telefono = model.telefono,
                    RolId = rol.Id,
                    Activo = true 
                };

                db.Usuario.Add(usuario);
                db.SaveChanges();

                return Ok(new { success = true, message = "Usuario creado correctamente." });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al crear usuario: " + ex.Message));
            }
        }


        // Obtener perfil del usuario autenticado
        [HttpGet]
        [Route("GetUserProfile")]
        public IHttpActionResult GetUserProfile()
        {
            try
            {
                if (!User.Identity.IsAuthenticated) return Unauthorized();

                var email = User.Identity.Name;

                var user = db.Usuario
                    .Where(u => u.Correo == email)
                    .Select(u => new
                    {
                        u.Nombre,
                        u.Apellido01,
                        u.Apellido02,
                        u.Correo,
                        u.Telefono,
                        Rol = u.Roles.Rol
                    })
                    .FirstOrDefault();

                if (user == null) return NotFound();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al obtener el perfil del usuario.", ex));
            }
        }

        // Obtener Rol del Usuario
        [HttpGet]
        [Route("GetUserRole")]
        public IHttpActionResult GetUserRole()
        {
            try
            {
                if (!User.Identity.IsAuthenticated) return Unauthorized();

                var email = User.Identity.Name;

                var rol = db.Usuario
                    .Where(u => u.Correo == email)
                    .Select(u => new { u.Roles.Rol })
                    .FirstOrDefault();

                if (rol == null) return NotFound();

                return Ok(rol);
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al obtener el rol del usuario.", ex));
            }
        }

        // Obtener lista de Administradores
        [HttpGet]
        [Route("GetAdmins")]
        public IHttpActionResult GetAdmins()
        {
            var admins = db.Usuario
                .Where(u => u.Roles.Rol == "Admin")
                .Select(u => new
                {
                    u.Id_Usuario,
                    u.Nombre,
                    u.Apellido01,
                    u.Apellido02,
                    u.Correo,
                    u.Telefono,
                    u.Activo
                })
                .ToList();

            return Ok(new { data = admins });
        }


        // Obtener lista de Choferes
        [HttpGet]
        [Route("GetChoferes")]
        public IHttpActionResult GetChoferes()
        {
            var choferes = db.Usuario
                .Where(u => u.Roles.Rol == "Chofer")
                .Select(u => new
                {
                    u.Id_Usuario,
                    u.Nombre,
                    u.Apellido01,
                    u.Apellido02,
                    u.Correo,
                    u.Telefono,
                    u.Activo,
                    AsignadoAFlete = db.Fletes.Any(tab1 => tab1.Id_Usuario == u.Id_Usuario)
                })
                .ToList();

            return Ok(new { data = choferes });
        }


        // Obtener lista de Facturación
        [HttpGet]
        [Route("GetFacturacion")]
        public IHttpActionResult GetFacturacion()
        {
            var facturacion = db.Usuario
                .Where(u => u.Roles.Rol == "Facturacion")
                .Select(u => new
                {
                    u.Id_Usuario,
                    u.Nombre,
                    u.Apellido01,
                    u.Apellido02,
                    u.Correo,
                    u.Telefono,
                    u.Activo
                })
                .ToList();

            return Ok(new { data = facturacion });
        }

        // Obtener usuario por ID
        [HttpGet]
        [Route("/api/User/GetUserById/{id}")]
        public IHttpActionResult GetUserById(Guid id)
        {
            var user = db.Usuario
                .Where(u => u.Id_Usuario == id)
                .Select(u => new
                {
                    u.Correo,
                    u.Telefono,
                    u.Nombre,
                    u.Apellido01,
                    u.Apellido02
                })
                .FirstOrDefault();

            if (user == null) return NotFound();

            return Ok(user);
        }

        // Actualizar usuario
        [HttpPut]
        [Route("/api/User/UpdateUser/{id}")]
        public IHttpActionResult UpdateUser(Guid id, UserUpdateModel model)
        {
            try
            {
                var user = db.Usuario.FirstOrDefault(u => u.Id_Usuario == id);
                if (user == null) return NotFound();

                user.Correo = model.correo;
                user.Telefono = model.telefono;
                user.Nombre = model.nombre;
                user.Apellido01 = model.apellido01;
                user.Apellido02 = model.apellido02;
                user.Activo = model.Activo; // Actualiza el estado

                db.SaveChanges();

                return Ok(new { success = true, message = "Usuario actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al actualizar el usuario.", ex));
            }
        }


        // Eliminar usuario
        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public IHttpActionResult DeleteUser(Guid id)
        {
            try
            {
                var user = db.Usuario.FirstOrDefault(u => u.Id_Usuario == id);
                if (user == null) return NotFound();

                if (db.Fletes.Any(f => f.Id_Usuario == id))
                {
                    return BadRequest("El usuario no puede ser eliminado porque está asignado a un flete.");
                }

                db.Usuario.Remove(user);
                db.SaveChanges();

                return Ok(new { success = true, message = "Usuario eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error al eliminar el usuario.", ex));
            }
        }

    }
}
