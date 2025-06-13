// frontend/assets/js/movie.js
const fetchMovies = async () => {
  const response = await fetch("http://localhost:5000/api/movies");
  const movies = await response.json();
  localStorage.setItem("movies", JSON.stringify(movies));
};

const displayMovies = () => {
  const movies = JSON.parse(localStorage.getItem("movies")) || [];
  const movieList = document.getElementById("movie-list");
  movieList.innerHTML = movies
    .map(
      (movie) => `
    <div class="movie-card">
      <h3>${movie.title}</h3>
      <a href="${movie.url}">Watch</a>
    </div>
  `
    )
    .join("");
};
router.get("/fetch-tmdb", fetchMoviesFromTMDb);
