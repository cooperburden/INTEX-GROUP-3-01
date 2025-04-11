import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CardSlider.css";
import { Movie } from "../types/Movie";

interface CardSliderShowProps {
  showId: string;
}

const CardSliderShow: React.FC<CardSliderShowProps> = ({ showId }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  const visibleCards = 3;
  const cardWidth = 300;
  const repeatFactor = 5;

  const getSanitizedImageUrl = (title: string): string => {
    const sanitizedTitle = title.trim().replace(/[!\-&$?';<:().]/g, "");
    const finalTitle = sanitizedTitle.replace(/ /g, "%20");
    return `/${finalTitle}.jpg`;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.currentTarget;
    if (img.src !== "/defaultposter.jpg") {
      // Match filename
      console.log(`Failed to load image: ${img.src}, switching to default`);
      img.src = "/defaultposter.jpg";
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://127.0.0.1:5001/api/recommendations/content/${showId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Full API response:", data);

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
  }, [showId]);

  const handleCardClick = (index: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    setFlippedCard(
      flippedCard === index % movies.length ? null : index % movies.length
    );
  };

  const handleSeeMoreClick = (movieId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Navigating to:", `/movieDetails/${movieId}`);
    navigate(`/movieDetails/${movieId}`);
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderStarRating = (averageRating: string | number) => {
    const rating =
      typeof averageRating === "string"
        ? parseFloat(averageRating)
        : averageRating;
    if (isNaN(rating)) return null;

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
    if (!carouselRef.current || movies.length === 0) return;

    const totalCards = movies.length * repeatFactor;
    const newIndex = currentIndex + 1;

    if (newIndex >= totalCards) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentIndex(0);
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition =
                "transform 0.5s ease-in-out";
            }
          }, 0);
        }
      }, 500);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  const prevSlide = () => {
    if (!carouselRef.current || movies.length === 0) return;

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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

  const repeatedMovies = Array(repeatFactor)
    .fill(null)
    .flatMap(() => movies);

  return (
    <div className="card-slider">
      <button onClick={prevSlide} className="carousel-button prev">
        ❮
      </button>
      <div className="carousel-container">
        <div
          ref={carouselRef}
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * cardWidth}px)`,
            width: `${repeatedMovies.length * cardWidth}px`,
          }}
        >
          {repeatedMovies.map((movie, index) => (
            <div
              key={`${movie.movieId}-${index}`}
              className={`flip-card-container ${flippedCard === index % movies.length ? "flipped" : ""}`}
              onClick={(e) => handleCardClick(index % movies.length, e)}
            >
              <div className="flip-card">
                <div className="card-front">
                  <figure>
                    <div className="img-bg"></div>
                    <img
                      src={getSanitizedImageUrl(movie.title)}
                      alt={movie.title}
                      onError={handleImageError} // Use the new handler
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
                      {movie.duration || "N/A"} | {movie.rating || "N/A"} |{" "}
                      {movie.year || "N/A"}
                    </li>
                  </ul>
                  <p className="card-description">
                    {truncateDescription(
                      movie.description || "No description",
                      200
                    )}
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleSeeMoreClick(movie.movieId, e)}
                    style={{
                      marginTop: "auto",
                      fontSize: "0.8rem",
                      padding: "5px 10px",
                    }}
                  >
                    See More
                  </button>
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
