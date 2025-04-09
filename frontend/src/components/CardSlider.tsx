import React, { useEffect, useState } from "react";
import "../styles/CardSlider.css"; // Import the CSS
import { Movie } from "../types/Movie";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // Default styles

const CardSlider = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper function to generate a sanitized image URL from the movie title.
  const getSanitizedImageUrl = (title: string): string => {
    const sanitizedTitle = title.trim().replace(/[!\-&$?';<:().]/g, "");
    const finalTitle = sanitizedTitle.replace(/ /g, "%20");
    return `/${finalTitle}.jpg`;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("https://localhost:5000/api/MovieTitles");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Movie[] = await response.json();
        // Limit the movies array to only the first three items.
        setMovies(data.slice(0, 9));
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  // Toggle flip state for a specific card
  const handleCardClick = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  // Function to truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderStarRating = (averageRating: number) => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <span className="star-rating">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="star full">
            ⭐
          </span>
        ))}
        {hasHalfStar && (
          <span key="half" className="star half">
            ✯
          </span>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="star empty">
            ☆
          </span>
        ))}
      </span>
    );
  };
  const nextSlide = () => {
    if (currentIndex < movies.length - 3) {
      // Stop when last 3 are visible
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      // Stop at the start
      setCurrentIndex((prev) => prev - 1);
    }
  };
  if (loading) {
    return <div className="card-slider">Loading...</div>;
  }

  if (error) {
    return <div className="card-slider">Error: {error}</div>;
  }

  return (
    <div className="card-slider">
      <button onClick={prevSlide} className="carousel-button prev">
        ❮
      </button>
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 300}px)`, // Slide by card width (350px)
            width: `${movies.length * 300}px`, // Total width of all cards
          }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.movieId}
              className={`flip-card-container ${flippedCard === index ? "flipped" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="flip-card">
                <div className="card-front">
                  <figure>
                    <div className="img-bg"></div>
                    <img
                      src={getSanitizedImageUrl(movie.title)}
                      alt={movie.title}
                      onError={(e) =>
                        (e.currentTarget.src =
                          "/Movie%20Posters/default-poster.jpg")
                      }
                    />
                    <figcaption>
                      {renderStarRating(movie.averageRating)}
                    </figcaption>
                  </figure>
                </div>
                <div className="card-back">
                  <h3 className="card-title">{movie.title}</h3>
                  <ul className="card-details">
                    <li>
                      {movie.duration} | {movie.rating} | {movie.year}
                    </li>
                  </ul>
                  <p className="card-description">
                    {truncateDescription(movie.description, 200)}
                  </p>
                  <button className="play-button" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={nextSlide} className="carousel-button next">
        ❯
      </button>
    </div>
  );
};

export default CardSlider;
