using System.ComponentModel.DataAnnotations;

namespace PiranhaGator.ViewModels
{
    public class InventoryItem
    {
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Equiped")]
        public bool Equiped { get; set; }
    }
}