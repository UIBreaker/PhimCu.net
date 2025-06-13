// Sample favorites data (for demo purposes)
const favoritesData = [
  {
    title: "Tiên Nghịch",
    altTitle: "Xian Ni",
    poster:
      "https://static.hh3d.link/wp-content/uploads/2023/09/tien-nghich-3.jpg?format=auto&quality=90",
    episode: "Tập 91",
  },
];

// Function to create a favorite item
function createFavoriteItem(item) {
  const favoriteItem = document.createElement("div");
  favoriteItem.classList.add("favorite-item", "movie-card");
  favoriteItem.innerHTML = `
          <div class="movie-poster">
            <img src="${item.poster}" alt="${item.title}" />
          </div>
          <div class="movie-info">
            <h3 class="movie-title">${item.title}</h3>
            <p class="movie-alt-title">${item.altTitle}</p>
            <div class="movie-meta">
              <span><i class="fas fa-play"></i> ${item.episode}</span>
            </div>
          </div>
          <button class="remove-btn"><i class="fas fa-times"></i></button>
        `;
  favoriteItem.querySelector(".remove-btn").addEventListener("click", () => {
    removeFavoriteItem(item.title);
    favoriteItem.remove();
  });
  return favoriteItem;
}

// Load favorites from localStorage
function loadFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML = "";
  let favorites =
    JSON.parse(localStorage.getItem("favorites")) || favoritesData;
  favorites.forEach((item) => {
    const favoriteItem = createFavoriteItem(item);
    favoritesList.appendChild(favoriteItem);
  });
}

// Remove a single favorite item
function removeFavoriteItem(title) {
  let favorites =
    JSON.parse(localStorage.getItem("favorites")) || favoritesData;
  favorites = favorites.filter((item) => item.title !== title);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Search functionality
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  let favorites =
    JSON.parse(localStorage.getItem("favorites")) || favoritesData;
  const filteredFavorites = favorites.filter((item) =>
    item.title.toLowerCase().includes(query)
  );
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML = "";
  filteredFavorites.forEach((item) => {
    const favoriteItem = createFavoriteItem(item);
    favoritesList.appendChild(favoriteItem);
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
loadFavorites();
