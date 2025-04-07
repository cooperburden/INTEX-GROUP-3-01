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
            var titlesWithRatings = _context.MovieTitles
                .Select(title => new
                {
                    title.ShowId,
                    title.Title,
                    title.Description,
                    // ... any other fields you want to include ...
                    AverageRating = _context.MovieRatings
                        .Where(r => r.ShowId == title.ShowId)
                        .Average(r => (double?)r.Rating) ?? 0
                })
                .ToList();
            return Ok(titlesWithRatings);
        }
    }
}
