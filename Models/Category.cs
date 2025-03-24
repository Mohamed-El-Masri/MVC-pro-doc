using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Vyrlo.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; }

        [Required]
        public string Icon { get; set; }

        public List<string> DefaultFeatures { get; set; }

        // Navigation Properties
        public virtual ICollection<Business> Businesses { get; set; }

        public Category()
        {
            DefaultFeatures = new List<string>();
            Businesses = new HashSet<Business>();
        }
    }
} 