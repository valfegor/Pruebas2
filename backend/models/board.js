const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  members:Array ,
  name: String,
  description: String,
  dbStatus: String,
  imageUrl: String,
  date: { type: Date, default: Date.now },
});

const board = mongoose.model("board", boardSchema);
module.exports = board;
