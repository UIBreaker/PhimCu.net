import { API_BASE_URL } from "./config.js";
import { login, register } from "./auth.js";

class MovieApp {
  constructor() {
    this.currentUser = null;
    this.movies = JSON.parse(localStorage.getItem("movies")) || [];
    this.trendingMovies = [];
    this.weeklyMovies = {};
    this.currentPage = 1;
    this.moviesPerPage = 20;
    this.currentTrendingIndex = 0;
    this._previousUser = null;
    this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    this.history = JSON.parse(localStorage.getItem("history")) || [];

    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.checkUserAuth();
    this.loadTrendingMovies();
    this.loadWeeklyMovies();
    this.loadLatestMovies();
  }

  loadData() {
    let users = JSON.parse(localStorage.getItem("users")) || [
      {
        username: "admin",
        password: "admin123",
        email: "admin@nhatnam.com",
        role: "admin",
      },
      {
        username: "user",
        password: "user123",
        email: "user@haohinh3d.com",
        role: "user",
      },
    ];
    localStorage.setItem("users", JSON.stringify(users));
    this.fetchMovies();
  }

  async fetchMovies() {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`);
      const movies = await response.json();
      this.movies = movies.map((movie) => ({
        ...movie,
        releaseDate: movie.releaseDate || "2025-06-01",
        status: movie.status || "completed",
        duration: movie.duration || "??",
        altTitle: movie.altTitle || "??",
        trailer: movie.trailer || "",
        tags: movie.tags || [],
        format: movie.format || "??",
        subtitles: movie.subtitles || "??",
        type: movie.type || "??",
        hot: movie.hot || false,
        images: movie.images || "??",
        episodes: movie.episodes || 0,
        episodeLinks: movie.episodeLinks || {},
      }));
      localStorage.setItem("movies", JSON.stringify(this.movies));
      this.trendingMovies = this.movies.slice(0, 8);
      this.setupWeeklyMovies();
      this.loadTrendingMovies();
      this.loadWeeklyMovies("monday");
      this.loadLatestMovies();
    } catch (err) {
      console.error("Error fetching movies:", err);
      this.movies = JSON.parse(localStorage.getItem("movies")) || [
        {
          id: 1,
          title: "Tiên Nghịch",
          poster:
            "https://static.hh3d.link/wp-content/uploads/2023/09/tien-nghich-3.jpg?format=auto&quality=90",
          category: "Tiên Hiệp",
          releaseDate: "2025-06-01",
          status: "completed",
          duration: "??",
          altTitle: "??",
          trailer: "",
          tags: [],
          format: "??",
          subtitles: "??",
          type: "??",
          hot: false,
          images: "??",
          episodes: 0,
          episodeLinks: {},
        },
      ];
      localStorage.setItem("movies", JSON.stringify(this.movies));
      this.trendingMovies = this.movies.slice(0, 8);
      this.setupWeeklyMovies();
      this.loadTrendingMovies();
      this.loadWeeklyMovies("monday");
      this.loadLatestMovies();
    }
  }

  async fetchMoviesFromOphim(page = 1) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movies/fetch-ophim?page=${page}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched from Ophim - Raw Response:", data);
      this.movies = this.movies.concat(
        data.map((movie) => ({
          id: this.movies.length + movie.id,
          title: movie.name || movie.title || "??",
          poster: movie.poster_url || "??",
          category: movie.category || "??",
          releaseDate: movie.release_date || "2025-06-01",
          status: movie.status || "completed",
          duration: movie.duration || "??",
          altTitle: movie.original_name || "??",
          trailer: movie.trailer_url || "",
          tags: movie.tags || [],
          format: movie.format || "??",
          subtitles: movie.subtitles || "??",
          type: movie.type || "??",
          hot: movie.is_hot || false,
          images: movie.images || "??",
          episodes: 0,
          episodeLinks: {},
        }))
      );
      localStorage.setItem("movies", JSON.stringify(this.movies));
      this.loadTrendingMovies();
    } catch (err) {
      console.error("Error fetching from Ophim:", err);
    }
  }

  async fetchTmdb() {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/fetch-tmdb`);
      const data = await response.json();
      this.movies = this.movies.concat(
        data.results.map((movie) => ({
          id: this.movies.length + movie.id,
          title: movie.title || "??",
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}` || "??",
          category:
            movie.genre_ids.map((id) => this.getGenreName(id)).join(", ") ||
            "??",
          releaseDate: movie.release_date || "2025-06-01",
          status: "completed",
          duration: "??",
          altTitle: movie.original_title || "??",
          trailer: "",
          tags: [],
          format: "??",
          subtitles: "??",
          type: "??",
          hot: false,
          images: "??",
          episodes: 0,
          episodeLinks: {},
        }))
      );
      localStorage.setItem("movies", JSON.stringify(this.movies));
      this.loadTrendingMovies();
    } catch (err) {
      console.error("Error fetching from TMDB:", err);
    }
  }

  getGenreName(genreId) {
    const genres = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genres[genreId] || "Unknown";
  }

  getRandomColor() {
    const colors = [
      "ff6b6b",
      "4ecdc4",
      "45b7d1",
      "f39c12",
      "e74c3c",
      "9b59b6",
      "2ecc71",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomCategory() {
    const categories = ["tu-tien", "huyen-huyen", "kiem-hiep", "co-trang"];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  setupWeeklyMovies() {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    days.forEach((day) => {
      this.weeklyMovies[day] = this.movies.filter(
        (movie) =>
          new Date(movie.releaseDate)
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase() === day
      );
    });
  }

  setupEventListeners() {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    searchBtn?.addEventListener("click", () => this.handleSearch());
    searchInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-favorites")) {
        e.preventDefault();
        const movieId = parseInt(e.target.dataset.movieId);
        this.addToFavorites(movieId);
      }
      if (e.target.classList.contains("add-to-history")) {
        e.preventDefault();
        const movieId = parseInt(e.target.dataset.movieId);
        this.addToHistory(movieId);
      }
    });

    document
      .getElementById("historyBtn")
      ?.addEventListener("click", () => this.showHistory());
    document
      .getElementById("favoriteBtn")
      ?.addEventListener("click", () => this.showFavorites());

    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.loadWeeklyMovies(e.target.dataset.day);
      });
    });

    document
      .getElementById("trendingPrev")
      ?.addEventListener("click", () => this.prevTrending());
    document
      .getElementById("trendingNext")
      ?.addEventListener("click", () => this.nextTrending());

    document
      .getElementById("loadMoreBtn")
      ?.addEventListener("click", () => this.loadMoreMovies());

    // const fetchOphimBtn = document.createElement("button");
    // fetchOphimBtn.textContent = "Lấy phim từ Ophim";
    // fetchOphimBtn.id = "fetchOphimBtn";
    // document.body.prepend(fetchOphimBtn);
    // fetchOphimBtn.addEventListener("click", () => this.fetchMoviesFromOphim(1));

    // const fetchTmdbBtn = document.createElement("button");
    // fetchTmdbBtn.textContent = "Lấy phim từ TMDB";
    // fetchTmdbBtn.id = "fetchTmdbBtn";
    // document.body.appendChild(fetchTmdbBtn);
    // fetchTmdbBtn.addEventListener("click", () => this.fetchTmdb());

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");
    const switchToRegister = document.getElementById("switchToRegister");
    const switchToLogin = document.getElementById("switchToLogin");
    const closes = document.querySelectorAll(".modal .close");

    loginBtn?.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "block";
      if (registerModal) registerModal.style.display = "none";
    });
    registerBtn?.addEventListener("click", () => {
      if (registerModal) registerModal.style.display = "block";
      if (loginModal) loginModal.style.display = "none";
    });
    switchToRegister?.addEventListener("click", (e) => {
      e.preventDefault();
      if (loginModal) loginModal.style.display = "none";
      if (registerModal) registerModal.style.display = "block";
    });
    switchToLogin?.addEventListener("click", (e) => {
      e.preventDefault();
      if (registerModal) registerModal.style.display = "none";
      if (loginModal) loginModal.style.display = "block";
    });
    closes.forEach((close) =>
      close.addEventListener("click", () => {
        if (loginModal) loginModal.style.display = "none";
        if (registerModal) registerModal.style.display = "none";
      })
    );
    window.addEventListener("click", (e) => {
      if (e.target === loginModal) loginModal.style.display = "none";
      if (e.target === registerModal) registerModal.style.display = "none";
    });

    document
      .getElementById("loginForm")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("loginUsername")?.value;
        const password = document.getElementById("loginPassword")?.value;
        const result = await login(username, password);
        if (result.success) {
          this.currentUser = result.user;
          localStorage.setItem("currentUser", JSON.stringify(result.user));
          if (loginModal) loginModal.style.display = "none";
          this.updateUserInterface();
          this.showNotification("Đăng nhập thành công!", "success");
          if (result.user.role === "admin") {
            setTimeout(() => {
              window.location.href = "../pages/admin/dashboard.html";
            }, 1000);
          }
        } else {
          this.showNotification(
            result.message || "Đăng nhập thất bại!",
            "error"
          );
        }
      });

    document
      .getElementById("registerForm")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("registerUsername")?.value;
        const email = document.getElementById("registerEmail")?.value;
        const password = document.getElementById("registerPassword")?.value;
        const confirmPassword =
          document.getElementById("confirmPassword")?.value;
        const result = await register(
          username,
          email,
          password,
          confirmPassword
        );
        if (result.success) {
          if (registerModal) registerModal.style.display = "none";
          if (loginModal) loginModal.style.display = "block";
          this.showNotification(
            "Đăng ký thành công! Vui lòng đăng nhập.",
            "success"
          );
        } else {
          this.showNotification(result.message || "Đăng ký thất bại!", "error");
        }
      });
  }

  loadMovieList() {
    const container = document.getElementById("movieList");
    if (!container) return;
    container.innerHTML = this.movies
      .map((movie) => this.createMovieCard(movie))
      .join("");
  }

  loadScheduleMovies() {
    const container = document.getElementById("scheduleMovies");
    if (!container) return;
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    container.innerHTML = days
      .map(
        (day) => `
        <div class="schedule-day">
          <h3>${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
          <div class="movies-grid">${this.weeklyMovies[day.toLowerCase()]
            .map((movie) => this.createMovieCard(movie))
            .join("")}</div>
        </div>
      `
      )
      .join("");
  }

  loadNowShowingMovies() {
    const container = document.getElementById("nowShowingMovies");
    if (!container) return;
    const showingMovies = this.movies.filter(
      (movie) => movie.status === "showing"
    );
    this.displayMovies(showingMovies, "nowShowingMovies");
  }

  loadCategoryMovies(category) {
    const container = document.getElementById("categoryMovies");
    if (!container) return;
    const categoryMovies = this.movies.filter(
      (movie) => movie.category.toLowerCase() === category.toLowerCase()
    );
    this.displayMovies(categoryMovies, "categoryMovies");
    const sectionTitle = document.querySelector(
      ".movies-section .section-title"
    );
    if (sectionTitle) sectionTitle.textContent = `Thể loại: ${category}`;
  }

  loadFavoritesMovies() {
    const container = document.getElementById("favoritesMovies");
    if (!container) return;
    const favoriteMovies = this.movies.filter((movie) =>
      this.favorites.includes(movie.id)
    );
    this.displayMovies(favoriteMovies, "favoritesMovies");
  }

  loadHistoryMovies() {
    const container = document.getElementById("historyMovies");
    if (!container) return;
    const historyMovies = this.movies.filter((movie) =>
      this.history.includes(movie.id)
    );
    this.displayMovies(historyMovies, "historyMovies");
  }

  addToFavorites(movieId) {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }
    if (!this.favorites.includes(movieId)) {
      this.favorites.push(movieId);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      this.showNotification("Đã thêm vào yêu thích!", "success");
    }
  }

  addToHistory(movieId) {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }
    if (!this.history.includes(movieId)) {
      this.history.push(movieId);
      localStorage.setItem("history", JSON.stringify(this.history));
      this.showNotification("Đã thêm vào lịch sử!", "success");
    }
  }

  createMovieCard(movie) {
    return `
      <div class="movie-card" onclick="app.openMovieDetail(${movie.id})">
        <div class="movie-poster">
          <img src="${movie.poster || "??"}" alt="${movie.title}">
          <div class="movie-rating">
            <i class="fas fa-star"></i>
            <span>${movie.rating || "N/A"}</span>
          </div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-meta">
            <span class="movie-year">${movie.releaseDate || "??"}</span>
            <span class="movie-views"><i class="fas fa-eye"></i>${this.formatViews(
              movie.views
            )}</span>
          </div>
          <button class="add-to-favorites" data-movie-id="${
            movie.id
          }">Yêu thích</button>
          <button class="add-to-history" data-movie-id="${
            movie.id
          }">Lịch sử</button>
        </div>
      </div>
    `;
  }

  createTrendingCard(movie) {
    return `
      <div class="trending-card" onclick="app.openMovieDetail(${movie.id})">
        <img src="${movie.poster || "??"}" alt="${movie.title}">
        <div class="trending-overlay">
          <h3>${movie.title}</h3>
          <p>Tập ${movie.episodes || "N/A"} • ${this.formatViews(
      movie.views
    )} lượt xem</p>
        </div>
      </div>
    `;
  }

  formatViews(views) {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views?.toString() || "0";
  }

  prevTrending() {
    const container = document.getElementById("trendingMovies");
    if (!container) return;
    this.currentTrendingIndex = Math.max(0, this.currentTrendingIndex - 1);
    const translateX = -this.currentTrendingIndex * 320;
    container.style.transform = `translateX(${translateX}px)`;
  }

  nextTrending() {
    const container = document.getElementById("trendingMovies");
    if (!container) return;
    const maxIndex = Math.max(0, this.trendingMovies.length - 3);
    this.currentTrendingIndex = Math.min(
      maxIndex,
      this.currentTrendingIndex + 1
    );
    const translateX = -this.currentTrendingIndex * 320;
    container.style.transform = `translateX(${translateX}px)`;
  }

  openMovieDetail(movieId) {
    const movie = this.movies.find((m) => m.id === movieId);
    if (!movie) {
      this.showNotification("Không tìm thấy phim!", "error");
      return;
    }
    localStorage.setItem("selectedMovie", JSON.stringify(movie));
    window.location.href = "movie-detail.html";
  }

  showHistory() {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }
    window.location.href = "history.html";
  }

  showFavorites() {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }
    window.location.href = "favorites.html";
  }

  checkUserAuth() {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      this.currentUser = JSON.parse(userData);
    } else {
      this.currentUser = null;
    }
    this.updateUserInterface();
  }

  updateUserInterface() {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");
    const userName = document.getElementById("userName");
    const userDropdown = document.getElementById("userDropdown");

    if (this.currentUser !== this._previousUser) {
      console.log("Updating UI - currentUser:", this.currentUser);
      this._previousUser = this.currentUser;
    }

    if (this.currentUser) {
      if (authButtons) authButtons.style.display = "none";
      if (userMenu) userMenu.style.display = "flex";
      if (userName) userName.textContent = this.currentUser.username;
      if (userAvatar) {
        userAvatar.innerHTML = `<i class="fas fa-user"></i> <span id="userName">${this.currentUser.username}</span>`;
      }
      if (userDropdown) {
        userDropdown.innerHTML = `
          <a href="../pages/profile.html" class="dropdown-item"><i class="fas fa-user"></i> Hồ sơ</a>
          ${
            this.currentUser.role === "admin"
              ? '<a href="../pages/admin/dashboard.html" class="dropdown-item"><i class="fas fa-cog"></i> Quản lý</a>'
              : ""
          }
          <a href="favorites.html" class="dropdown-item"><i class="fas fa-heart"></i> Yêu thích</a>
          <a href="history.html" class="dropdown-item"><i class="fas fa-history"></i> Lịch sử</a>
          <a href="#" id="logoutBtn" class="dropdown-item"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
        `;
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.addEventListener("click", () => this.logout());
      }
    } else {
      if (authButtons) authButtons.style.display = "flex";
      if (userMenu) userMenu.style.display = "none";
      if (userName) userName.textContent = "";
      if (userDropdown) userDropdown.innerHTML = "";
    }
  }

  showLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "block";
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    this.updateUserInterface();
    this.showNotification("Đăng xuất thành công!", "success");
    window.location.href = "index.html";
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `<div class="notification-content"><span>${message}</span><button class="notification-close">×</button></div>`;
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${
      type === "success" ? "#2ecc71" : type === "error" ? "#e74c3c" : "#3498db"
    }; color: white; padding: 1rem; border-radius: 10px; z-index: 3000; animation: slideIn 0.3s ease;`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => notification.remove());
  }

  displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = movies
      .map((movie) => this.createMovieCard(movie))
      .join("");
  }

  loadTrendingMovies() {
    const container = document.getElementById("trendingMovies");
    if (!container) return;
    container.innerHTML = this.trendingMovies
      .map((movie) => this.createTrendingCard(movie))
      .join("");
  }

  loadWeeklyMovies(day = "monday") {
    const container = document.getElementById("weeklyMovies");
    if (!container) return;
    const movies = this.weeklyMovies[day.toLowerCase()] || [];
    container.innerHTML = movies
      .map((movie) => this.createMovieCard(movie))
      .join("");
  }

  loadLatestMovies() {
    const container = document.getElementById("latestMovies");
    if (!container) return;
    const latestMovies = this.movies
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, this.moviesPerPage * this.currentPage);
    this.displayMovies(latestMovies, "latestMovies");
  }

  loadMoreMovies() {
    this.currentPage += 1;
    this.loadLatestMovies();
  }

  handleSearch() {
    const query = document
      .getElementById("searchInput")
      ?.value?.trim()
      .toLowerCase();
    if (!query) return;
    const searchResults = this.movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        (movie.altTitle && movie.altTitle.toLowerCase().includes(query))
    );
    this.displayMovies(searchResults, "latestMovies");
  }
}

function autoSlideInterval() {
  setInterval(() => {
    if (window.app && window.app.trendingMovies.length > 0) {
      window.app.nextTrending();
      if (
        window.app.currentTrendingIndex >=
        window.app.trendingMovies.length - 3
      ) {
        setTimeout(() => {
          window.app.currentTrendingIndex = -1;
          window.app.nextTrending();
        }, 3000);
      }
    }
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    window.app = new MovieApp();
    setTimeout(autoSlideInterval, 2000);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .notification-content { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
      .notification-close { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error("Lỗi khởi tạo MovieApp:", error);
  }
});
/////////////////////////////////////////////////////////////////////////////////
