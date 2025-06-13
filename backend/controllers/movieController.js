// backend/controllers/movieController.js
const axios = require("axios");
const Movie = require("../models/Movie");

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addMovie = async (req, res) => {
  const { title, url, category } = req.body;
  try {
    const newMovie = new Movie({ title, url, category });
    await newMovie.save();
    res.json(newMovie);
  } catch (err) {
    console.error("Error adding movie:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchMoviesFromOphim = async (req, res) => {
  try {
    const page = req.query.page || 1; // Lấy page từ query, mặc định là 1
    const response = await axios.get(
      `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    const movies = response.data.data.map((movie) => ({
      title: movie.name || movie.title, // Điều chỉnh dựa trên cấu trúc JSON thực tế
      url: `https://ophim1.com/phim/${movie.slug}`, // Tạo URL dựa trên slug
      category: movie.category || "Không xác định", // Điều chỉnh nếu có
    }));

    // Xóa dữ liệu cũ (tùy chọn)
    await Movie.deleteMany({});
    // Lưu dữ liệu mới
    await Movie.insertMany(movies);

    res.json({
      message: "Movies fetched and saved successfully",
      data: movies,
    });
  } catch (err) {
    console.error("Error fetching movies from Ophim:", err);
    res.status(500).json({ message: "Failed to fetch movies from Ophim" });
  }
};

module.exports = { getMovies, addMovie, deleteMovie, fetchMoviesFromOphim };
