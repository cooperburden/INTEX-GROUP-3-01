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
                Console.WriteLine("⚠️ User data is null.");
                return BadRequest("User data is null.");
            }

            try
            {
                Console.WriteLine("🔥 Attempting to add user to MovieUsers table...");
                _context.MovieUsers.Add(newUser);
                _context.SaveChanges();
                Console.WriteLine("✅ User added to MovieUsers table successfully.");

            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Error adding user to MovieUsers: {ex.Message}");
                return StatusCode(500, "Error saving user to Movies.db");
            }

            return Ok(newUser);
        }


        // Model for user registration
        public class RegisterModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
