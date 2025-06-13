const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  episodes: { type: Number, default: 0 },
  duration: String,
  releaseDate: String,
  actors: [String],
  description: String,
});

module.exports = mongoose.model("Movie", movieSchema);
