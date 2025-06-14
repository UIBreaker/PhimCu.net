import { MESSAGES } from "./constants.js";

const historyMoviesGrid = document.getElementById("historyMovies");
const loadingSpinner = document.querySelector(".loading");

const renderHistory = (history, movies, userId) => {
  loadingSpinner.style.display = "none";
  if (!window.app.currentUser) {
    historyMoviesGrid.innerHTML = `<p>${MESSAGES.LOGIN_REQUIRED}</p>`;
    window.app.showLoginModal?.();
    return;
  }
  if (!history || history.length === 0) {
    historyMoviesGrid.innerHTML = `<p>${MESSAGES.NO_HISTORY}</p>`;
    return;
  }

  historyMoviesGrid.innerHTML = "";
  const historyMovies = history
    .slice(0, 10) // Limit to 10 entries
    .map((item) => ({
      ...(movies.find((movie) => movie.id === item.movieId) || {}),
      lastWatched: item.timestamp,
      episode: item.episode,
    }))
    .filter((movie) => movie.id); // Filter out invalid movies

  historyMovies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    movieCard.innerHTML = `
      <img src="${
        movie.poster || "../assets/images/placeholder.jpg"
      }" alt="Poster phim ${
      movie.title || "Không có tiêu đề"
    }" loading="lazy" />
      <h3>${movie.title || "Chưa có tiêu đề"}</h3>
      <p>Tập: ${movie.episode || "Chưa xem tập nào"}</p>
      <p>Lần cuối xem: ${new Date(movie.lastWatched).toLocaleString(
        "vi-VN"
      )}</p>
      <div class="movie-card-actions">
        <button class="continue-btn" data-id="${movie.id}" data-episode="${
      movie.episode || 1
    }">Xem tiếp</button>
        <button class="remove-history" data-id="${movie.id}">Xóa</button>
      </div>
    `;
    historyMoviesGrid.appendChild(movieCard);

    movieCard.querySelector(".continue-btn").addEventListener("click", () => {
      window.location.href = `watch-movie.html?id=${movie.id}&episode=${
        movie.episode || 1
      }`;
    });

    movieCard.querySelector(".remove-history").addEventListener("click", () => {
      let updatedHistory = history.filter((item) => item.movieId !== movie.id);
      localStorage.setItem(`history_${userId}`, JSON.stringify(updatedHistory));
      renderHistory(updatedHistory, movies, userId);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  loadingSpinner.style.display = "block";

  if (!window.app) {
    console.error("App not available!");
    loadingSpinner.style.display = "none";
    historyMoviesGrid.innerHTML = `<p>${MESSAGES.SYSTEM_ERROR}</p>`;
    return;
  }

  if (!window.app.currentUser) {
    loadingSpinner.style.display = "none";
    renderHistory([], [], null);
    return;
  }

  const userId = window.app.currentUser.id || window.app.currentUser.username;
  let history = [];
  let movies = [];
  try {
    history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];
    movies = JSON.parse(localStorage.getItem("movies")) || [];
    if (!Array.isArray(history) || !Array.isArray(movies)) {
      throw new Error("Invalid data format");
    }
  } catch (e) {
    console.error("Error parsing data from localStorage:", e);
    loadingSpinner.style.display = "none";
    historyMoviesGrid.innerHTML = `<p>${MESSAGES.SYSTEM_ERROR}</p>`;
    return;
  }

  renderHistory(history, movies, userId);
});
// In history.js
const clearHistoryBtn = document.createElement("button");
clearHistoryBtn.textContent = "Xóa toàn bộ lịch sử";
clearHistoryBtn.className = "clear-history-btn";
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử xem?")) {
    localStorage.removeItem(`history_${userId}`);
    renderHistory([], movies, userId);
  }
});
document.querySelector(".movies-section").prepend(clearHistoryBtn);
// In history.js
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = now - new Date(timestamp);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return new Date(timestamp).toLocaleString("vi-VN");
};
// In movieCard.innerHTML
<p>Lần cuối xem: ${getRelativeTime(movie.lastWatched)}</p>;
// In watch-movie.html or history.js
const showToast = (message) => {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
// Replace alert("Vui lòng đăng nhập...") with showToast("Vui lòng đăng nhập...");
