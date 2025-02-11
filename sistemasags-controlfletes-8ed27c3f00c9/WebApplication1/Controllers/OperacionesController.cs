using System.Linq;
using System.Web.Mvc;
using WebApplication1.Seguridad;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Authorize]
    public class OperacionesController : Controller
    {
        private FletesEntities db = new FletesEntities();

        private Usuario ObtenerUsuarioActual()
        {
            var current = (IdentityPersonalizado)User.Identity;
            return db.Usuario.FirstOrDefault(x => x.Id_Usuario == current.id);
        }

        public ActionResult Pago()
        {
            var usuario = ObtenerUsuarioActual();

            if (usuario == null)
            {
                return RedirectToAction("Logout", "Account");
            }

            switch (usuario.Roles.Rol.ToLower())
            {
                case "chofer":
                case "facturacion":
                    return RedirectToAction("index", "Reporte");

                case "admin":
                    ViewBag.ActivePage = "Pago";
                    return View();

                default:
                    return RedirectToAction("NoAutorizado", "Error");
            }
        }

        public ActionResult Factura()
        {
            var usuario = ObtenerUsuarioActual();

            if (usuario == null)
            {
                return RedirectToAction("Logout", "Account");
            }

            switch (usuario.Roles.Rol.ToLower())
            {
                case "chofer":
                case "facturacion":
                    return RedirectToAction("index", "Reporte");

                case "admin":
                    ViewBag.ActivePage = "Factura";
                    return View();

                default:
                    return RedirectToAction("NoAutorizado", "Error");
            }
        }

        //[System.Web.Mvc.Authorize(Roles = "admin")]
        public ActionResult Reporte()
        {
            var usuario = ObtenerUsuarioActual();

            if (usuario == null)
            {
                return RedirectToAction("Logout", "Account");
            }
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
    }
}
