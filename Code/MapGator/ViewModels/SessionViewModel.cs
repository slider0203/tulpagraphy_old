using System.Collections.Generic;

namespace PiranhaGator.ViewModels
{
    public class SessionViewModel
    {
        public List<CharacterViewModel> Characters { get; set; }
        public List<EnemyViewModel> Enemies { get; set; }
        //Having the correct map isn't that important right now
        //public MapViewModel Map;
    }


    public class CharacterViewModel
    {
        public string Name { get; set; }
        public Race Race { get; set; }
        public int Level { get; set; }
        public List<CharacterClass> Classes { get; set; }
        public CharacterStatsViewModel Stats { get; set; }
        public HealthViewModel Health { get; set; }
    }

    public class HealthViewModel
    {
        public int Current { get; set; }
        public int Total { get; set; }
    }

    public enum CharacterClass
    {
        Knight, Ranger, Cleric, Sorcerer
    }

    public enum Race
    {
        Human, Dwarf, Elf
    }

    public class EnemyViewModel
    {
    }
}