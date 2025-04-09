using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoviesIntex.Data;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

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
                .ToList() // brings data into memory, allowing LINQ-to-Objects
                .Select(title => new
                {
                    title.ShowId,
                    title.Title,
                    title.Type,
                    title.Director,
                    title.Cast,
                    title.Country,
                    title.ReleaseYear,
                    title.Rating,
                    title.Duration,
                    title.Description,

                    averageRating = _context.MovieRatings
                        .Where(r => r.ShowId == title.ShowId)
                        .Average(r => (double?)r.Rating) ?? 0,

                    // Genre flags
                    title.Action,
                    title.Adventure,
                    title.AnimeSeriesInternationalTVShows,
                    title.BritishTVShowsDocuseriesInternationalTVShows,
                    title.Children,
                    title.Comedies,
                    title.ComediesDramasInternationalMovies,
                    title.ComediesInternationalMovies,
                    title.ComediesRomanticMovies,
                    title.CrimeTVShowsDocuseries,
                    title.Documentaries,
                    title.DocumentariesInternationalMovies,
                    title.Docuseries,
                    title.Dramas,
                    title.DramasInternationalMovies,
                    title.DramasRomanticMovies,
                    title.FamilyMovies,
                    title.Fantasy,
                    title.HorrorMovies,
                    title.InternationalMoviesThrillers,
                    title.InternationalTVShowsRomanticTVShowsTVDramas,
                    title.KidsTV,
                    title.LanguageTVShows,
                    title.Musicals,
                    title.NatureTV,
                    title.RealityTV,
                    title.Spirituality,
                    title.TVAction,
                    title.TVComedies,
                    title.TVDramas,
                    title.TalkShowsTVComedies,
                    title.Thrillers
                })
                .ToList();

            return Ok(titlesWithRatings);
        }

        [HttpGet("Admin")]
        public IActionResult GetMovies(
        int pageSize = 5,
        int pageNum = 1,
        [FromQuery] List<string>? movieCategories = null,
        string sortOrder = "asc",
        string searchQuery = ""  // Add searchQuery as a parameter
)
        {
            var query = _context.MovieTitles.AsQueryable();

            // Filter by movie categories (genre filters)
            if (movieCategories != null && movieCategories.Any())
            {
                // Dynamically filter by multiple genre columns in the database
                query = query.Where(m =>
                    (movieCategories.Contains("Action") && m.Action == 1) ||
                    (movieCategories.Contains("Adventure") && m.Adventure == 1) ||
                    (movieCategories.Contains("Anime Series International TV Shows") && m.AnimeSeriesInternationalTVShows == 1) ||
                    (movieCategories.Contains("British TV Shows Docuseries International TV Shows") && m.BritishTVShowsDocuseriesInternationalTVShows == 1) ||
                    (movieCategories.Contains("Children") && m.Children == 1) ||
                    (movieCategories.Contains("Comedies") && m.Comedies == 1) ||
                    (movieCategories.Contains("Comedies Dramas International Movies") && m.ComediesDramasInternationalMovies == 1) ||
                    (movieCategories.Contains("Comedies International Movies") && m.ComediesInternationalMovies == 1) ||
                    (movieCategories.Contains("Comedies Romantic Movies") && m.ComediesRomanticMovies == 1) ||
                    (movieCategories.Contains("Crime TV Shows Docuseries") && m.CrimeTVShowsDocuseries == 1) ||
                    (movieCategories.Contains("Documentaries") && m.Documentaries == 1) ||
                    (movieCategories.Contains("Documentaries International Movies") && m.DocumentariesInternationalMovies == 1) ||
                    (movieCategories.Contains("Docuseries") && m.Docuseries == 1) ||
                    (movieCategories.Contains("Dramas") && m.Dramas == 1) ||
                    (movieCategories.Contains("Dramas International Movies") && m.DramasInternationalMovies == 1) ||
                    (movieCategories.Contains("Dramas Romantic Movies") && m.DramasRomanticMovies == 1) ||
                    (movieCategories.Contains("Family Movies") && m.FamilyMovies == 1) ||
                    (movieCategories.Contains("Fantasy") && m.Fantasy == 1) ||
                    (movieCategories.Contains("Horror Movies") && m.HorrorMovies == 1) ||
                    (movieCategories.Contains("International Movies Thrillers") && m.InternationalMoviesThrillers == 1) ||
                    (movieCategories.Contains("International TV Shows Romantic TV Shows TV Dramas") && m.InternationalTVShowsRomanticTVShowsTVDramas == 1) ||
                    (movieCategories.Contains("Kids' TV") && m.KidsTV == 1) ||
                    (movieCategories.Contains("Language TV Shows") && m.LanguageTVShows == 1) ||
                    (movieCategories.Contains("Musicals") && m.Musicals == 1) ||
                    (movieCategories.Contains("Nature TV") && m.NatureTV == 1) ||
                    (movieCategories.Contains("Reality TV") && m.RealityTV == 1) ||
                    (movieCategories.Contains("Spirituality") && m.Spirituality == 1) ||
                    (movieCategories.Contains("TV Action") && m.TVAction == 1) ||
                    (movieCategories.Contains("TV Comedies") && m.TVComedies == 1) ||
                    (movieCategories.Contains("TV Dramas") && m.TVDramas == 1) ||
                    (movieCategories.Contains("Talk Shows TV Comedies") && m.TalkShowsTVComedies == 1) ||
                    (movieCategories.Contains("Thrillers") && m.Thrillers == 1)
                );
            }

            // Filter by search query (case-insensitive), now done at the database level
            if (!string.IsNullOrEmpty(searchQuery))
            {
                query = query.Where(m => EF.Functions.Like(m.Title, $"%{searchQuery}%"));
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

            var movies = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumMovies = query.Count();

            var result = new
            {
                Movies = movies,
                TotalNumMovies = totalNumMovies
            };

            return Ok(result);
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

            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            existingMovie.Type = updateMovie.Type;
            existingMovie.Title = updateMovie.Title;
            existingMovie.Director = updateMovie.Director;
            existingMovie.Cast = updateMovie.Cast;
            existingMovie.Country = updateMovie.Country;
            existingMovie.ReleaseYear = updateMovie.ReleaseYear;
            existingMovie.Rating = updateMovie.Rating;
            existingMovie.Duration = updateMovie.Duration;
            existingMovie.Description = updateMovie.Description;

            // Update genre flags
            existingMovie.Action = updateMovie.Action;
            existingMovie.Adventure = updateMovie.Adventure;
            existingMovie.AnimeSeriesInternationalTVShows = updateMovie.AnimeSeriesInternationalTVShows;
            existingMovie.BritishTVShowsDocuseriesInternationalTVShows = updateMovie.BritishTVShowsDocuseriesInternationalTVShows;
            existingMovie.Children = updateMovie.Children;
            existingMovie.Comedies = updateMovie.Comedies;
            existingMovie.ComediesDramasInternationalMovies = updateMovie.ComediesDramasInternationalMovies;
            existingMovie.ComediesInternationalMovies = updateMovie.ComediesInternationalMovies;
            existingMovie.ComediesRomanticMovies = updateMovie.ComediesRomanticMovies;
            existingMovie.CrimeTVShowsDocuseries = updateMovie.CrimeTVShowsDocuseries;
            existingMovie.Documentaries = updateMovie.Documentaries;
            existingMovie.DocumentariesInternationalMovies = updateMovie.DocumentariesInternationalMovies;
            existingMovie.Docuseries = updateMovie.Docuseries;
            existingMovie.Dramas = updateMovie.Dramas;
            existingMovie.DramasInternationalMovies = updateMovie.DramasInternationalMovies;
            existingMovie.DramasRomanticMovies = updateMovie.DramasRomanticMovies;
            existingMovie.FamilyMovies = updateMovie.FamilyMovies;
            existingMovie.Fantasy = updateMovie.Fantasy;
            existingMovie.HorrorMovies = updateMovie.HorrorMovies;
            existingMovie.InternationalMoviesThrillers = updateMovie.InternationalMoviesThrillers;
            existingMovie.InternationalTVShowsRomanticTVShowsTVDramas = updateMovie.InternationalTVShowsRomanticTVShowsTVDramas;
            existingMovie.KidsTV = updateMovie.KidsTV;
            existingMovie.LanguageTVShows = updateMovie.LanguageTVShows;
            existingMovie.Musicals = updateMovie.Musicals;
            existingMovie.NatureTV = updateMovie.NatureTV;
            existingMovie.RealityTV = updateMovie.RealityTV;
            existingMovie.Spirituality = updateMovie.Spirituality;
            existingMovie.TVAction = updateMovie.TVAction;
            existingMovie.TVComedies = updateMovie.TVComedies;
            existingMovie.TVDramas = updateMovie.TVDramas;
            existingMovie.TalkShowsTVComedies = updateMovie.TalkShowsTVComedies;
            existingMovie.Thrillers = updateMovie.Thrillers;

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
