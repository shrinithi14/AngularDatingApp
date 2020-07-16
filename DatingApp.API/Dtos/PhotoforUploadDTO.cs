using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dtos
{
    public class PhotoforUploadDTO
    {
        public int Id { get; set; }
        public PhotoforUploadDTO()
        {
            DateAdded = DateTime.Now;
        }

        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }

        
    }
}