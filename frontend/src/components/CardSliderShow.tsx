import React, { useEffect, useState } from "react";
import "../styles/CardSlider.css";
import { Movie } from "../types/Movie";

interface CardSliderShowProps {
  showId: string; // Prop to receive showId
}

const CardSliderShow: React.FC<CardSliderShowProps> = ({ showId }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper function to generate a sanitized image URL from the movie title
  const getSanitizedImageUrl = (title: string): string => {
    const sanitizedTitle = title.trim().replace(/[!\-&$?';<:().]/g, "");
    const finalTitle = sanitizedTitle.replace(/ /g, "%20");
    return `/${finalTitle}.jpg`;
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://127.0.0.1:5001/api/recommendations/content/${showId}` // Use the showId prop
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response:", data); // Debug: Check the structure in the console

        // Ensure recommendations exist and are an array
        if (data.recommendations && Array.isArray(data.recommendations)) {
          setMovies(data.recommendations);
        } else {
          throw new Error(
            "Invalid response format: 'recommendations' missing or not an array"
          );
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      fetchRecommendations();
    } else {
      setError("No show ID provided");
      setLoading(false);
    }
  }, [showId]); // Depend on showId prop

  // Toggle flip state for a specific card
  const handleCardClick = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  // Function to truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderStarRating = (averageRating: string | number) => {
    // Parse averageRating to a float
    const rating =
      typeof averageRating === "string"
        ? parseFloat(averageRating)
        : averageRating;
    if (isNaN(rating)) return null; // Handle invalid ratings

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

  const nextSlide = () => {
    const visibleCards = 3; // You can make this dynamic based on viewport width
    if (
      movies.length > visibleCards &&
      currentIndex < movies.length - visibleCards
    ) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="card-slider loading">Loading recommendations...</div>
    );
  }

  if (error) {
    return <div className="card-slider error">Error: {error}</div>;
  }

  if (movies.length === 0) {
    return (
      <div className="card-slider no-results">
        No recommendations available.
      </div>
    );
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
            transform: `translateX(-${currentIndex * 300}px)`,
            width: `${movies.length * 300}px`,
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

export default CardSliderShow;
