using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helper
{
    public static class Extension
    {
        public static void AddApplicationError(this HttpResponse response,string errorMessage){
            response.Headers.Add("Application-Error",errorMessage);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }

        public static int CalculateAge(this  DateTime dateOfbirth){
            int age =  DateTime.Now.Year - dateOfbirth.Year;
            if(dateOfbirth.AddYears(age) > DateTime.Now){
                age--;
            }
            return age;
        }
    }
}