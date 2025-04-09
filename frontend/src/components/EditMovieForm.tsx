import { useState, useEffect } from 'react';
import { Movie } from '../types/Movie';
import { updateMovie } from '../api/MoviesAPI';

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const genreOptions = [
    'action',
    'adventure',
    'animeSeriesInternationalTVShows',
    'britishTVShowsDocuseriesInternationalTVShows',
    'children',
    'comedies',
    'comediesDramasInternationalMovies',
    'comediesInternationalMovies',
    'comediesRomanticMovies',
    'crimeTVShowsDocuseries',
    'documentaries',
    'documentariesInternationalMovies',
    'docuseries',
    'dramas',
    'dramasInternationalMovies',
    'dramasRomanticMovies',
    'familyMovies',
    'fantasy',
    'horrorMovies',
    'internationalMoviesThrillers',
    'internationalTVShowsRomanticTVShowsTVDramas',
    'kidsTV',
    'languageTVShows',
    'musicals',
    'natureTV',
    'realityTV',
    'spirituality',
    'tvAction',
    'tvComedies',
    'tvDramas',
    'talkShowsTVComedies',
    'thrillers',
  ];

  const [formData, setFormData] = useState<Movie>({ ...movie });
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  useEffect(() => {
    const initialGenre = genreOptions.find((genre) => (movie as any)[genre] === 1) || '';
    setSelectedGenre(initialGenre);
    setFormData({ ...movie });
  }, [movie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGenre = e.target.value;
    setSelectedGenre(newGenre);

    const updatedGenreBooleans = genreOptions.reduce((acc, genre) => {
      acc[genre] = genre === newGenre ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    setFormData((prevData) => ({
      ...prevData,
      ...updatedGenreBooleans,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMovie(formData.showId, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Movie</h2>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Show ID:</label>
        <p>{formData.showId}</p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Type:</label>
        <label>
          <input
            type="radio"
            name="type"
            value="Movie"
            checked={formData.type === 'Movie'}
            onChange={handleTypeChange}
          />
          Movie
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="TV Show"
            checked={formData.type === 'TV Show'}
            onChange={handleTypeChange}
          />
          TV Show
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Director:</label>
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Cast:</label>
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Country:</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Release Year:</label>
        <input
          type="number"
          name="releaseYear"
          value={formData.releaseYear}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Rating:</label>
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Duration:</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Genre:</label>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Select Genre</option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button type="submit" className="btn btn-danger">
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className="btn btn-dark">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditMovieForm;
