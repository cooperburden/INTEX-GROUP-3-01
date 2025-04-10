using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // 👈 Don't forget this one too!
using MoviesIntex.Data;
using System.Security.Claims;

namespace MoviesIntex.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly MovieDbContext _context;

        public UsersController(MovieDbContext context)
        {
            _context = context;
        }

        [HttpPost("AddUser")]
        public IActionResult AddUser([FromBody] MovieUser newUser)
        {
            Console.WriteLine("🔥 AddUser endpoint hit!");
            Console.WriteLine($"Received: {newUser.Name}, {newUser.Email}");

            if (newUser == null)
            {
                return BadRequest("User data is null.");
            }

            _context.MovieUsers.Add(newUser);
            _context.SaveChanges();

            return Ok(newUser);
        }

        // ✅ This is inside the controller now
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetMyProfile()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var user = _context.MovieUsers.FirstOrDefault(u => u.Email == email);

            if (user == null)
                return NotFound("User not found in Movies.db");

            return Ok(user);
        }
    }
}