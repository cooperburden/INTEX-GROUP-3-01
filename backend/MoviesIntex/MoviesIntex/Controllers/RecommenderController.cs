using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System;

namespace MoviesIntex.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommenderController : ControllerBase
    {
        [HttpGet("{userId}")]
        public IActionResult GetRecommendations(string userId)
        {
            try
            {
                var url = $"http://127.0.0.1:5001/api/recommendations/{userId}";
                Console.WriteLine($"[INFO] Sending request to: {url}");

                var client = new HttpClient();
                var response = client.GetAsync(url).Result;

                if (!response.IsSuccessStatusCode)
                {
                    var error = response.Content.ReadAsStringAsync().Result;
                    Console.WriteLine($"[ERROR] Python API error — Status: {(int)response.StatusCode}, Body: {error}");
                    return StatusCode(500, new { message = "Python API error", error });
                }

                var content = response.Content.ReadAsStringAsync().Result;
                Console.WriteLine($"[SUCCESS] Python API response received for user {userId}");
                return Content(content, "application/json");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FATAL] Internal server error — Exception: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}