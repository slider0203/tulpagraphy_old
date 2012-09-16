using System.Collections.Generic;
using System.Web.Mvc;
using PiranhaGator.ViewModels;

namespace PiranhaGator.Controllers
{
    public class PlayerController : Controller
    {
        //
        // GET: /Player/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCharacter()
        {
            var characterSheet = new JsonResult();
            characterSheet.Data = new 
            {
                Name = "Alwyn",
                Race = "Dwarf",
                Stat = new []
                {
                    new {Name = "Strength", Value= 12},
                    new {Name = "Dexterity", Value = 11},
                    new {Name = "Constitution", Value = 14},
                    new {Name = "Intelligence", Value = 10},
                    new {Name = "Spirit", Value = 13},
                    new {Name = "Charisma", Value = 12}
                },
                Class = new [] {
                    new {Name = "Cleric", Value = 1 },
                    new {Name = "Knight", Value = 0 },
                    new {Name = "Sorcerer", Value = 0 },
                    new {Name = "Ranger", Value = 0 },
                },
                ActiveEffect = new string[]{},
                Attack = new []
                {
                    new 
                        {
                            Name = "Primary Weapon (Mace)",
                            AttackRating = 15,
                            AttackRange = 1,
                            MinDamage = 1,
                            MaxDamage = 6,
                            ManaCost = 0
                        },
                    new 
                        {
                            Name = "Channel Smite",
                            AttackRating = 15,
                            AttackRange = 1,
                            MinDamage = 2,
                            MaxDamage = 12,
                            ManaCost = 5
                        }
                },
                Defense = new []
                {
                    new {Name ="DefenseRating", Value = 46},
                    new {Name = "Fortitude", Value = 14},
                    new {Name = "Reflex", Value = 10},
                    new {Name = "Will", Value = 13}
                },
                ClassAbility = new [] { 
                    new {
                        Name = "Smite", 
                        Value = "The clerics next melee or a magic attack within 1 hex has an additional holy damage range of 1-3." 
                    },
                },
                Skill = new []
                {
                    new {Name = "Acrobatics", Value = 0},
                    new {Name = "Athletics", Value = 0 },
                    new {Name = "Heal", Value = 1},
                    new {Name = "Perception", Value = 0},
                    new {Name = "Stealth", Value = 0},
                    new {Name = "Thievery", Value = 0}
                },
                Experience = 1000,
                Health = 10,
                Mana = 14,
                Item = new []
                {
                    new 
                        {
                            Name = "Poor Hide Armor",
                            Equiped = true
                        },
                    new 
                        {
                            Name = "Mace",
                            Equiped = true
                        }
                },
                ActionPoints = 12
            };
            return Json(characterSheet,JsonRequestBehavior.AllowGet);
        }
    }
}