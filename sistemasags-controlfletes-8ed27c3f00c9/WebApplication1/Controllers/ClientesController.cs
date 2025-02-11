using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    [System.Web.Mvc.Authorize(Roles = "admin")]
    public class ClientesController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.ActivePage = "Clientes";
            return View();
        }
    }
}
