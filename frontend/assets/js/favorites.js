import { MESSAGES } from "./constants.js";

const favoritesMoviesGrid = document.getElementById("favoritesMovies");
const loadingSpinner = document.querySelector(".loading");

const renderFavorites = (favorites, movies, userId) => {
  loadingSpinner.style.display = "none";
  if (!window.app.currentUser) {
    favoritesMoviesGrid.innerHTML = `<p>${MESSAGES.LOGIN_REQUIRED}</p>`;
    window.app.showLoginModal?.();
    return;
  }
  if (!favorites || favorites.length === 0) {
    favoritesMoviesGrid.innerHTML = `<p>${MESSAGES.NO_FAVORITES}</p>`;
    return;
  }

  favoritesMoviesGrid.innerHTML = "";
  const favoriteMovies = movies.filter((movie) => favorites.includes(movie.id));
  favoriteMovies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    movieCard.innerHTML = `
      <img src="${
        movie.poster || "../assets/images/placeholder.jpg"
      }" alt="Poster phim ${
      movie.title || "Không có tiêu đề"
    }" loading="lazy" />
      <h3>${movie.title || "Chưa có tiêu đề"}</h3>
      <p>Lượt xem: ${movie.views || 0}</p>
      <div class="movie-card-actions">
        <button class="watch-btn" data-id="${movie.id}">Xem phim</button>
        <button class="remove-favorite" data-id="${movie.id}">Xóa</button>
      </div>
    `;
    favoritesMoviesGrid.appendChild(movieCard);

    movieCard.querySelector(".watch-btn").addEventListener("click", () => {
      window.location.href = `movie-detail.html?id=${movie.id}`;
    });

    movieCard
      .querySelector(".remove-favorite")
      .addEventListener("click", () => {
        let updatedFavorites = favorites.filter((id) => id !== movie.id);
        localStorage.setItem(
          `favorites_${userId}`,
          JSON.stringify(updatedFavorites)
        );
        renderFavorites(updatedFavorites, movies, userId);
        alert("Đã xóa phim khỏi danh sách yêu thích!");
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  loadingSpinner.style.display = "block";

  if (!window.app) {
    console.error("App not available!");
    loadingSpinner.style.display = "none";
    favoritesMoviesGrid.innerHTML = `<p>${MESSAGES.SYSTEM_ERROR}</p>`;
    return;
  }

  if (!window.app.currentUser) {
    loadingSpinner.style.display = "none";
    renderFavorites([], [], null);
    return;
  }

  const userId = window.app.currentUser.id || window.app.currentUser.username;
  let favorites = [];
  let movies = [];
  try {
    favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
    movies = JSON.parse(localStorage.getItem("movies")) || [];
    if (!Array.isArray(favorites) || !Array.isArray(movies)) {
      throw new Error("Invalid data format");
    }
  } catch (e) {
    console.error("Error parsing data from localStorage:", e);
    loadingSpinner.style.display = "none";
    favoritesMoviesGrid.innerHTML = `<p>${MESSAGES.SYSTEM_ERROR}</p>`;
    return;
  }

  renderFavorites(favorites, movies, userId);
});
