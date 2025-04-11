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
  const [userRating, setUserRating] = useState<number>(0); // Cosmetic user rating

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
    const genreMap: { [key: string]: string } = {
      action: "Action",
      adventure: "Adventure",
      animeSeriesInternationalTVShows: "Anime Series",
      britishTVShowsDocuseriesInternationalTVShows: "British TV Shows",
      children: "Children",
      comedies: "Comedies",
      comediesDramasInternationalMovies: "Comedy Dramas",
      comediesInternationalMovies: "International Comedies",
      comediesRomanticMovies: "Romantic Comedies",
      crimeTVShowsDocuseries: "Crime Docuseries",
      documentaries: "Documentaries",
      documentariesInternationalMovies: "International Documentaries",
      docuseries: "Docuseries",
      dramas: "Dramas",
      dramasInternationalMovies: "International Dramas",
      dramasRomanticMovies: "Romantic Dramas",
      familyMovies: "Family Movies",
      fantasy: "Fantasy",
      horrorMovies: "Horror",
      internationalMoviesThrillers: "International Thrillers",
      internationalTVShowsRomanticTVShowsTVDramas: "International TV Dramas",
      kidsTV: "Kids TV",
      languageTVShows: "Language TV Shows",
      musicals: "Musicals",
      natureTV: "Nature TV",
      realityTV: "Reality TV",
      spirituality: "Spirituality",
      tvAction: "TV Action",
      tvComedies: "TV Comedies",
      tvDramas: "TV Dramas",
      talkShowsTVComedies: "Talk Shows",
      thrillers: "Thrillers",
    };

    const genres = Object.keys(genreMap)
      .filter((key) => movie[key as keyof Movie] === 1)
      .map((key) => genreMap[key]);

    return genres.length > 0 ? genres.join(", ") : "No genres listed";
  };

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="star-rating">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} className="star full">
              ⭐
            </span>
          ))}
        {hasHalfStar && <span className="star half">✯</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={`empty-${i}`} className="star empty">
              ☆
            </span>
          ))}
      </span>
    );
  };

  const handleUserRating = (rating: number) => {
    // Toggle: if clicking the same rating, reset to 0; otherwise, set to new rating
    setUserRating(userRating === rating ? 0 : rating);
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
            <div className="movie-details-image">
              <img
                src={getSanitizedImageUrl(selectedMovie.title)}
                alt={selectedMovie.title}
                onError={(e) =>
                  (e.currentTarget.src = "/Movie%20Posters/default-poster.jpg")
                }
              />
            </div>
            <div className="movie-details-info">
              <h1>{selectedMovie.title}</h1>
              <div className="key-info-container">
                <span>{selectedMovie.rating || "N/A"}</span>
                <span>|</span>
                <span>{selectedMovie.releaseYear || "N/A"}</span>
                <span>|</span>
                <span>
                  {selectedMovie.averageRating !== undefined &&
                  selectedMovie.averageRating !== null
                    ? renderStarRating(selectedMovie.averageRating)
                    : "N/A"}
                </span>
              </div>
              <p className="description">
                {selectedMovie.description || "No description available"}
              </p>
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
                <p>
                  <strong>Rate this movie:</strong>
                </p>
                <div className="user-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= userRating ? "full" : "empty"}`}
                      onClick={() => handleUserRating(star)}
                      style={{ cursor: "pointer" }}
                    >
                      {star <= userRating ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
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
        <CardSliderShow showId={showId || ""} />
      </div>
      <Footer />
    </>
  );
};

export default MovieDetails;
