using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Dtos;
using DatingApp.API.Helper;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes
            .FirstOrDefaultAsync(l => l.LikerId == userId && l.LikeeId == recipientId);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(u => u.Photos).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where(u => u.Gender == userParams.Gender);

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDOB = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDOB && u.DateOfBirth <= maxDOB);
            }
            if (userParams.IncludeLikers)
            {
                var userLikes = await GetUserLikers(userParams.UserId);
                users = users.Where(u => userLikes.likers.Contains(u.Id));
            }
            if (userParams.IncludeLikees)
            {
                var userLikes = await GetUserLikers(userParams.UserId);
                users = users.Where(u => userLikes.likees.Contains(u.Id));
            }
            switch (userParams.OrderBy)
            {
                case "created":
                    users = users.OrderByDescending(u => u.Created);
                    break;
                default:
                    users = users.OrderByDescending(u => u.LastActive);
                    break;
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public void Remove<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        private async Task<(IEnumerable<int> likers, IEnumerable<int> likees)> GetUserLikers(int userId)
        {

            var user = await _context.Users
            .Include(u => u.Likers)
            .Include(u => u.Likees)
            .FirstOrDefaultAsync(u => u.Id == userId);

            return (
                user.Likers.Where(l => l.LikeeId == userId).Select(l => l.LikerId),
                user.Likees.Where(l => l.LikerId == userId).Select(l => l.LikeeId));
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetUserMessage(MessageParams messageParams)
        {
            var messages = _context.Messages
                            .Include(u => u.Sender).ThenInclude(p => p.Photos)
                            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                            .AsQueryable();
            switch (messageParams.MessageContainer)
            {
                case "inbox":
                    messages = messages.Where(messages => messages.RecipientId == messageParams.UserId
                    && messages.RecipientDeleted == false);
                    break;
                case "outbox":
                    messages = messages.Where(messages => messages.SenderId == messageParams.UserId
                    && messages.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(message => message.RecipientId == messageParams.UserId
                     && message.isRead == false && message.RecipientDeleted == false);
                    break;

            }
            messages = messages.OrderByDescending(m => m.DateSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int senderId, int recipientId)
        {
            return await _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
             .Include(u => u.Recipient).ThenInclude(p => p.Photos)
             .Where(m => m.SenderId == senderId
                && m.RecipientId == recipientId && m.RecipientDeleted == false ||
                m.RecipientId == senderId && m.SenderId == recipientId
                 && m.SenderDeleted == false)
                .OrderBy(m => m.DateSent).ToListAsync();
        }
    }
}