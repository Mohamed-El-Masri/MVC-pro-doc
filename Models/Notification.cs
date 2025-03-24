using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vyrlo.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string Message { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        [Required]
        public NotificationType Type { get; set; }

        // Optional reference data
        public int? BusinessId { get; set; }
        public int? ReviewId { get; set; }
        public int? ChatId { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("BusinessId")]
        public virtual Business Business { get; set; }

        [ForeignKey("ReviewId")]
        public virtual Review Review { get; set; }

        [ForeignKey("ChatId")]
        public virtual Chat Chat { get; set; }

        public Notification()
        {
            CreatedAt = DateTime.UtcNow;
            IsRead = false;
        }
    }

    public enum NotificationType
    {
        NewVisit,
        NewReview,
        NewMessage,
        PaymentReceived,
        BusinessApproved,
        BusinessRejected,
        SubscriptionExpiring
    }
} 