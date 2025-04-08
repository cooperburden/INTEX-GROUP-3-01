import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import Header from "./Header";
import "../styles/MovieList.css";
import VideoPlayer from "./VideoPlayer";

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

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

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        // height: "100vh",
        overflowY: "auto", // Vertical scroll for page
        overflowX: "hidden",
      }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
        <Header /> {/* Sticky header */}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "5rem 1rem",
          backgroundColor: "#white",
        }}
      >
        <VideoPlayer /> {/* Video below header */}
      </div>
      <div>
        <main
          style={{
            display: "flex",
            position: "relative",
            zIndex: 0,
            gap: "1rem",
            overflowX: "auto",
            padding: "45rem",
            scrollSnapType: "x mandatory",
          }}
        >
          {filteredMovies.map((movie) => {
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
                  backgroundColor: "black",
                  color: "white",
                  scrollSnapAlign: "start",
                  overflowX: "auto",
                }}
              >
                <h3 style={{ fontWeight: "600" }}>{movie.title}</h3>

                {/* ⭐ Star display */}
                <div style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                  {Array.from({ length: fullStars }).map((_, i) => (
                    <span key={`full-${i}`}>⭐</span>
                  ))}
                  {hasHalfStar && <span key="half">⭐½</span>}
                  {Array.from({ length: emptyStars }).map((_, i) => (
                    <span key={`empty-${i}`}>☆</span>
                  ))}
                </div>

                {/* <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
                  Average Rating: {movie.averageRating.toFixed(1)}
                </p> */}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}

export default MovieList;
