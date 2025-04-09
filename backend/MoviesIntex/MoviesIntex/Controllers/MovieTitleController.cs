using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoviesIntex.Data;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace MoviesIntex.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieTitlesController : ControllerBase
    {
        private readonly MovieDbContext _context;

        private static readonly Dictionary<string, string> GenreMapping = new(StringComparer.OrdinalIgnoreCase)
        {
            { "action", "Action" },
            { "adventure", "Adventure" },
            { "animeseriesinternationaltvshows", "Anime Series International TV Shows" },
            { "britishtvshowsdocuseriesinternationaltvshows", "British TV Shows Docuseries International TV Shows" },
            { "children", "Children" },
            { "comedies", "Comedies" },
            { "comediesdramasinternationalmovies", "Comedies Dramas International Movies" },
            { "comediesinternationalmovies", "Comedies International Movies" },
            { "comediesromanticmovies", "Comedies Romantic Movies" },
            { "crimetvshowsdocuseries", "Crime TV Shows Docuseries" },
            { "documentaries", "Documentaries" },
            { "documentariesinternationalmovies", "Documentaries International Movies" },
            { "docuseries", "Docuseries" },
            { "dramas", "Dramas" },
            { "dramasinternationalmovies", "Dramas International Movies" },
            { "dramasromanticmovies", "Dramas Romantic Movies" },
            { "familymovies", "Family Movies" },
            { "fantasy", "Fantasy" },
            { "horrormovies", "Horror Movies" },
            { "internationalmoviesthrillers", "International Movies Thrillers" },
            { "internationaltvshowsromantictvshowstvdramas", "International TV Shows Romantic TV Shows TV Dramas" },
            { "kidstv", "Kids' TV" },
            { "languagetvshows", "Language TV Shows" },
            { "musicals", "Musicals" },
            { "naturetv", "Nature TV" },
            { "realitytv", "Reality TV" },
            { "spirituality", "Spirituality" },
            { "tvaction", "TV Action" },
            { "tvcomedies", "TV Comedies" },
            { "tvdramas", "TV Dramas" },
            { "talkshowstvcomedies", "Talk Shows TV Comedies" },
            { "thrillers", "Thrillers" }
        };


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

    if (movieCategories != null && movieCategories.Any())
    {
        // Mapping dictionary to convert simplified incoming genre strings into the full expected genre names.
        var genreMapping = GenreMapping;

                // Normalize and map the incoming genre values.
                // Remove spaces from the incoming value and convert to lowercase as the lookup key.
        var normalizedGenres = movieCategories
            .Select(g =>
            {
                var key = Regex.Replace(g.ToLower(), @"[^a-z]", ""); // removes all non-letters
                return genreMapping.ContainsKey(key) ? genreMapping[key] : g;
            })
            .ToList();

                // Filter by movie categories (genre filters) using the normalized genres.
                query = query.Where(m =>
            (normalizedGenres.Contains("Action") && m.Action == 1) ||
            (normalizedGenres.Contains("Adventure") && m.Adventure == 1) ||
            (normalizedGenres.Contains("Anime Series International TV Shows") && m.AnimeSeriesInternationalTVShows == 1) ||
            (normalizedGenres.Contains("British TV Shows Docuseries International TV Shows") && m.BritishTVShowsDocuseriesInternationalTVShows == 1) ||
            (normalizedGenres.Contains("Children") && m.Children == 1) ||
            (normalizedGenres.Contains("Comedies") && m.Comedies == 1) ||
            (normalizedGenres.Contains("Comedies Dramas International Movies") && m.ComediesDramasInternationalMovies == 1) ||
            (normalizedGenres.Contains("Comedies International Movies") && m.ComediesInternationalMovies == 1) ||
            (normalizedGenres.Contains("Comedies Romantic Movies") && m.ComediesRomanticMovies == 1) ||
            (normalizedGenres.Contains("Crime TV Shows Docuseries") && m.CrimeTVShowsDocuseries == 1) ||
            (normalizedGenres.Contains("Documentaries") && m.Documentaries == 1) ||
            (normalizedGenres.Contains("Documentaries International Movies") && m.DocumentariesInternationalMovies == 1) ||
            (normalizedGenres.Contains("Docuseries") && m.Docuseries == 1) ||
            (normalizedGenres.Contains("Dramas") && m.Dramas == 1) ||
            (normalizedGenres.Contains("Dramas International Movies") && m.DramasInternationalMovies == 1) ||
            (normalizedGenres.Contains("Dramas Romantic Movies") && m.DramasRomanticMovies == 1) ||
            (normalizedGenres.Contains("Family Movies") && m.FamilyMovies == 1) ||
            (normalizedGenres.Contains("Fantasy") && m.Fantasy == 1) ||
            (normalizedGenres.Contains("Horror Movies") && m.HorrorMovies == 1) ||
            (normalizedGenres.Contains("International Movies Thrillers") && m.InternationalMoviesThrillers == 1) ||
            (normalizedGenres.Contains("International TV Shows Romantic TV Shows TV Dramas") && m.InternationalTVShowsRomanticTVShowsTVDramas == 1) ||
            (normalizedGenres.Contains("Kids' TV") && m.KidsTV == 1) ||
            (normalizedGenres.Contains("Language TV Shows") && m.LanguageTVShows == 1) ||
            (normalizedGenres.Contains("Musicals") && m.Musicals == 1) ||
            (normalizedGenres.Contains("Nature TV") && m.NatureTV == 1) ||
            (normalizedGenres.Contains("Reality TV") && m.RealityTV == 1) ||
            (normalizedGenres.Contains("Spirituality") && m.Spirituality == 1) ||
            (normalizedGenres.Contains("TV Action") && m.TVAction == 1) ||
            (normalizedGenres.Contains("TV Comedies") && m.TVComedies == 1) ||
            (normalizedGenres.Contains("TV Dramas") && m.TVDramas == 1) ||
            (normalizedGenres.Contains("Talk Shows TV Comedies") && m.TalkShowsTVComedies == 1) ||
            (normalizedGenres.Contains("Thrillers") && m.Thrillers == 1)
        );
    }

    // Filter by search query (case-insensitive) at the database level.
    if (!string.IsNullOrEmpty(searchQuery))
    {
        query = query.Where(m => EF.Functions.Like(m.Title, $"%{searchQuery}%"));
    }

    // Sort by title based on sortOrder.
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

    private List<string> GetRecommendedMovieIds(string userId)
{
    // TODO: Replace this dummy logic with your actual recommendation model.
    // For now, assume these are the recommended movie ShowIds.
    return new List<string> { "s1", "s2", "s3" };
}

[HttpGet("Recommended")]
public IActionResult GetRecommendedMovies()
{
    // Step 2A. Retrieve the logged-in user's identifier.
    // If your authentication system stores the user’s identity as a claim, you could access it like this:
    var userId = User.Identity.Name;
    
    // (Optional) If you need to verify that the user is logged in, you can add:
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized(new { message = "User is not authenticated." });
    }
    
    // Step 2B. Get the recommended movie IDs using your recommender helper.
    List<string> recommendedIds = GetRecommendedMovieIds(userId);
    
    // Step 2C. Query the database to get the full list of movies.
    // The following loads movies into memory—if your dataset is large, consider refining this query.
    var allMovies = _context.MovieTitles.ToList();
    
    // Step 2D. Filter the movies based on the recommended movie IDs.
    var recommendedMovies = allMovies
        .Where(movie => recommendedIds.Contains(movie.ShowId))
        .Select(movie => new
        {
            movie.ShowId,
            movie.Title,
            movie.Type,
            movie.Director,
            movie.Cast,
            movie.Country,
            movie.ReleaseYear,
            movie.Rating,
            movie.Duration,
            movie.Description
            // Include any other properties you need
        })
        .ToList();
    
    // Step 2E. Return the filtered list as JSON.
    return Ok(new { Recommendations = recommendedMovies });
}

}
}
