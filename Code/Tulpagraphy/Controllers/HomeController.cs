using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PiranhaGator.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
			// For now, the home page will be the map index, however, this should stay here in case that changes.
			return RedirectToAction("Index", "Map");
        }
    }
}
