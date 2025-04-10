import React, { useEffect, useState } from "react";
import "../styles/CardSlider.css";
import { Movie } from "../types/Movie";

interface CardSliderRecProps {
  recType: "top_all" | "top_genre" | "second_genre"; // To specify which recommendation type to display
}

const CardSliderRec: React.FC<CardSliderRecProps> = ({ recType }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [genreName, setGenreName] = useState<string>(""); // To store the genre name for top_genre or second_genre

  const getSanitizedImageUrl = (title: string): string => {
    const sanitizedTitle = title.trim().replace(/[!\-&$?';<:().]/g, "");
    const finalTitle = sanitizedTitle.replace(/ /g, "%20");
    return `/${finalTitle}.jpg`;
  };

  // Step 1: Fetch the userId from /api/Users/me
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
        setUserId(data.userId);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setUserId(null);
      }
    };

    fetchUserId();
  }, []);

  // Step 2: Fetch recommendations once userId is available
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (userId === null) return; // Wait until userId is fetched

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
        console.log("API response:", data); // Debug: Check the structure in the console

        // Map the recType to the correct field in the API response
        const recFieldMap = {
          top_all: "top_all",
          top_genre: "top_genre",
          second_genre: "second_genre",
        };
        const recommendations =
          data.recommendations[recFieldMap[recType]] || [];
        setMovies(recommendations);

        // Set the genre name based on recType
        if (recType === "top_genre") {
          setGenreName(data.recommendations.top_genre_name || "Unknown Genre");
        } else if (recType === "second_genre") {
          setGenreName(
            data.recommendations.second_genre_name || "Unknown Genre"
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

    if (userId !== null) {
      fetchRecommendations();
    }
  }, [userId, recType]);

  const handleCardClick = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index);
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
    const visibleCards = 3;
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

  // Step 3: Determine the title based on recType
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

  return (
    <div className="card-slider">
      {getSliderTitle()} {/* Dynamically render the title */}
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

export default CardSliderRec;
