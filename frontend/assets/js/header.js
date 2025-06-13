document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  if (!header) {
    console.error("Header element not found. Check if #header exists in HTML.");
    return;
  }

  const updateHeader = () => {
    header.innerHTML = `
      <div class="header-container">
        <div class="logo" id="logo">PhimCU.net</div>
        <div class="search-bar">
          <input type="text" id="searchInput" placeholder="Tìm kiếm phim...">
          <button id="searchBtn" class="search-btn"><i class="fas fa-search"></i></button>
        </div>
  
        <div class="auth-section" id="authSection">
          <div class="user-menu" id="userMenu" style="display: none;">
            <button class="user-avatar" id="userAvatar">
              <i class="fas fa-user"></i> <span id="userName"></span>
            </button>
            <div class="dropdown" id="userDropdown"></div>
          </div>
          <div class="auth-buttons" id="authButtons" style="display: flex;">
            <button id="loginBtn" class="auth-btn">Đăng nhập</button>
            <button id="registerBtn" class="auth-btn">Đăng ký</button>
          </div>
        </div>
      </div>
    `;

    // Kiểm tra và đồng bộ trạng thái từ localStorage
    const userData = localStorage.getItem("currentUser");
    if (window.app && userData) {
      window.app.currentUser = JSON.parse(userData);
      window.app.updateUserInterface();
    } else if (window.app) {
      window.app.currentUser = null;
      window.app.updateUserInterface();
    }

    // Thêm sự kiện click cho logo
    document.getElementById("logo").addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Thêm event listeners
    document.getElementById("searchBtn")?.addEventListener("click", () => {
      const query = document.getElementById("searchInput").value.trim();
      if (window.app) window.app.handleSearch(query);
    });

    document.getElementById("historyBtn")?.addEventListener("click", () => {
      if (window.app) window.app.showHistory();
    });

    document.getElementById("favoriteBtn")?.addEventListener("click", () => {
      if (window.app) window.app.showFavorites();
    });

    document.getElementById("loginBtn")?.addEventListener("click", () => {
      const loginModal = document.getElementById("loginModal");
      if (loginModal) loginModal.style.display = "block";
    });

    document.getElementById("registerBtn")?.addEventListener("click", () => {
      const registerModal = document.getElementById("registerModal");
      if (registerModal) registerModal.style.display = "block";
    });

    window.addEventListener("click", (e) => {
      const loginModal = document.getElementById("loginModal");
      const registerModal = document.getElementById("registerModal");
      if (e.target === loginModal) loginModal.style.display = "none";
      if (e.target === registerModal) registerModal.style.display = "none";
    });

    // Xử lý dropdown với độ trễ
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    let timeoutId;

    if (userAvatar && userDropdown) {
      userAvatar.addEventListener("mouseover", () => {
        clearTimeout(timeoutId);
        userDropdown.style.display = "block";
      });

      userAvatar.addEventListener("mouseout", () => {
        timeoutId = setTimeout(() => {
          userDropdown.style.display = "none";
        }, 300);
      });

      userDropdown.addEventListener("mouseover", () => {
        clearTimeout(timeoutId);
        userDropdown.style.display = "block";
      });

      userDropdown.addEventListener("mouseout", () => {
        timeoutId = setTimeout(() => {
          userDropdown.style.display = "none";
        }, 300);
      });
    }
  };

  updateHeader(); // Chỉ gọi một lần khi tải trang
});
