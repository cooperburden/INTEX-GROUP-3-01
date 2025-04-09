import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { deleteMovie, fetchMovies } from '../api/MoviesAPI';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import Footer from '../components/Footer';

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]); // Added filteredMovies state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies(pageSize, pageNum, [], 'asc', searchQuery);
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum, searchQuery]);

  // Filter movies based on the search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredMovies(movies); // No filtering if search is empty
    } else {
      setFilteredMovies(
        movies.filter((movie) =>
          (movie.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (movie.director?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (movie.country?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, movies]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  const handleDelete = async (showId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (!confirmDelete) return;
  
    try {
      await deleteMovie(showId);
      // Correctly filter out the deleted movie
      setMovies(movies.filter((m) => m.showId !== showId));
      setFilteredMovies(filteredMovies.filter((m) => m.showId !== showId)); // Update filteredMovies as well
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
    return ''; // Return empty string if no genre is selected
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Movies</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Movie
        </button>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange} // Handle search change
        />
      </div>

      {showForm && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(pageSize, pageNum, [], 'asc', '').then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onSuccess={() => {
            setEditingMovie(null);
            fetchMovies(pageSize, pageNum, [], 'asc', '').then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Show ID</th>
            <th>Type</th>
            <th>Title</th>
            <th>Director</th>
            <th>Cast</th>
            <th>Country</th>
            <th>Release Year</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredMovies.map((m) => (
            <tr key={m.showId}>
              <td>{m.showId}</td>
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
                  className="btn btn-primary btn-sm w-100 mb-1"
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
      <Footer />
    </div>
  );
};

export default AdminPage;
