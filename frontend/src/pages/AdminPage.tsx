import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { deleteMovie, fetchMovies } from '../api/MoviesAPI';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import Footer from '../components/Footer';
import GenreFilter from '../components/GenreFilter';
import Header from '../components/Header';
//import "../styles/admin.css"

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const allGenres = [
    'action', 'adventure', 'animeSeriesInternationalTVShows', 'britishTVShowsDocuseriesInternationalTVShows', 
    'children', 'comedies', 'comediesDramasInternationalMovies', 'comediesInternationalMovies', 
    'comediesRomanticMovies', 'crimeTVShowsDocuseries', 'documentaries', 'documentariesInternationalMovies', 
    'docuseries', 'dramas', 'dramasInternationalMovies', 'dramasRomanticMovies', 'familyMovies', 'fantasy', 
    'horrorMovies', 'internationalMoviesThrillers', 'internationalTVShowsRomanticTVShowsTVDramas', 'kidsTV', 
    'languageTVShows', 'musicals', 'natureTV', 'realityTV', 'spirituality', 'tvAction', 'tvComedies', 'tvDramas', 
    'talkShowsTVComedies', 'thrillers'
  ];

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

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
        const data = await fetchMovies(pageSize, pageNum, selectedGenres, 'asc', debouncedSearchQuery);
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    loadMovies();
  }, [pageSize, pageNum, debouncedSearchQuery, selectedGenres]);

  useEffect(() => {
    // Calculate header height after the component has mounted
    const header = document.querySelector('.header') as HTMLElement;
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    let filtered = movies;

    if (debouncedSearchQuery !== '') {
      const lowerCaseSearch = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((movie) =>
        (movie.title?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (movie.director?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (movie.country?.toLowerCase() || '').includes(lowerCaseSearch)
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        selectedGenres.every((genre) => (movie as any)[genre] === 1)
      );
    }

    setFilteredMovies(filtered);
  }, [debouncedSearchQuery, movies, selectedGenres]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (showId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this movie?');
    if (!confirmDelete) return;

    try {
      await deleteMovie(showId);
      const updatedMovies = movies.filter((m) => m.showId !== showId);
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);
    } catch (error) {
      alert('Failed to delete movie. Please try again.');
    }
  };

  const getGenreName = (movie: Movie) => {
    const genreMap: { [key: string]: string } = {
      action: 'Action',
      adventure: 'Adventure',
      animeSeriesInternationalTVShows: 'Anime Series / International TV Shows',
      britishTVShowsDocuseriesInternationalTVShows: 'British TV Shows / Docuseries / International TV Shows',
      children: 'Children',
      comedies: 'Comedies',
      comediesDramasInternationalMovies: 'Comedies / Dramas / International Movies',
      comediesInternationalMovies: 'Comedies / International Movies',
      comediesRomanticMovies: 'Comedies / Romantic Movies',
      crimeTVShowsDocuseries: 'Crime TV Shows / Docuseries',
      documentaries: 'Documentaries',
      documentariesInternationalMovies: 'Documentaries / International Movies',
      docuseries: 'Docuseries',
      dramas: 'Dramas',
      dramasInternationalMovies: 'Dramas / International Movies',
      dramasRomanticMovies: 'Dramas / Romantic Movies',
      familyMovies: 'Family Movies',
      fantasy: 'Fantasy',
      horrorMovies: 'Horror Movies',
      internationalMoviesThrillers: 'International Movies / Thrillers',
      internationalTVShowsRomanticTVShowsTVDramas: 'International TV Shows / Romantic TV Shows / TV Dramas',
      kidsTV: 'Kids TV',
      languageTVShows: 'Language TV Shows',
      musicals: 'Musicals',
      natureTV: 'Nature TV',
      realityTV: 'Reality TV',
      spirituality: 'Spirituality',
      tvAction: 'TV Action',
      tvComedies: 'TV Comedies',
      tvDramas: 'TV Dramas',
      talkShowsTVComedies: 'Talk Shows / TV Comedies',
      thrillers: 'Thrillers',
    };

    for (let genre in genreMap) {
      if ((movie as any)[genre] === 1) {
        return genreMap[genre];
      }
    }
    return '';
  };

  return (
    <>
      <div>
        <Header /> {/* Sticky header */}
      </div>


    <div className="container-fluid" style={{ marginTop: `${headerHeight}px`, padding: '20px' }}>
      <h1>Admin - Movies</h1>

      {error && <p className="text-red-500">Error: {error}</p>}

      {!showForm && (
        <button className="btn btn-danger mb-3" onClick={() => setShowForm(true)}>
          Add Movie
        </button>
      )}

      <div className="row">
        <div className="col-md-3">
          {/* Genre filter component */}
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

          {showForm && (
            <NewMovieForm
              onSuccess={() => {
                setShowForm(false);
                fetchMovies(pageSize, pageNum, [], 'asc', '').then((data) => setMovies(data.movies));
              }}
              onCancel={() => setShowForm(false)}
            />
          )}

          {editingMovie && (
            <EditMovieForm
              movie={editingMovie}
              onSuccess={() => {
                setEditingMovie(null);
                fetchMovies(pageSize, pageNum, [], 'asc', '').then((data) => setMovies(data.movies));
              }}
              onCancel={() => setEditingMovie(null)}
            />
          )}

          {loading ? (
            <p>Loading movies...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '5%' }}>Type</th>
                      <th style={{ width: '15%' }}>Title</th>
                      <th style={{ width: '10%' }}>Director</th>
                      <th style={{ width: '10%' }}>Cast</th>
                      <th style={{ width: '10%' }}>Country</th>
                      <th style={{ width: '5%' }}>Release Year</th>
                      <th style={{ width: '5%' }}>Rating</th>
                      <th style={{ width: '5%' }}>Duration</th>
                      <th style={{ width: '15%' }}>Description</th>
                      <th style={{ width: '10%' }}>Genre</th>
                      <th style={{ width: '10%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((m) => (
                      <tr key={m.showId}>
                        <td>{m.type}</td>
                        <td>{m.title}</td>
                        <td>{m.director}</td>
                        <td>{m.cast}</td>
                        <td>{m.country}</td>
                        <td>{m.releaseYear}</td>
                        <td>{m.rating}</td>
                        <td>{m.duration}</td>
                        <td>{m.description}</td>
                        <td>{getGenreName(m)}</td>
                        <td>
                          <button
                            className="btn btn-dark btn-sm w-100 mb-1"
                            onClick={() => setEditingMovie(m)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => handleDelete(m.showId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNum}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPageNum(1);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AdminPage;
