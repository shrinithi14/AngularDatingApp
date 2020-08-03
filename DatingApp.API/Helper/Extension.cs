using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helper
{
    public static class Extension
    {
        public static void AddApplicationError(this HttpResponse response, string errorMessage)
        {
            response.Headers.Add("Application-Error", errorMessage);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static int CalculateAge(this DateTime dateOfbirth)
        {
            int age = DateTime.Now.Year - dateOfbirth.Year;
            if (dateOfbirth.AddYears(age) > DateTime.Now)
            {
                age--;
            }
            return age;
        }

        public static void AddPagination(this HttpResponse response,
        int totalPages, int totalItems, int currentPage, int pageSize)
        {
            var paginationHeader = new PaginationHeader(totalPages,
                                                        totalItems,
                                                        currentPage,
                                                        pageSize);

            var camelCaseformatter = new JsonSerializerSettings();
            camelCaseformatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination",
JsonConvert.SerializeObject(paginationHeader, camelCaseformatter));
     response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

        }
    }
}