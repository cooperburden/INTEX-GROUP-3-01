import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import HomeHeader from "../components/HomeHeader";
import "../styles/MovieList.css";
import HomeVideoPlayer from "../components/HomeVideoPlayer";
import { useNavigate } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:5000/api/MovieTitles")
      .then((res) => res.json())
      .then((data) => {
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
    .filter((movie) => movie.averageRating > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 15);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "#141414",
        color: "white",
        position: "relative",
      }}
    >
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
        <HomeHeader />
      </div>

      {/* Video Section */}
      <div
        style={{
          padding: "2rem 1rem",
          backgroundColor: "transparent",
          zIndex: 1,
        }}
      >
        <HomeVideoPlayer />
      </div> <br /><br /><br /><br /><br />
      <br /><br /><br /> <br />

      {/* Popular Movies Section */}
      <div
        style={{
          marginTop: "35rem",
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
            scrollbarWidth: "thin",
            scrollbarColor: "white #141414",
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
                  backgroundColor: "#1c1c1c",
                  color: "white",
                  scrollSnapAlign: "start",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
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
