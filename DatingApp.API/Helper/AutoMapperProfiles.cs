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
                        }).ForMember(dest => dest.Age, opt =>
                        {
                            opt.MapFrom(src => src.DateOfBirth.CalculateAge());
                        });


            CreateMap<User, UserForDetailDTO>()
            .ForMember(dest => dest.PhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                }).ForMember(dest => dest.Age, opt =>
                {
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge());
                });

            CreateMap<Photo, PhotoForDetailDTO>();
            CreateMap<PhotoforUploadDTO, Photo>();
            CreateMap<Photo, PhotoforUploadDTO>();
            CreateMap<UserforEditDTO, User>();
            CreateMap<UserForRegisterDTO, User>();
            CreateMap<MessageForCreationDTO, Message>();
            CreateMap<Message, MessageForCreationDTO>();
            CreateMap<Message, MessageToReturnDTO>()
            .ForMember(dest => dest.SenderPhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url);
            })
            .ForMember(dest => dest.RecipientPhotoUrl, opt =>
            {
                opt.MapFrom(scr => scr.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url);
            });


        }
    }
}