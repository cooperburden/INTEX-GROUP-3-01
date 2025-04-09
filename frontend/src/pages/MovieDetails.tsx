import { useState, useEffect } from 'react';
import { Movie } from '../types/Movie'; // Import the Movie type
import { fetchAllMovies } from '../api/MoviesAPI'; // Import your API fetch function
import Footer from '../components/Footer';
import Header from '../components/Header';

const MovieDetails = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Fetch movies from the API on component mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const moviesData = await fetchAllMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    };
    loadMovies();
  }, []);

  // Handle movie selection
  const handleMovieSelect = (movieId: string) => {
    const movie = movies.find((m) => m.showId === movieId);
    setSelectedMovie(movie || null); // Set the selected movie or null if not found
  };

  const getGenreNames = (movie: Movie) => {
    const genres = [];
    if (movie.action) genres.push('Action');
    if (movie.adventure) genres.push('Adventure');
    if (movie.comedies) genres.push('Comedy');
    if (movie.dramas) genres.push('Drama');
    if (movie.horrorMovies) genres.push('Horror');
    // Add more genre checks here as needed
    return genres.length > 0 ? genres.join(', ') : 'No genres listed';
  };

  return (
    <>
    <Header/>
    <div className="container" style={{ padding: '20px', marginTop: '80px' }}>
      <h1 style={{ paddingTop: '20px' }}>Movie Details</h1>
      
      {/* Movie Selector */}
      <div className="mb-4">
        <label htmlFor="movieSelect">Choose a movie: </label>
        <select
          id="movieSelect"
          onChange={(e) => handleMovieSelect(e.target.value)}
          className="form-control"
        >
          <option value="">Select a Movie</option>
          {movies.map((movie) => (
            <option key={movie.showId} value={movie.showId}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      {/* Movie Details */}
      {selectedMovie ? (
        <div className="movie-details">
          <h3>{selectedMovie.title}</h3>
          <p><strong>Director:</strong> {selectedMovie.director}</p>
          <p><strong>Cast:</strong> {selectedMovie.cast}</p>
          <p><strong>Country:</strong> {selectedMovie.country}</p>
          <p><strong>Release Year:</strong> {selectedMovie.releaseYear}</p>
          <p><strong>Rating:</strong> {selectedMovie.rating}</p>
          <p><strong>Duration:</strong> {selectedMovie.duration}</p>
          <p><strong>Description:</strong> {selectedMovie.description}</p>
          <p><strong>Genres:</strong> {getGenreNames(selectedMovie)}</p>
          <p><strong>Average Rating:</strong> {selectedMovie.averageRating}</p>
        </div>
      ) : (
        <p>Select a movie to view details.</p>
      )}
    </div>
    <Footer />
    </>
  );
};

export default MovieDetails;
