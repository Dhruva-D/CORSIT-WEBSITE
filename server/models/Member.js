const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  uniqueID: { type: String, required: true, unique: true },
  password: String, // Hashed password
  linkedin: String,
  github: String,
  photo: String,
  isMaster: { type: Boolean, default: false }, // Master access
});

module.exports = mongoose.model("Member", memberSchema);
