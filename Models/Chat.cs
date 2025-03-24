using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vyrlo.Models
{
    public class Chat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SenderId { get; set; }

        [Required]
        public string ReceiverId { get; set; }

        [Required]
        public string Message { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        [Required]
        public string ConversationId { get; set; }

        // Optional reference to a business if the chat is about a specific business
        public int? BusinessId { get; set; }

        // Navigation Properties
        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; }

        [ForeignKey("ReceiverId")]
        public virtual User Receiver { get; set; }

        [ForeignKey("BusinessId")]
        public virtual Business Business { get; set; }

        public Chat()
        {
            CreatedAt = DateTime.UtcNow;
            IsRead = false;
            // Generate a conversation ID if not provided
            if (string.IsNullOrEmpty(ConversationId))
            {
                ConversationId = Guid.NewGuid().ToString();
            }
        }
    }
} 