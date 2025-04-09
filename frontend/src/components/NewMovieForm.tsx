import { useState, useEffect } from 'react';
import { Movie } from '../types/Movie';
import { addMovie, fetchAllMovies } from '../api/MoviesAPI';

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({
    showId: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: 0,
    rating: '',
    duration: '',
    description: '',
    averageRating: 0,
  });

  const [selectedGenre, setSelectedGenre] = useState<string>('');

  // List of available genres based on the Movie interface
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

  useEffect(() => {
    const generateNextShowId = async () => {
      try {
        const movies = await fetchAllMovies();
        const showIds = movies.map((m: Movie) => m.showId);
        const maxId = showIds.reduce((max: number, id: string) => {
          const match = id.match(/^s(\d+)$/);
          const num = match ? parseInt(match[1], 10) : 0;
          return Math.max(max, num);
        }, 0);

        const nextId = `s${maxId + 1}`;
        setFormData((prev) => ({ ...prev, showId: nextId }));

        // Calculate average rating from existing movies
        const totalRatings = movies.reduce((total, movie) => total + movie.averageRating, 0);
        const averageRating = movies.length > 0 ? totalRatings / movies.length : 0;
        setFormData((prev) => ({ ...prev, averageRating }));
      } catch (error) {
        console.error('Error generating showId:', error);
      }
    };

    generateNextShowId();
  }, []); // This runs once when the component mounts

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedGenre(selected);

    // Set the genre boolean to 1, and all other genres to 0
    const updatedGenres = genreOptions.reduce((acc, genre) => {
      acc[genre] = genre === selected ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    setFormData((prevData) => ({
      ...prevData,
      ...updatedGenres,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addMovie(formData);
      onSuccess();
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Show ID: {formData.showId}
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Type:
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="Movie"
            checked={formData.type === 'Movie'}
            onChange={handleChange}
          />
          Movie
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="TV Show"
            checked={formData.type === 'TV Show'}
            onChange={handleChange}
          />
          TV Show
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Title:
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Director:
        </label>
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Cast:
        </label>
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Country:
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Release Year:
        </label>
        <input
          type="number"
          name="releaseYear"
          value={formData.releaseYear}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Rating:
        </label>
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Duration:
        </label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Description:
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          Genre:
        </label>
        <select onChange={handleGenreChange} value={selectedGenre}>
          <option value="">Select Genre</option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button type="submit" className='btn btn-danger'>Add Movie</button>
        <button type="button" onClick={onCancel} className='btn btn-dark'>Cancel</button>
      </div>
    </form>
  );
};

export default NewMovieForm;
