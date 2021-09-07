const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.ObjectId, ref: "board" },
  assignedTo:{ type: mongoose.Schema.ObjectId, ref: "user" },
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
  assigned:Boolean

});

const task = mongoose.model("task", taskSchema);
module.exports = task;
