﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PiranhaGator.ViewModels;

namespace PiranhaGator.Controllers
{
    public class MapController : Controller
    {
        //
        // GET: /Map/
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Map/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Map/Create

        public ActionResult Create()
        {
			return View();
        } 

        //
        // POST: /Map/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        
        //
        // GET: /Map/Edit/5
 
        public ActionResult Edit(int? id)
        {
			MapViewModel vm = new MapViewModel();

			if (id.HasValue)
				vm = new MapViewModel() { Id = id.Value };

            return View(vm);
        }

        //
        // POST: /Map/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, object viewModelJson)
        {
            try
            {
                Console.WriteLine(viewModelJson);
                // TODO: Add update logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Map/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Map/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
