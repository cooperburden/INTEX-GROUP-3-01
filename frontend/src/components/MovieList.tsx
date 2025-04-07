import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch('http://localhost:5009/api/MovieTitles')
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error('Error fetching movies:', err));
  }, []);

  return (
    <>
      <h1>Movies</h1>
      <br />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {movies.map((movie) => (
          <div
            key={movie.showId}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              width: '200px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
}

export default MovieList;