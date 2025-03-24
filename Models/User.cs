using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Vyrlo.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public string ProfileImage { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserRole Role { get; set; }
        
        // Navigation Properties
        public virtual ICollection<Business> OwnedBusinesses { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<Chat> SentMessages { get; set; }
        public virtual ICollection<Chat> ReceivedMessages { get; set; }

        public User()
        {
            CreatedAt = DateTime.UtcNow;
            OwnedBusinesses = new HashSet<Business>();
            Reviews = new HashSet<Review>();
            Payments = new HashSet<Payment>();
            Notifications = new HashSet<Notification>();
            SentMessages = new HashSet<Chat>();
            ReceivedMessages = new HashSet<Chat>();
        }
    }

    public enum UserRole
    {
        Admin,
        BusinessOwner,
        Customer
    }
} 