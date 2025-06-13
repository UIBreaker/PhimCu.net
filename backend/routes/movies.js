// backend/routes/movies.js
const express = require("express");
const {
  getMovies,
  addMovie,
  deleteMovie,
  fetchMoviesFromOphim,
} = require("../controllers/movieController");
const authenticate = require("../middleware/auth");
const restrictToAdmin = require("../middleware/admin");
const router = express.Router();

router.get("/", getMovies);
router.post("/add", authenticate, restrictToAdmin, addMovie);
router.delete("/:id", authenticate, restrictToAdmin, deleteMovie);
router.get("/fetch-ophim", fetchMoviesFromOphim); // Thêm route mới

module.exports = router;
