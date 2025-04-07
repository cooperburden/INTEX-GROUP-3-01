import { useState } from "react";

type Props = {
  genres: string[];
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
};

function formatGenreLabel(genre: string) {
  let formatted = genre
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());

  return formatted;
}

function GenreFilter({ genres, selectedGenres, onGenreChange }: Props) {
  const handleToggle = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];

    onGenreChange(updated);
  };

  return (
    <div style={{ width: "260px", padding: "1rem", borderRight: "1px solid #ccc" }}>
      <h3>Filter by Genre</h3>
      {genres.map((genre) => (
        <div key={genre}>
          <label style={{ whiteSpace: "pre-wrap" }}>
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => handleToggle(genre)}
            />
            {formatGenreLabel(genre)}
          </label>
        </div>
      ))}
    </div>
  );
}

export default GenreFilter;
