const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.ObjectId, ref: "board" },
  boardName:String,
  name: String,
  description: String,
  taskStatus: String,
  imageUrl: String,
  date: { type: Date, default: Date.now },
  score: Number,
  dbStatus: Boolean,
  userModify: String,
  author:String,

});

const task = mongoose.model("task", taskSchema);
module.exports = task;
