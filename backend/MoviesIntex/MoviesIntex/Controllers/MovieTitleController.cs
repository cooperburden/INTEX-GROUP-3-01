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

        [HttpGet("Admin")]
        public IActionResult GetMovies(int pageSize = 5, int pageNum = 1, [FromQuery] List<string>? movieCategories = null, string sortOrder = "asc")
        {
            var query = _context.MovieTitles.AsQueryable();

            if (movieCategories != null && movieCategories.Any())
            {
                query = query.AsQueryable().Where(m => movieCategories.Contains(m.Type));
            }

            // Sort by title based on the sortOrder
            if (sortOrder.ToLower() == "desc")
            {
                query = query.OrderByDescending(m => m.Title);
            }
            else
            {
                query = query.OrderBy(m => m.Title);
            }

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumMovies = query.Count();

            var someObject = new
            {
                Movies = something,
                TotalNumMovies = totalNumMovies
            };

            return Ok(someObject);
        }


        [HttpGet("GetMovieCategories")]
        public IActionResult GetMovieCategories()
        {
            var movieCategories = _context.MovieTitles
                .Select(b => b.Type)
                .Distinct()
                .ToList();

            return Ok(movieCategories);
        }

        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] MovieTitle newMovie)
        {
            _context.MovieTitles.Add(newMovie);
            _context.SaveChanges();
            return Ok(newMovie);
        }

        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(string showId, [FromBody] MovieTitle updateMovie)
        {
            var existingMovie = _context.MovieTitles.Find(showId);

            existingMovie.Type = updateMovie.Type;
            existingMovie.Title = updateMovie.Title;
            existingMovie.Director = updateMovie.Director;
            existingMovie.Cast = updateMovie.Cast;
            existingMovie.Country = updateMovie.Country;
            existingMovie.ReleaseYear = updateMovie.ReleaseYear;
            existingMovie.Rating = updateMovie.Rating;
            existingMovie.Duration = updateMovie.Duration;
            existingMovie.Description = updateMovie.Description;

            _context.MovieTitles.Update(existingMovie);
            _context.SaveChanges();

            return Ok(existingMovie);
        }

        [HttpDelete("DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(string showId)
        {
            var movie = _context.MovieTitles.Find(showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            _context.MovieTitles.Remove(movie);
            _context.SaveChanges();

            return NoContent();


        
    }
}
}
