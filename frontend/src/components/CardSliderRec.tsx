import React, { useEffect, useState, useRef } from "react";
import "../styles/CardSlider.css";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";

interface CardSliderRecProps {
  recType: "top_all" | "top_genre" | "second_genre";
}

const CardSliderRec: React.FC<CardSliderRecProps> = ({ recType }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [genreName, setGenreName] = useState<string>("");
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  const visibleCards = 3;
  const cardWidth = 300;
  const repeatFactor = 5; // Repeat the list 5 times

  const getSanitizedImageUrl = (title: string): string => {
    const sanitizedTitle = title.trim().replace(/[!\-&$?';<:().]/g, "");
    const finalTitle = sanitizedTitle.replace(/ /g, "%20");
    return `/${finalTitle}.jpg`;
  };

  // Fetch userId
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("https://localhost:5000/api/Users/me", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        const data = await response.json();
        console.log("User ID fetched:", data.userId);
        setUserId(data.userId);
      } catch (err: unknown) {
        console.error("Fetch userId error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setUserId(null);
      }
    };

    fetchUserId();
  }, []);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (userId === null) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://127.0.0.1:5001/api/recommendations/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response:", data);

        const recFieldMap = {
          top_all: "top_all",
          top_genre: "top_genre",
          second_genre: "second_genre",
        };
        const recommendations =
          data.recommendations[recFieldMap[recType]] || [];
        setMovies(recommendations);

        if (recType === "top_genre") {
          setGenreName(data.recommendations.top_genre_name || "Unknown Genre");
        } else if (recType === "second_genre") {
          setGenreName(
            data.recommendations.second_genre_name || "Unknown Genre"
          );
        }
      } catch (err: unknown) {
        console.error("Fetch recommendations error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId !== null) {
      fetchRecommendations();
    }
  }, [userId, recType]);

  const handleCardClick = (index: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    setFlippedCard(
      flippedCard === index % movies.length ? null : index % movies.length
    );
  };

  const handleSeeMoreClick = (showId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Navigating to:", `/movieDetails/${showId}`);
    navigate(`/movieDetails/${showId}`);
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
      // Reset to start after 5 repeats
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
    // No wrapping to the end when at index 0
  };

  const getSliderTitle = () => {
    switch (recType) {
      case "top_all":
        return <h1>Top Picks for You</h1>;
      case "top_genre":
        return <h1>Must-Watch {genreName}</h1>;
      case "second_genre":
        return <h1>Best of {genreName}</h1>;
      default:
        return <h1>Recommendations</h1>;
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

  // Repeat the movie list 5 times
  const repeatedMovies = Array(repeatFactor)
    .fill(null)
    .flatMap(() => movies);

  return (
    <div className="card-slider">
      {getSliderTitle()}
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

export default CardSliderRec;
