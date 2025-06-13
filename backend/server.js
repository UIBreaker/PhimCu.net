// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Kết nối MongoDB
// mongoose
//   .connect("mongodb://localhost:27017/web_phim_tu_tiennn", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("MongoDB connection error:", err));

// // Schema
// const movieSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   poster: String,
//   description: String,
//   category: String,
//   status: String,
//   duration: String,
//   altTitle: String,
//   trailer: String,
//   tags: [String],
//   format: String,
//   subtitles: String,
//   type: String,
//   hot: Boolean,
//   images: String,
//   videoUrl: String,
//   episodes: { type: Number, default: 0 },
//   episodeLinks: { type: Map, of: String },
//   actors: [String],
// });
// const Movie = mongoose.model("Movie", movieSchema);

// // API lấy danh sách phim
// app.get("/api/movies", async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     res.status(200).json(movies);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Lỗi khi lấy danh sách phim", error: error.message });
//   }
// });

// // API thêm phim (từ add-movie.html)
// app.post("/api/movies", async (req, res) => {
//   try {
//     const newMovie = new Movie(req.body);
//     const savedMovie = await newMovie.save();
//     res.status(201).json({ message: "Phim đã được thêm", movie: savedMovie });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Lỗi khi thêm phim", error: error.message });
//   }
// });

// // API cập nhật phim (thêm tập hoặc sửa)
// app.patch("/api/movies/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const updatedMovie = await Movie.findByIdAndUpdate(
//       id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     );
//     if (!updatedMovie)
//       return res.status(404).json({ message: "Phim không tìm thấy" });
//     res
//       .status(200)
//       .json({ message: "Phim đã được cập nhật", movie: updatedMovie });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Lỗi khi cập nhật phim", error: error.message });
//   }
// });

// // API xóa phim
// app.delete("/api/movies/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedMovie = await Movie.findByIdAndDelete(id);
//     if (!deletedMovie)
//       return res.status(404).json({ message: "Phim không tìm thấy" });
//     res.status(200).json({ message: "Phim đã được xóa" });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi khi xóa phim", error: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// server.js
const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

let users = []; // Có thể thay bằng database

app.post("/auth/register", (req, res) => {
  const { username, email, password } = req.body;
  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: "Email đã được sử dụng" });
  }
  const user = { username, email, password, role: "user" };
  users.push(user);
  const token = `dummy.${Buffer.from(JSON.stringify(user)).toString(
    "base64"
  )}.dummy`;
  res.json({ token, user });
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = `dummy.${Buffer.from(JSON.stringify(user)).toString(
      "base64"
    )}.dummy`;
    res.json({ token, user });
  } else {
    res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
