import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import Header from "./Header";
import "../styles/MovieList.css";
import VideoPlayer from "./VideoPlayer";
import CardSlider from "./cardslider";

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Temporarily set fake data
    const fakeMovies: Movie[] = [
      {
        movieId: 1,
        title: "The Matrix",
        category: "Action",
        year: 1999,
        director: "The Wachowskis",
        rating: "R",
        edited: false,
      },
      {
        movieId: 2,
        title: "Inception",
        category: "Sci-Fi",
        year: 2010,
        director: "Christopher Nolan",
        rating: "PG-13",
        edited: false,
      },
      {
        movieId: 3,
        title: "Interstellar",
        category: "Drama",
        year: 2014,
        director: "Christopher Nolan",
        rating: "PG-13",
        edited: false,
      },
    ];
    setMovies(fakeMovies);

    // Uncomment this to use the real API
    /*
    fetch("https://localhost:5000/api/MovieTitles")
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then((data) => {
        setMovies(data);
      });
    */
  }, []);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="header-wrapper">
        <Header />
      </div>

      {/* Video Player */}
      <div>
        <div className="video-wrapper">
          <VideoPlayer />
        </div>
        <div className="container">
          <CardSlider />
        </div>

        {/* This container should appear below the video */}
        {/* <div className="container">
        {movies.map((movie) => (
          <div className="card" key={movie.movieId}>
            <h3>{movie.title}</h3>
            <p>
              <strong>Director:</strong> {movie.director}
            </p>
            <p>
              <strong>Category:</strong> {movie.category}
            </p>
            <p>
              <strong>Year:</strong> {movie.year}
            </p>
            <p>
              <strong>Rating:</strong> {movie.rating}
            </p>
          </div>
        ))}
      </div> */}
      </div>
    </div>
  );
}

export default MovieList;
