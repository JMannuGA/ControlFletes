using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    [System.Web.Mvc.Authorize(Roles = "admin,facturacion")]
    public class UsuariosController : Controller
    {

        // Acción que devolverá la vista Index.cshtml
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Registrar()
        {
            return View();
        }

        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}