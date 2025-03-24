using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Vyrlo.Models
{
    public class Package
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int Duration { get; set; }

        [Required]
        public decimal Price { get; set; }

        public List<string> FeaturesIncluded { get; set; }

        // Additional properties
        public bool IsActive { get; set; }
        public int MaxBusinessCount { get; set; }
        public int MaxImagesPerBusiness { get; set; }
        public bool IncludesFeaturedListing { get; set; }
        public bool IncludesAdvertising { get; set; }
        public int AdDaysIncluded { get; set; }
        public decimal MonthlyDiscountPercentage { get; set; }

        public Package()
        {
            FeaturesIncluded = new List<string>();
            IsActive = true;
            MaxBusinessCount = 1;
            MaxImagesPerBusiness = 5;
            IncludesFeaturedListing = false;
            IncludesAdvertising = false;
            AdDaysIncluded = 0;
            MonthlyDiscountPercentage = 0;
        }
    }
} 