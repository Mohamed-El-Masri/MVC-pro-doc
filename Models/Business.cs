using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vyrlo.Models
{
    public class Business
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string OwnerId { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string MainImage { get; set; }

        public List<string> Gallery { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        [Required]
        public string Address { get; set; }

        public List<string> Features { get; set; }

        [Required]
        public BusinessType BusinessType { get; set; }

        public bool IsActive { get; set; }

        public DateTime? SubscriptionEndDate { get; set; }

        public List<MenuItem> MenuItems { get; set; }

        // Navigation Properties
        [ForeignKey("OwnerId")]
        public virtual User Owner { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<OpeningHour> OpeningHours { get; set; }
        public virtual ICollection<Ad> Advertisements { get; set; }

        public Business()
        {
            Gallery = new List<string>();
            Features = new List<string>();
            MenuItems = new List<MenuItem>();
            Reviews = new HashSet<Review>();
            OpeningHours = new HashSet<OpeningHour>();
            Advertisements = new HashSet<Ad>();
            IsActive = true;
        }
    }

    public enum BusinessType
    {
        Regular,
        Featured,
        Sponsored
    }

    public class MenuItem
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
        public bool IsAvailable { get; set; }
    }
} 