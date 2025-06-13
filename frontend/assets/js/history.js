// Sample history data (for demo purposes)
const historyData = [
  {
    title: "Tiên Nghịch",
    poster:
      "https://static.hh3d.link/wp-content/uploads/2023/09/tien-nghich-3.jpg?format=auto&quality=90",
    episode: "Tập 91",
    timestamp: new Date(Date.now() - 23000), // 23 seconds ago
  },
];

// Function to format timestamp
function formatTimestamp(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `${seconds} giây trước`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

// Function to create a history item
function createHistoryItem(item) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item", "movie-card"); // Reuse movie-card styling
  historyItem.innerHTML = `
          <div class="movie-poster">
            <img src="${item.poster}" alt="${item.title}" />
          </div>
          <div class="movie-info">
            <h3 class="movie-title">${item.title}</h3>
            <div class="movie-meta">
              <span><i class="fas fa-play"></i> Đã xem ${item.episode}</span>
              <span><i class="fas fa-clock"></i> ${formatTimestamp(
                item.timestamp
              )}</span>
            </div>
          </div>
          <button class="remove-btn"><i class="fas fa-times"></i></button>
        `;
  historyItem.querySelector(".remove-btn").addEventListener("click", () => {
    removeHistoryItem(item.title);
    historyItem.remove();
  });
  return historyItem;
}

// Load history from localStorage
function loadHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  let history =
    JSON.parse(localStorage.getItem("viewingHistory")) || historyData;
  history.forEach((item) => {
    const historyItem = createHistoryItem(item);
    historyList.appendChild(historyItem);
  });
}

// Remove a single history item
function removeHistoryItem(title) {
  let history =
    JSON.parse(localStorage.getItem("viewingHistory")) || historyData;
  history = history.filter((item) => item.title !== title);
  localStorage.setItem("viewingHistory", JSON.stringify(history));
}

// Clear all history
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  localStorage.removeItem("viewingHistory");
  document.getElementById("historyList").innerHTML = "";
});

// Search functionality
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  let history =
    JSON.parse(localStorage.getItem("viewingHistory")) || historyData;
  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(query)
  );
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  filteredHistory.forEach((item) => {
    const historyItem = createHistoryItem(item);
    historyList.appendChild(historyItem);
  });
});

// Navigation to other pages
document.getElementById("historyBtn").addEventListener("click", () => {
  window.location.href = "history.html";
});

document.getElementById("favoriteBtn").addEventListener("click", () => {
  window.location.href = "favorites.html";
});

// Modal handling (same as index.html)
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");
const closes = document.querySelectorAll(".close");

loginBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

registerBtn.addEventListener("click", () => {
  registerModal.style.display = "block";
});

switchToRegister.addEventListener("click", () => {
  loginModal.style.display = "none";
  registerModal.style.display = "block";
});

switchToLogin.addEventListener("click", () => {
  registerModal.style.display = "none";
  loginModal.style.display = "block";
});

closes.forEach((close) => {
  close.addEventListener("click", () => {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
  });
});

window.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
  if (e.target === registerModal) registerModal.style.display = "none";
});

// Initial load
loadHistory();
