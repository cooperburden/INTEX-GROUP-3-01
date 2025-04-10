using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // 👈 Don't forget this one too!
using MoviesIntex.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace MoviesIntex.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly MovieDbContext _context;

        public UsersController(UserManager<IdentityUser> userManager, MovieDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // Register action to create new users
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { Message = "User created successfully!" });
            }

            return BadRequest(result.Errors);
        }

        // ✅ This is the existing endpoint to get the current user's profile (requires authorization)
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

        // AddUser endpoint for adding a user to the MovieUsers table (not related to Identity)
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

    // Model for user registration
    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
