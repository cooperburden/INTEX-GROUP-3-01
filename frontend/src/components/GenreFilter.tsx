type Props = {
    genres: string[];
  };
  
  function formatGenreLabel(genre: string) {
    return genre
      .replace(/([a-z])([A-Z])/g, "$1 $2") // space before capital, only when lowercase before it
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // fix ALLCAPS words splitting
      .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
  }
  
  
  function GenreFilter({ genres }: Props) {
    return (
      <div style={{ width: "200px", padding: "1rem", borderRight: "1px solid #ccc" }}>
        <h3>Filter by Genre</h3>
        {genres.map((genre) => (
          <div key={genre}>
            <label>
              <input type="checkbox" />
              {formatGenreLabel(genre)}
            </label>
          </div>
        ))}
      </div>
    );
  }
  
  export default GenreFilter;
  