using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PiranhaGator.ViewModels
{
    public class CharacterSheetViewModel
    {
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Race")]
        public string Race { get; set; }

        [Display(Name = "Classes")]
        public List<string> Classes { get; set; } 

        public CharacterStatsViewModel Stats { get; set; }

        [Display(Name = "Health")]
        public int Health { get; set; }

        [Display(Name = "Mana")]
        public int Mana { get; set; }

        [Display(Name = "Action Points")]
        public int ActionPoints { get; set; }

        [Display(Name = "Experience")]
        public int Experience { get; set; }

        [Display(Name = "Active Effects")]
        public List<string> ActiveEffects { get; set; }

        [Display(Name = "Attacks")]
        public List<AttackViewModel> Attacks { get; set; }
        
        [Display(Name = "Attack Rating")]
        public int AttackRating { get; set; }

        [Display(Name = "Defense Rating")]
        public int DefenseRating { get; set; }

        [Display(Name = "Class Abilities")]
        public List<string> ClassAbilities { get; set; }

        [Display(Name = "Inventory")]
        public List<InventoryItem> Inventory { get; set; }

        public SkillsViewModel Skills { get; set; }

        public SavesViewModel Saves { get; set; }
    }
}