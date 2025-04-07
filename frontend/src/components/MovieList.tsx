import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import GenreFilter from "../components/GenreFilter";

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    <div style={{ display: "flex" }}>
      <GenreFilter
        genres={genres}
        selectedGenres={selectedGenres}
        onGenreChange={handleGenreChange}
      />

      <div style={{ flexGrow: 1, padding: "1rem 2rem", marginLeft: "4rem" }}>
        <h1>Movies</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {filteredMovies.map((movie) => (
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
              <p>Average Rating: ⭐ {movie.averageRating.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
