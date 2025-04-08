import { useState, useEffect } from 'react';
import { Movie } from '../types/Movie';
import { updateMovie } from '../api/MoviesAPI';

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  // List of genre keys that match the boolean properties on Movie.
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

  // Separate state for form data and for the genre selected via the dropdown.
  const [formData, setFormData] = useState<Movie>({ ...movie });
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  // On mount (or when movie changes), initialize selectedGenre based on which genre boolean equals 1.
  useEffect(() => {
    const initialGenre =
      genreOptions.find((genre) => (movie as any)[genre] === 1) || '';
    setSelectedGenre(initialGenre);
    setFormData({ ...movie });
  }, [movie]);

  // Update standard fields.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle type (Movie/TV Show) changes.
  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, type: e.target.value });
  };

  // When a user selects a genre, update both the separate selectedGenre state and
  // update the genre booleans in formData.
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

  // Submit the form data.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMovie(formData.showId, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Movie</h2>

      {/* Show ID (read-only) */}
      <div>
        <label>Show ID:</label>
        <p>{formData.showId}</p>
      </div>

      {/* Type: Radio Buttons */}
      <div>
        <label>Type:</label>
        <div>
          <input
            type="radio"
            id="movie"
            name="type"
            value="Movie"
            checked={formData.type === 'Movie'}
            onChange={handleTypeChange}
          />
          <label htmlFor="movie">Movie</label>
          <input
            type="radio"
            id="tvShow"
            name="type"
            value="TV Show"
            checked={formData.type === 'TV Show'}
            onChange={handleTypeChange}
          />
          <label htmlFor="tvShow">TV Show</label>
        </div>
      </div>

      {/* Other fields */}
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Director:</label>
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Cast:</label>
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Release Year:</label>
        <input
          type="number"
          name="releaseYear"
          value={formData.releaseYear}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Rating:</label>
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Duration:</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Genre Dropdown */}
      <div>
        <label>Genre:</label>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Select Genre</option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Buttons */}
      <div>
        <button type="submit">Update Movie</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditMovieForm;
