using System.ComponentModel.DataAnnotations;

namespace PiranhaGator.ViewModels
{
    public class CharacterStatsViewModel
    {
        [Display(Name = "Strength")]
        public int Strength { get; set; }

        [Display(Name = "Dexterity")]
        public int Dexterity { get; set; }

        [Display(Name = "Constitution")]
        public int Constitution { get; set; }

        [Display(Name = "Intelligence")]
        public int Intelligence { get; set; }

        [Display(Name = "Spirit")]
        public int Spirit { get; set; }

        [Display(Name = "Charisma")]
        public int Charisma { get; set; }
    }
}