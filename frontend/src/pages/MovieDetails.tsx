import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/Movie';
import { fetchAllMovies } from '../api/MoviesAPI';
import Footer from '../components/Footer';
import Header from '../components/Header';

const MovieDetails = () => {
  const { showId } = useParams<{ showId: string }>();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const moviesData = await fetchAllMovies();
        const movie = moviesData.find((m) => m.showId === showId);
        setSelectedMovie(movie || null);
      } catch (error) {
        console.error('Error loading movie:', error);
      }
    };

    loadMovie();
  }, [showId]);

  const getGenreNames = (movie: Movie) => {
    const genres = [];
    if (movie.action) genres.push('Action');
    if (movie.adventure) genres.push('Adventure');
    if (movie.comedies) genres.push('Comedy');
    if (movie.dramas) genres.push('Drama');
    if (movie.horrorMovies) genres.push('Horror');
    // Add more genre checks as needed
    return genres.length > 0 ? genres.join(', ') : 'No genres listed';
  };

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '20px', marginTop: '80px' }}>
        <h1 style={{ paddingTop: '20px' }}>Movie Details</h1>

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
          <p>Loading movie details...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MovieDetails;
