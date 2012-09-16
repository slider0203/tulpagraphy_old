using System.ComponentModel.DataAnnotations;

namespace PiranhaGator.ViewModels
{
    public class SavesViewModel
    {
        [Display(Name = "Fortitude")]
        public int Fortitude { get; set; }

        [Display(Name = "Reflex")]
        public int Reflex { get; set; }

        [Display(Name = "Will")]
        public int Will { get; set; }
    }
}