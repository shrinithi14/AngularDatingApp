using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDTO>()
                        .ForMember(dest => dest.PhotoUrl, opt =>
                        {
                            opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                        });

            CreateMap<User, UserForDetailDTO>()
            .ForMember(dest => dest.PhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                });
                
            CreateMap<Photo, PhotoForDetailDTO>();
        }
    }
}