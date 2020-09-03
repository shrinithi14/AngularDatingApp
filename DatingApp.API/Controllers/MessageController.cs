using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helper;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Authorize]
    [ServiceFilter(typeof(UserActivityLogger))]
    [Route("api/users/{userId}/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessageController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> Get(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var message = await _repo.GetMessage(id);

            if (message == null)
                return NotFound();

            return Ok(message);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserMessages(int userId, [FromQuery] MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageParams.UserId = userId;
            var messages = await _repo.GetUserMessage(messageParams);
            var messagetoReturn = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messages);

            Response.AddPagination(messageParams.PageNumber,
            messages.TotalCount, messageParams.PageNumber, messageParams.PageSize);
            return Ok(messagetoReturn);

        }
        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messages = await _repo.GetMessageThread(userId, recipientId);
            var messagetoReturn = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messages);
            return Ok(messagetoReturn);

        }

        [HttpPost]
        public async Task<IActionResult> Create(int userId,
        [FromBody] MessageForCreationDTO messageForCreationDTO)
        {
            var sender = await _repo.GetUser(userId);

            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageForCreationDTO.SenderId = userId;
            var recipient = await _repo.GetUser(messageForCreationDTO.RecipientId);
            if (recipient == null)
                return BadRequest("Could not find recipient");

            var message = _mapper.Map<Message>(messageForCreationDTO);

            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messageToreturn = _mapper.Map<MessageToReturnDTO>(message);

                return CreatedAtRoute("GetMessage",
                new { userId = userId, id = message.Id }, messageToreturn);
            }

            throw new Exception("Error while creating message");
        }
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageToRemove = await _repo.GetMessage(id);

            if (userId == messageToRemove.SenderId)
            {
                messageToRemove.SenderDeleted = true;
            }
            if (userId == messageToRemove.RecipientId)
            {
                messageToRemove.RecipientDeleted = true;
            }
            if (messageToRemove.SenderDeleted && messageToRemove.RecipientDeleted)
            {
                _repo.Remove(messageToRemove);
            }
            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception("Error while Deleting the message");


        }
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkasRead(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repo.GetMessage(id);
            if (message != null)
            {
                message.isRead = true;
                message.DateRead = DateTime.Now;
            }
            if(await _repo.SaveAll())
            {
                return NoContent();
            }
            throw new Exception("Error while marking message as Read");
        }
    }
}