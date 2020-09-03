using System;

namespace DatingApp.API.Dtos
{
    public class MessageForCreationDTO
    {
        public MessageForCreationDTO()
        {
            this.DateSent = DateTime.Now;
        }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime DateSent { get; set; }
        public string SenderKnownAs { get; set; }
    }
}