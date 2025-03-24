using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vyrlo.Models
{
    public class OpeningHour
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BusinessId { get; set; }

        [Required]
        public DayOfWeek DayOfWeek { get; set; }

        public TimeSpan? OpenTime { get; set; }

        public TimeSpan? CloseTime { get; set; }

        public bool IsClosed { get; set; }

        public string CloseReason { get; set; }

        // Navigation Properties
        [ForeignKey("BusinessId")]
        public virtual Business Business { get; set; }

        public OpeningHour()
        {
            IsClosed = false;
        }
    }
} 