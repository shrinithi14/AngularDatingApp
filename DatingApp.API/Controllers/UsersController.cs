using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Helper;
using DatingApp.API.Models;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(UserActivityLogger))]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // [HttpGet]
        // public async Task<IActionResult> Get()
        // {
        //     var users = await _repo.GetUsers();
        //     var usersToReturn = _mapper.Map<List<UserForListDTO>>(users);
        //     return Ok(usersToReturn);
        // }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailDTO>(user);
            return Ok(userToReturn);
        }
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] UserParams userParams)
        {
            var currentuserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            userParams.UserId = currentuserId;
            var currentUser = await _repo.GetUser(currentuserId);

            if (string.IsNullOrWhiteSpace(userParams.Gender))
            {
                userParams.Gender = (currentUser.Gender == "male") ? "female" : "male";
            }
            var users = await _repo.GetUsers(userParams);

            var usersToReturn = _mapper.Map<List<UserForListDTO>>(users);

            Response.AddPagination(users.CurrentPage, users.TotalCount, users.CurrentPage, users.PageSize);
            return Ok(usersToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, UserforEditDTO userForedit)
        {

            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userForedit, userFromRepo);
            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating User {id} falied");

        }
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> Like(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var like = await _repo.GetLike(id, recipientId);
            if (like != null)
            {
                return BadRequest("You already liked the user");
            }
            if (await _repo.GetUser(recipientId) == null)
            {
                return BadRequest("User does not exist");
            }
            if (id == recipientId)
            {
                return BadRequest("You cannot like yourself");
            }

            like = new Like()
            {
                LikerId = id,
                LikeeId = recipientId
            };
            _repo.Add(like);

            if (await _repo.SaveAll())
                return Ok();

            throw new Exception("Cannot like user");
        }
        [HttpPost("{id}/unlike/{recipientId}")]
        public async Task<IActionResult> UnLikeUser(int id, int recipientId)
        {

            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            if (id == recipientId)
            {
                return BadRequest("You cannot unlike yourself");
            }
            if (await _repo.GetUser(recipientId) == null)
            {
                return BadRequest("User does not exist");
            }
            var like = await _repo.GetLike(id, recipientId);
            
            if (like == null)
            {
                return Ok();
            }
            _repo.Remove(like);

            if (await _repo.SaveAll())
                return Ok();

            throw new Exception("Cannot unlike user");
        }

    }
}