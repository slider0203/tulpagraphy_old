using System.ComponentModel.DataAnnotations;

namespace PiranhaGator.ViewModels
{
    public class SkillsViewModel
    {
        [Display(Name = "Acrobatics")]
        public int Acrobatics { get; set; }

        [Display(Name = "Athletics")]
        public int Athletics { get; set; }

        [Display(Name = "Heal")]
        public int Heal { get; set; }

        [Display(Name = "Perception")]
        public int Perception { get; set; }

        [Display(Name = "Stealth")]
        public int Stealth { get; set; }

        [Display(Name = "Thievery")]
        public int Thievery { get; set; }
    }
}