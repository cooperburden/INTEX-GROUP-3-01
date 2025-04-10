using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using MoviesIntex.Data;

namespace MoviesIntex.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public TestController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser()
        {
            var user = new IdentityUser
            {
                UserName = "esmith@hotmail.com", // Use the correct email
                Email = "esmith@hotmail.com"    // Use the correct email
            };

            var result = await _userManager.CreateAsync(user, "StephenPeters1234!");

            if (result.Succeeded)
            {
                return Ok("User created successfully!");
            }
            else
            {
                return BadRequest("Error creating user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}