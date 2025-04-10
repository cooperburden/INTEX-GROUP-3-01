import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../types/Movie";
import { fetchAllMovies } from "../api/MoviesAPI";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CardSliderShow from "../components/CardSliderShow";
import "../styles/MovieDetails.css";

const MovieDetails = () => {
  const { showId } = useParams<{ showId: string }>();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSanitizedImageUrl = (title: string): string => {
    const sanitizedTitle = title.trim().replace(/[!\-&$?';<:().]/g, "");
    const finalTitle = sanitizedTitle.replace(/ /g, "%20");
    return `/${finalTitle}.jpg`;
  };

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const moviesData = await fetchAllMovies();
        const movie = moviesData.find((m) => m.showId === showId);
        if (!movie) {
          throw new Error("Movie not found");
        }
        setSelectedMovie(movie);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setSelectedMovie(null);
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      loadMovie();
    } else {
      setError("No movie ID provided");
      setLoading(false);
    }
  }, [showId]);

  const getGenreNames = (movie: Movie) => {
    if (movie.listedIn) {
      return movie.listedIn.split(", ").join(", ");
    }
    return "No genres listed";
  };

  return (
    <>
      <Header />
      <div className="movie-details-container">
        {loading ? (
          <p className="loading">Loading movie details...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : selectedMovie ? (
          <div className="movie-details-content">
            {/* Image on the left */}
            <div className="movie-details-image">
              <img
                src={getSanitizedImageUrl(selectedMovie.title)}
                alt={selectedMovie.title}
                onError={(e) =>
                  (e.currentTarget.src = "/Movie%20Posters/default-poster.jpg")
                }
              />
            </div>

            {/* Info on the right */}
            <div className="movie-details-info">
              <h1>{selectedMovie.title}</h1>
              {/* Faded grey container for rating | year | average rating */}
              <div className="key-info-container">
                <span>{selectedMovie.rating || "N/A"}</span>
                <span>|</span>
                <span>{selectedMovie.releaseYear || "N/A"}</span>
                <span>|</span>
                <span>{selectedMovie.averageRating || "N/A"}</span>
              </div>

              {/* Description below the key info */}
              <p className="description">
                {selectedMovie.description || "No description available"}
              </p>

              {/* Other information below the description */}
              <div className="other-info">
                <p>
                  <strong>Director:</strong> {selectedMovie.director || "N/A"}
                </p>
                <p>
                  <strong>Cast:</strong> {selectedMovie.cast || "N/A"}
                </p>
                <p>
                  <strong>Country:</strong> {selectedMovie.country || "N/A"}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedMovie.duration || "N/A"}
                </p>
                <p>
                  <strong>Genres:</strong> {getGenreNames(selectedMovie)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="not-found">Movie not found</p>
        )}
      </div>
      <div className="slide-container">
        <h2
          style={{
            textAlign: "left",
            fontFamily: "Poppins, sans-serif",
            paddingTop: "20px",
            paddingLeft: "20px",
          }}
        >
          More Like This
        </h2>
        <CardSliderShow showId={showId || ""} /> {/* Pass showId as a prop */}
      </div>
      <Footer />
    </>
  );
};

export default MovieDetails;
