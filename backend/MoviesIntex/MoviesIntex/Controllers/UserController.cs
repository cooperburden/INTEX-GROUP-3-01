using Microsoft.AspNetCore.Mvc;
using MoviesIntex.Data;

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
    }
}