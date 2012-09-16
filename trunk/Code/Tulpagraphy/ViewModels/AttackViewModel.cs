using System.ComponentModel.DataAnnotations;

namespace PiranhaGator.ViewModels
{
    public class AttackViewModel
    {
        [Display(Name = "Attack Name")]
        public string Name { get; set; }

        [Display(Name = "Attack Rating")]
        public int AttackRating { get; set; }

        [Display(Name = "Attack Range")]
        public int AttackRange { get; set; }

        [Display(Name = "Minimum Damage")]
        public int MinDamage { get; set; }

        [Display(Name = "Maximum Damage")]
        public int MaxDamage { get; set; }

        [Display(Name = "Mana Cost")]
        public int ManaCost { get; set; }
    }
}