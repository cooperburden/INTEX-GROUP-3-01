import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { fetchMovies } from '../api/MoviesAPI';
import Footer from '../components/Footer';
import GenreFilter from '../components/GenreFilter';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Search = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const allGenres = [
    'action', 'adventure', 'animeSeriesInternationalTVShows', 'britishTVShowsDocuseriesInternationalTVShows', 
    'children', 'comedies', 'comediesDramasInternationalMovies', 'comediesInternationalMovies', 
    'comediesRomanticMovies', 'crimeTVShowsDocuseries', 'documentaries', 'documentariesInternationalMovies', 
    'docuseries', 'dramas', 'dramasInternationalMovies', 'dramasRomanticMovies', 'familyMovies', 'fantasy', 
    'horrorMovies', 'internationalMoviesThrillers', 'internationalTVShowsRomanticTVShowsTVDramas', 'kidsTV', 
    'languageTVShows', 'musicals', 'natureTV', 'realityTV', 'spirituality', 'tvAction', 'tvComedies', 'tvDramas', 
    'talkShowsTVComedies', 'thrillers'
  ];

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        // Fetching all movies by passing no limit
        const data = await fetchMovies(1000, 1, selectedGenres, 'asc', debouncedSearchQuery); // Adjust this if you want more
        setMovies(data.movies);
        setFilteredMovies(data.movies);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [debouncedSearchQuery, selectedGenres]);

  useEffect(() => {
    let filtered = movies;

    if (debouncedSearchQuery !== '') {
      const lowerCaseSearch = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((movie) =>
        (movie.title?.toLowerCase() || '').includes(lowerCaseSearch)
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        selectedGenres.some((genre) => (movie as any)[genre] === 1)
      );
    }

    setFilteredMovies(filtered);
  }, [debouncedSearchQuery, movies, selectedGenres]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSeeMoreClick = (showId: string) => {
    navigate(`/movieDetails/${showId}`); // Navigate to the movie details page
  };

  return (
    <>
      <div>
        <Header /> {/* Sticky header */}
      </div>

      <div className="container-fluid" style={{ padding: '20px', marginTop: '100px' }}>
        <h1 style={{ paddingTop: '20px' }}>Search</h1> {/* Added extra padding above the title */}

        <div className="row">
          <div className="col-md-3">
            <GenreFilter
              genres={allGenres}
              selectedGenres={selectedGenres}
              onGenreChange={setSelectedGenres}
            />
          </div>

          <div className="col-md-9">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {loading ? (
              <p>Loading movies...</p>
            ) : (
              <div className="row">
                {filteredMovies.map((movie) => (
                  <div className="col-md-3 mb-4" key={movie.showId}>
                    <div
                      className="card"
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        transition: 'transform 0.3s',
                        width: '200px',
                        height: '200px',
                        maxHeight: '500px',
                        display: 'flex',
                        flexDirection: 'column',  // Make the card a column flex container
                        justifyContent: 'space-between',  // Space out the content
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                    >
                      <div className="card-body" style={{ padding: '1rem' }}>
                        <h5
                          className="card-title"
                          style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            wordWrap: 'break-word',
                          }}
                        >
                          {movie.title}
                        </h5>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleSeeMoreClick(movie.showId)} // Add the click handler
                        style={{
                          marginTop: 'auto',  // Push the button to the bottom
                          fontSize: '0.8rem',  // Make the button smaller
                          padding: '5px 10px',  // Adjust padding to make the button smaller
                        }}
                      >
                        See More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Search;
