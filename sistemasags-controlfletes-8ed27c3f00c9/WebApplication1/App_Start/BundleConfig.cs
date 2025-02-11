using System.Web;
using System.Web.Optimization;
using System.Web.UI.WebControls;

namespace WebApplication1
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            /*bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información sobre los formularios.  De esta manera estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));
            */
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/Content/Ajustes")
                .Include("~/Content/js/ajustes.js")
                );

            bundles.Add(new StyleBundle("~/Assets/logincss")
               .Include("~/Content/assets/vendor/bootstrap/css/bootstrap.min.css")
               .Include("~/Content/css/style.css")
               .Include("~/Content/css/sb-admin-2.min.css")
               .Include("~/Content/assets/vendor/fontawesome-free/css/all.css")
               .Include("~/Content/css/Fonts.css")
               );

            bundles.Add(new ScriptBundle("~/Assets/loginjs")
               .Include("~/Content/assets/vendor/jquery/jquery.min.js")
                .Include("~/Content/js/login.js")
                .Include("~/Content/assets/vendor/fontawesome-free/js/all.js")
                .Include("~/Content/assets/vendor/bootstrap/js/bootstrap.bundle.min.js")
                );

            bundles.Add(new ScriptBundle("~/Assets/RecuperarPassword")
                .Include("~/Content/assets/vendor/fontawesome-free/js/all.js")
                .Include("~/Content/assets/vendor/bootstrap/js/bootstrap.bundle.min.js")
                );
            bundles.Add(new StyleBundle("~/Assets/Registrarcss")
               .Include("~/Content/assets/vendor/fontawesome-free/css/all.min.css")
               .Include("~/Content/css/styles.css")
               );

            bundles.Add(new ScriptBundle("~/Assets/Registrarjs")
               .Include("~/Content/assets/vendor/fontawesome-free/js/all.js")
               .Include("~/Content/assets/vendor/crypto/crypto-js.js")
               .Include("~/Content/js/login.js")
               .Include("~/Content/js/script.js")
               .Include("~/Content/js/Registrar.js")
               );

            bundles.Add(new StyleBundle("~/Assets/sharedlayoutcss")
               .Include("~/Content/assets/vendor/fontawesome-free/css/all.min.css")
               .Include("~/Content/assets/vendor/google/font.googleapis.css.css")
               .Include("~/Content/css/sb-admin-2.min.css")
               );

            bundles.Add(new ScriptBundle("~/Assets/sharedlayoutjs")
               .Include("~/Content/assets/vendor/jquery/jquery.min.js")
               .Include("~/Content/assets/vendor/bootstrap/js/bootstrap.bundle.min.js")
               .Include("~/Content/assets/vendor/bootstrap/js/bootstrap-select.min.js")
               .Include("~/Content/assets/vendor/jquery-easing/jquery.easing.min.js")
               .Include("~/Content/js/sb-admin-2.min.js")
               );

            bundles.Add(new StyleBundle("~/Assets/tablascss")
               .Include("~/Content/assets/vendor/datatables/dataTables.bootstrap4.min.css")
               );

            bundles.Add(new ScriptBundle("~/Assets/tablasjs")
               .Include("~/Content/assets/vendor/datatables/jquery.dataTables.min.js")
               .Include("~/Content/assets/vendor/datatables/dataTables.bootstrap4.min.js")
               );

            bundles.Add(new StyleBundle("~/Assets/profilecss")
               .Include("~/Content/css/Profile.css")
               .Include("~/Content/js/Permisos.js")
               );

            bundles.Add(new ScriptBundle("~/Assets/profilejs")
               .Include("~/Content/js/Profile.js")
               .Include("~/Content/js/Permisos.js")
                );

            bundles.Add(new ScriptBundle("~/Assets/reportejs")
               .Include("~/Content/js/Fletes.js")
               .Include("~/Content/js/Reporte.js")
               .Include("~/Content/js/Permisos.js")
                );
            bundles.Add(new ScriptBundle("~/Assets/usuariojs")
               .Include("~/Content/assets/vendor/chart.js/Chart.min.js")
               .Include("~/Content/js/Usuarios.js")
               .Include("~/Content/js/Permisos.js")
                );
            bundles.Add(new ScriptBundle("~/Assets/pagosjs")
                .Include("~/Content/js/Pagos.js")
                .Include("~/Content/js/Permisos.js")
                );
            bundles.Add(new ScriptBundle("~/Assets/tractosjs")
                .Include("~/Content/js/Tractos.js")
                .Include("~/Content/js/Permisos.js")
                );
            bundles.Add(new ScriptBundle("~/Assets/clientesjs")
                .Include("~/Content/js/Clientes.js")
                .Include("~/Content/js/Permisos.js")
                );
        }
    }
}
