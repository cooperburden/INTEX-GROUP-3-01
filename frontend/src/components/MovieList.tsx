import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import GenreFilter from "../components/GenreFilter";

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    fetch(
      "http://localhost:5009/api/MovieTitles?pageSize=5&pageNum=1&sortOrder=asc"
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies);

        if (data.movies.length > 0) {
          const firstMovie = data.movies[0];
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

  return (
    <div style={{ display: "flex" }}>
      <GenreFilter genres={genres} />

      <div style={{ flexGrow: 1, padding: "1rem 2rem", marginLeft: "4rem" }}>
        <h1>Movies</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {movies.map((movie) => (
            <div
              key={movie.showId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                width: "200px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;