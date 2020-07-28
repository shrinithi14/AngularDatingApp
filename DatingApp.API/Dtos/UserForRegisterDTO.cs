using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDTO
    {
        public UserForRegisterDTO()
        {
            LastActive = DateTime.Now;
            Created = DateTime.Now;
        }

        [Required]
        public string UserName { get; set; }
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Please enter password between 4 and 8 characters")]
        public string Password { get; set; }
        public ExternalSystemType ExternalSystem { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string KnownAs { get; set; }
        public string Gender { get; set; }
        public DateTime DateofBirth { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime Created { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum ExternalSystemType
        {
            NA,
            Google
        }
    }
}