using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helper;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<User> GetUser(int id);
        void Add<T>(T entity) where T : class ;
        void Remove<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<Photo> GetPhoto(int id);

        Task<Photo> GetMainPhoto(int userId);
    }
}