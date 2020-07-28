using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DatingApp.API.Helper
{
    public class UserActivityLogger : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            int userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userRepo = (IDatingRepository)resultContext.HttpContext.RequestServices.GetService(typeof(IDatingRepository));
            var user = await userRepo.GetUser(userId);
            user.LastActive = DateTime.Now;
            await userRepo.SaveAll();
        }
    }
}