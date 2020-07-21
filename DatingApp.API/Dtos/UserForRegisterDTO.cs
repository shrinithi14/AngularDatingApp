using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDTO
    {
        [Required]
        public string UserName { get; set; }
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Please enter password between 4 and 8 characters")]
        public string Password { get; set; }
        public ExternalSystemType ExternalSystem { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum ExternalSystemType
        {
            Google
        }
    }
}