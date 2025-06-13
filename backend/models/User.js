const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Nên mã hóa password (sử dụng bcrypt)
  role: { type: String, default: "user" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
