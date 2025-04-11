import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { fetchMovies } from '../api/MoviesAPI';
import Footer from '../components/Footer';
import GenreFilter from '../components/GenreFilter';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const MOVIES_PER_PAGE = 40;

const Search = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const navigate = useNavigate();

  const allGenres = [
    'action', 'adventure', 'animeSeriesInternationalTVShows', 'britishTVShowsDocuseriesInternationalTVShows', 
    'children', 'comedies', 'comediesDramasInternationalMovies', 'comediesInternationalMovies', 
    'comediesRomanticMovies', 'crimeTVShowsDocuseries', 'documentaries', 'documentariesInternationalMovies', 
    'docuseries', 'dramas', 'dramasInternationalMovies', 'dramasRomanticMovies', 'familyMovies', 'fantasy', 
    'horrorMovies', 'internationalMoviesThrillers', 'internationalTVShowsRomanticTVShowsTVDramas', 'kidsTV', 
    'languageTVShows', 'musicals', 'natureTV', 'realityTV', 'spirituality', 'tvAction', 'tvComedies', 'tvDramas', 
    'talkShowsTVComedies', 'thrillers'
  ];

  // Debounce search input to avoid too many API calls.
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Reset movie list when search query or genres change.
  useEffect(() => {
    // Reset list, pagination, and flag.
    setMovies([]);
    setPage(1);
    setHasMore(true);
    loadMovies(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, selectedGenres]);

  // Function to load movies for a given page.
  const loadMovies = async (pageToLoad: number, replace: boolean = false) => {
    setLoading(true);
    try {
      // Pass the limit (MOVIES_PER_PAGE) and the current page number.
      const data = await fetchMovies(MOVIES_PER_PAGE, pageToLoad, selectedGenres, 'asc', debouncedSearchQuery);
      
      if (replace) {
        setMovies(data.movies);
      } else {
        setMovies((prev) => [...prev, ...data.movies]);
      }
      // If we received fewer movies than requested, we've reached the end.
      if (data.movies.length < MOVIES_PER_PAGE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll: add an event listener to load more movies when near bottom.
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      // Check if the user has scrolled near the bottom (100px from the bottom)
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 10) {
        const nextPage = page + 1;
        loadMovies(nextPage);
        setPage(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page, debouncedSearchQuery, selectedGenres]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSeeMoreClick = (showId: string) => {
    navigate(`/movieDetails/${showId}`);
  };

  return (
    <>
      <div>
        <Header />
      </div>

      <div className="container-fluid" style={{ padding: '20px', marginTop: '100px' }}>
        <h1 style={{ paddingTop: '20px' }}>Search</h1>
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

            <div className="row">
              {movies.map((movie) => (
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
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => {
                      const div = e.currentTarget as HTMLDivElement;
                      div.style.transform = 'scale(1.0)';
                    }}
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
                      onClick={() => handleSeeMoreClick(movie.showId)}
                      style={{
                        marginTop: 'auto',
                        fontSize: '0.8rem',
                        padding: '5px 10px',
                      }}
                    >
                      See More
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {loading && <p>Loading movies...</p>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
