using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebApplication1.Models;
using WebApplication1.Utilidades;



namespace WebApplication1.Controllers
{
    public class LoginController : Controller
    {
        FletesEntities db = new FletesEntities();

        // GET: Login
        public ActionResult Index(string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Pago", "Operaciones");
            }
            return View();
        }

        public ActionResult ForgetPW()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(UsuariosLogin model, string ReturnUrl)
        {
            if (!this.HttpContext.User.Identity.IsAuthenticated)
            {
                if (Membership.ValidateUser(model.Correo, model.Password))
                {
                    Usuario usuario = db.Usuario.FirstOrDefault(x => x.Correo == model.Correo);

                    if (usuario == null)
                    {
                        ModelState.AddModelError("", "Usuario no encontrado");
                        return View(model);
                    }

                    if (!usuario.Activo)
                    {
                        ModelState.AddModelError("", "Tu cuenta está inactiva. No puedes iniciar sesión.");
                        return View(model);
                    }

                    FormsAuthentication.RedirectFromLoginPage(model.Correo, true);

                    if (!string.IsNullOrEmpty(Request.Form["remember"]))
                    {
                        Response.Cookies["email"].Value = model.Correo;
                        Response.Cookies["email"].Expires = DateTime.Now.AddDays(10);
                        Response.Cookies["password"].Value = model.Password;
                        Response.Cookies["password"].Expires = DateTime.Now.AddDays(10);
                    }
                    else
                    {
                        if (Request.Cookies["email"] != null)
                        {
                            Response.Cookies["email"].Expires = DateTime.Now.AddMinutes(-1);
                        }
                        if (Request.Cookies["password"] != null)
                        {
                            Response.Cookies["password"].Expires = DateTime.Now.AddMinutes(-1);
                        }
                    }

                    return RedirectToAction("Factura", "Operaciones");
                }
                else
                {
                    ModelState.AddModelError("", "Usuario y/o contraseña incorrectos");
                }

                return View(model);
            }
            else
            {
                string decodedUrl = "";
                if (!string.IsNullOrEmpty(ReturnUrl))
                    decodedUrl = Server.UrlDecode(ReturnUrl);

                if (Url.IsLocalUrl(decodedUrl))
                {
                    return Redirect(decodedUrl);
                }
                else
                {
                    return RedirectToAction("Pago", "Operaciones");
                }
            }
        }



        [HttpPost]
        public ActionResult ChangePassword(FPassword model)
        {
            if (!string.IsNullOrEmpty(model.NewP) && !string.IsNullOrEmpty(model.ConfP))
            {
                if (model.NewP != model.ConfP)
                {
                    ViewBag.ErrorMessage = "Las contraseñas no coinciden.";
                    ViewBag.ShowPasswordFields = true;
                    return View("ForgetPW");
                }

                string correoGuardado = Session["UsuarioCorreo"] as string;
                if (string.IsNullOrEmpty(correoGuardado))
                {
                    ViewBag.ErrorMessage = "No se pudo recuperar el correo del usuario. Inténtelo de nuevo.";
                    ViewBag.ShowPasswordFields = false;
                    return View("ForgetPW");
                }

                var usuario = db.Usuario.FirstOrDefault(x => x.Correo == correoGuardado);
                if (usuario != null)
                {
                    string hashedPassword = SeguridadUtilidades.GetSha1(model.NewP);
                    usuario.Password = hashedPassword;
                    db.SaveChanges();

                    // Limpiar el mensaje de éxito
                    ViewBag.ErrorMessage = null;
                    ViewBag.ShowPasswordFields = false; 
                    return RedirectToAction("Pago", "Operaciones");
                }
                else
                {
                    ViewBag.ErrorMessage = "Error al encontrar el usuario. Por favor, valide nuevamente.";
                    ViewBag.ShowPasswordFields = true;
                    return View("ForgetPW");
                }
            }

            // Si no se están enviando las contraseñas para cambio
            ViewBag.ErrorMessage = "Por favor, complete todos los campos.";
            ViewBag.ShowPasswordFields = true;
            return View("ForgetPW");
        }

        public ActionResult Logoff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }

    }
}
