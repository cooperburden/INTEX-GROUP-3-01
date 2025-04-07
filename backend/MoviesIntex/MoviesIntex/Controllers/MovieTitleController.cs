using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoviesIntex.Data;

namespace MoviesIntex.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieTitlesController : ControllerBase
    {
        private readonly MovieDbContext _context;

        public MovieTitlesController(MovieDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllMovieTitles()
        {
            var titles = _context.MovieTitles.ToList();
            return Ok(titles);
        }
    }
}
