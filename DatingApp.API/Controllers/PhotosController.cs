using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helper;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public PhotosController(IDatingRepository datingRepository,
        IOptions<CloudinarySettings> cloudinarySettings,
        IMapper mapper)
        {
            _mapper = mapper;
            _datingRepository = datingRepository;
        }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _datingRepository.GetPhoto(id);
            var photoToreturn = _mapper.Map<PhotoforUploadDTO>(photo);
            return Ok(photoToreturn);
        }


        [HttpPost]
        public async Task<IActionResult> AddPhoto(
            int userId, PhotoforUploadDTO photoforUploadDTO)
        {
            var photo = _mapper.Map<Photo>(photoforUploadDTO);
            var user = await _datingRepository.GetUser(userId);

            if (!user.Photos.Any(u => u.IsMain))
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            if (await _datingRepository.SaveAll())
            {
                var photoToreturn = _mapper.Map<PhotoforUploadDTO>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id, userId = userId }, photoToreturn);
            }

            return BadRequest("Cannot Add Photo");
        }
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _datingRepository.GetUser(userId);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            var photo = await _datingRepository.GetPhoto(id);
            if (photo.IsMain)
                return BadRequest("Photo is already main");

            var currentPhoto = await _datingRepository.GetMainPhoto(userId);
            if (currentPhoto != null)
            {
                photo.IsMain = true;
                currentPhoto.IsMain = false;
            }

            if (await _datingRepository.SaveAll())
                return NoContent();

            return BadRequest("Cannot Set main Photo");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _datingRepository.GetUser(userId);
           
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            
            var photo = await _datingRepository.GetPhoto(id);

            if(photo.IsMain)
            return BadRequest("Cannot Delete main Photo");
            
            user.Photos.Remove(photo);

            if (await _datingRepository.SaveAll())
                return Ok();

            return BadRequest("Cannot Delete Photo");


        }
    }


}