class MovieDetailApp {
  constructor() {
    this.currentUser = null;
    this.movie = null;
    this.init();
  }

  init() {
    this.loadData();
    this.checkUserAuth();
    this.displayMovieDetails();
    this.setupEventListeners();
  }

  loadData() {
    // Tải thông tin phim từ localStorage
    const movieData = localStorage.getItem("selectedMovie");
    if (movieData) {
      this.movie = JSON.parse(movieData);
    } else {
      console.warn("Không tìm thấy dữ liệu phim trong localStorage");
      this.showNotification("Không tìm thấy phim!", "error");
    }

    // Tải thông tin người dùng
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  checkUserAuth() {
    this.updateUserInterface();
  }

  updateUserInterface() {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.getElementById("userMenu");
    const userName = document.getElementById("userName");
    const userDropdown = document.getElementById("userDropdown");

    if (this.currentUser) {
      if (authButtons) authButtons.style.display = "none";
      if (userMenu) userMenu.style.display = "block";
      if (userName) userName.textContent = this.currentUser.username;
      if (userDropdown) {
        userDropdown.innerHTML =
          this.currentUser.role === "admin"
            ? `
            <a href="../pages/admin/dashboard.html">Quản lý</a>
            <a href="#" id="logoutBtn">Đăng xuất</a>
          `
            : `
            <a href="../pages/profile.html">Hồ sơ</a>
            <a href="#" id="logoutBtn">Đăng xuất</a>
          `;
        document
          .getElementById("logoutBtn")
          ?.addEventListener("click", () => this.logout());
      }
    } else {
      if (authButtons) authButtons.style.display = "flex";
      if (userMenu) userMenu.style.display = "none";
      if (userName) userName.textContent = "";
      if (userDropdown) userDropdown.innerHTML = "";
    }

    // Cập nhật trạng thái nút Theo Dõi
    this.updateFollowButton();
  }

  displayMovieDetails() {
    if (!this.movie) {
      console.warn("Không có dữ liệu phim để hiển thị");
      return;
    }

    const elements = {
      movieTitle: document.getElementById("movieTitle"),
      moviePoster: document.getElementById("moviePoster"),
      movieAltTitle: document.getElementById("movieAltTitle"),
      movieCategory: document.getElementById("movieCategory"),
      movieLatestEpisode: document.getElementById("movieLatestEpisode"),
      movieDuration: document.getElementById("movieDuration"),
      movieRating: document.getElementById("movieRating"),
    };

    if (elements.movieTitle)
      elements.movieTitle.textContent = this.movie.title || "N/A";
    if (elements.moviePoster) {
      elements.moviePoster.src =
        this.movie.poster || "../assets/images/placeholder.png";
      elements.moviePoster.alt = this.movie.title || "Poster phim";
    }
    if (elements.movieAltTitle)
      elements.movieAltTitle.textContent = this.movie.altTitle || "N/A";
    if (elements.movieCategory)
      elements.movieCategory.textContent = this.movie.category || "N/A";
    if (elements.movieLatestEpisode)
      elements.movieLatestEpisode.textContent =
        this.movie.latestEpisode || "N/A";
    if (elements.movieDuration)
      elements.movieDuration.textContent = this.movie.duration || "N/A";
    if (elements.movieRating)
      elements.movieRating.textContent = this.movie.rating
        ? `${this.movie.rating}/10`
        : "N/A";
  }

  setupEventListeners() {
    // Nút Theo Dõi
    const followBtn = document.getElementById("followBtn");
    if (followBtn) {
      followBtn.addEventListener("click", () => this.handleFollow());
    }

    // Nút Xem phim
    const viewBtn = document.querySelector(".btn-view");
    if (viewBtn) {
      viewBtn.addEventListener("click", () => this.handleView());
    }

    // Nút Đánh Giá
    const rateBtn = document.querySelector(".btn-rate");
    if (rateBtn) {
      rateBtn.addEventListener("click", () => this.handleRate());
    }

    // Dropdown hover
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    if (userAvatar && userDropdown) {
      userAvatar.addEventListener("mouseenter", () => {
        if (this.currentUser) userDropdown.style.display = "block";
      });
      userAvatar.addEventListener("mouseleave", () => {
        userDropdown.style.display = "";
      });
      userDropdown.addEventListener("mouseenter", () => {
        userDropdown.style.display = "block";
      });
      userDropdown.addEventListener("mouseleave", () => {
        userDropdown.style.display = "none";
      });
    }

    // Modal đăng nhập
    const loginBtn = document.getElementById("loginBtn");
    const loginModal = document.getElementById("loginModal");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        if (loginModal) loginModal.style.display = "block";
      });
    }
  }

  handleFollow() {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    let favorites =
      JSON.parse(
        localStorage.getItem(`favorites_${this.currentUser.username}`)
      ) || [];
    const isFavorited = favorites.some((favId) => favId === this.movie.id);

    if (isFavorited) {
      favorites = favorites.filter((favId) => favId !== this.movie.id);
      this.showNotification("Đã bỏ theo dõi phim!", "success");
    } else {
      favorites.push(this.movie.id);
      this.showNotification("Đã thêm vào danh sách theo dõi!", "success");
    }

    localStorage.setItem(
      `favorites_${this.currentUser.username}`,
      JSON.stringify(favorites)
    );
    this.updateFollowButton();
  }

  updateFollowButton() {
    const followBtn = document.getElementById("followBtn");
    if (!followBtn || !this.currentUser) return;

    const favorites =
      JSON.parse(
        localStorage.getItem(`favorites_${this.currentUser.username}`)
      ) || [];
    const isFavorited = favorites.some((favId) => favId === this.movie.id);

    followBtn.textContent = isFavorited ? "Bỏ Theo Dõi" : "Theo Dõi";
    followBtn.classList.toggle("followed", isFavorited);
  }

  handleView() {
    if (!this.movie.videoUrl) {
      this.showNotification("Video không khả dụng!", "error");
      return;
    }
    // Pass movie details via URL query parameters
    const queryParams = new URLSearchParams({
      id: this.movie.id || "",
      title: this.movie.title || "N/A",
      latestEpisode: this.movie.latestEpisode || "Tập 1",
      episodes: this.movie.episodes || 1,
      videoUrl: this.movie.videoUrl || "../assets/videos/placeholder.mp4",
    }).toString();
    window.location.href = `../pages/watch-movie.html?${queryParams}`;
  }

  handleRate() {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }
    // Giả định hiển thị thông báo (có thể mở modal đánh giá sau)
    this.showNotification("Chức năng đánh giá đang phát triển!", "info");
  }

  showLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "block";
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    this.updateUserInterface();
    this.showNotification("Đăng xuất thành công!", "success");
    window.location.href = "../index.html";
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">×</button>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${
        type === "success"
          ? "#2ecc71"
          : type === "error"
          ? "#e74c3c"
          : "#3498db"
      };
      color: white;
      padding: 1rem;
      border-radius: 10px;
      z-index: 3000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });
  }
}

// Khởi tạo ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.app = new MovieDetailApp();

    // CSS cho thông báo
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error("Lỗi khởi tạo MovieDetailApp:", error);
  }
});
////////////////////////////////////////////////
