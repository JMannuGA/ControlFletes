using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    [System.Web.Mvc.Authorize(Roles = "admin")]
    public class TractosController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.ActivePage = "Tractos";
            return View();
        }
    }
}