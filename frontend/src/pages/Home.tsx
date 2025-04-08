import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import HomeHeader from "../components/HomeHeader";
import "../styles/MovieList.css";
import HomeVideoPlayer from "../components/HomeVideoPlayer";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://localhost:5000/api/MovieTitles")
      .then((res) => res.json())
      .then((data) => {
        console.log("Sample average ratings:", data.slice(0, 5).map(m => ({
          title: m.title,
          rating: m.averageRating
        })));
        setMovies(data);
        if (data.length > 0) {
          const firstMovie = data[0];
          const genreKeys = Object.keys(firstMovie).filter(
            (key) =>
              typeof firstMovie[key] === "number" &&
              (firstMovie[key] === 0 || firstMovie[key] === 1)
          );
          setGenres(genreKeys);
        }
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  const handleGenreChange = (genres: string[]) => {
    setSelectedGenres(genres);
  };

  const filteredMovies =
    selectedGenres.length === 0
      ? movies
      : movies.filter((movie) =>
          selectedGenres.every((genre) => movie[genre as keyof Movie] === 1)
        );

  const topRatedMovies = [...movies]
    .filter((movie) => movie.averageRating > 0) // Skip unrated
    .sort((a, b) => b.averageRating - a.averageRating) // Highest to lowest
    .slice(0, 15); // Take top 15

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh", // Ensure the page takes full height
        overflowY: "auto", // Allow vertical scrolling
        backgroundColor: "#141414", // Netflix-like dark background
        color: "white", // Default text color
        position: "relative", // For absolute positioning of cards
      }}
    >
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
        <HomeHeader />
      </div>

      {/* Lights Camera Stream (Video Player) Section */}
      <div
        style={{
          padding: "2rem 1rem",
          backgroundColor: "transparent", // No background to avoid overlap
          zIndex: 1, // Lower zIndex than cards
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Lights. Camera. Stream.
        </h1>
        <HomeVideoPlayer />
      </div>

      {/* Create Account Button Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
          backgroundColor: "transparent", // No background to avoid overlap
          zIndex: 1, // Lower zIndex than cards
        }}
      >
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "white",
            backgroundColor: "#e50914", // Netflix red
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f40612")} // Hover effect
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e50914")} // Reset on leave
        >
          Create Account
        </button>
      </div>

      {/* Popular Movies Section - Positioned on Top */}
      <div
        style={{
            marginTop: "35rem", // give it breathing room
            padding: "2rem 0",
            backgroundColor: "transparent",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginLeft: "2rem",
            marginBottom: "1rem",
          }}
        >
          What's Popular Today
        </h2>

        <main
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            padding: "0 2rem",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "white #141414", // For Firefox
          }}
        >
          {topRatedMovies.map((movie, index) => {
            const fullStars = Math.floor(movie.averageRating);
            const hasHalfStar = movie.averageRating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return (
              <div
                key={movie.showId}
                style={{
                  flex: "0 0 auto",
                  width: "200px",
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  backgroundColor: "#1c1c1c", // Slightly lighter than the background
                  color: "white",
                  scrollSnapAlign: "start",
                  transition: "transform 0.3s", // Add hover effect
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Hover effect
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")} // Reset on leave
              >
                <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                  #{index + 1} {movie.title}
                </h3>
                <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                  {Array.from({ length: fullStars }).map((_, i) => (
                    <span key={`full-${i}`}>⭐</span>
                  ))}
                  {hasHalfStar && <span key="half">⭐½</span>}
                  {Array.from({ length: emptyStars }).map((_, i) => (
                    <span key={`empty-${i}`}>☆</span>
                  ))}
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}

export default Home;