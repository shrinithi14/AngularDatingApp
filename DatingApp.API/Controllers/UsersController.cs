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

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
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
        public async Task<IActionResult> Get(string value, string filter)
        {
            var users = await _repo.GetUsers();
            if (!string.IsNullOrWhiteSpace(filter) && !string.IsNullOrWhiteSpace(value))
            {
                var user = users.FirstOrDefault(u => u.UserName == value);
                var userToReturn = _mapper.Map<UserForDetailDTO>(user);
                return Ok(userToReturn);
            }
            var usersToReturn = _mapper.Map<List<UserForListDTO>>(users);
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

    }
}