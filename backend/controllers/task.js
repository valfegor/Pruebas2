const Task = require("../models/task");
const mongoose = require("mongoose");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const Board = require("../models/board");
const User = require("../models/user");

const saveTask = async (req, res) => {
  let validId = mongoose.Types.ObjectId.isValid(req.user._id);
  console.log(req.user._id);
  if (!validId) return res.status(400).send("Invalid id");

  if (!req.body.name || !req.body.description || !req.body.boardName)
    return res.status(400).send("Incomplete Data Please Try Again");

  const existTask = await Task.find({ boardName: req.body.boardName });

  let existantInBoard = existTask.some(
    (element) => element.name == req.body.name
  );

  if (existantInBoard)
    return res.status(400).send("Take Another Board that task already exist");

  console.log(req.body.boardName);
  const board = await Board.findOne({ name: req.body.boardName });

  if (!board)
    return res
      .status(400)
      .send("Sorry The Board Not Exist Please Generate A Board");

  let imageUrl = "";
  if (req.files.image) {
    if (req.files.image.type != null) {
      const url = req.protocol + "://" + req.get("host") + "/";
      const serverImg =
        "./uploads/" + moment().unix() + path.extname(req.files.image.path);
      fs.createReadStream(req.files.image.path).pipe(
        fs.createWriteStream(serverImg)
      );
      imageUrl =
        url + "uploads/" + moment().unix() + path.extname(req.files.image.path);
    }
  }

  //Author sera verdaderamente req.user.name

  //falta campo boardId:board._id

  console.log(req.user);

  let task = new Task({
    boardId: board._id,
    name: req.body.name,
    description: req.body.description,
    author: req.user.name,
    imageUrl: imageUrl,
    taskStatus: "to-do",
    dbStatus: true,
    score: 0,
    boardName: board.name,
  });

  let result = await task.save();

  if (!result) return res.stats(200).send("No task was saved");

  return res.status(200).send({ task });
};

const updateTask = async (req, res) => {
  let validId = mongoose.Types.ObjectId.isValid(req.user._id);
  console.log(req.user._id);
  if (!validId) return res.status(400).send("Invalid id");

  if (!req.body._id || !req.body.taskStatus)
    return res.status(400).send("Sorry Please Check Out All The camps please");

  let scoreUser = 0;
  let status = Boolean;

  if (req.body.taskStatus == "done") {
    scoreUser = 1;
    status = false;
  } else {
    scoreUser = 0;
    status = true;
  }

  const task = await Task.findByIdAndUpdate(req.body._id, {
    taskStatus: req.body.taskStatus,
    score: scoreUser,
    dbStatus: status,
    userModify: req.user.name,
  });

  let prueba = 0;

  if (task.taskStatus == "done") {
    prueba = prueba + task.score;
  }

  console.log(prueba);

  let data = {
    id_task: task._id,
    score: prueba,
  };

  const user = await User.find({ _id: req.user._id });

  for (const iterator of user) {

    let existe = iterator.EarnedPoints.some(element=>element.id_task  === data.id_task)

    if(existe){
      const actualizado =  iterator.EarnedPoints.map(element=>{
        if(element.score === data.score){
          element.score++;
          console.log(element.score);
          return element;
          
        }
        else{
          return element
        }
      })
    }

    console.log(existe);

  }

  if (!task) return res.status(400).send("Sorry Please Try again");

  return res.status(200).send({ task });
};

//este metodo corresponde a todas las tareas del usuario.
//es decir trae todas las tareas de los todos los tableros.

const listTask = async (req, res) => {
  const task = await Task.find({
    $and: [
      { boardName: new RegExp(req.params["boardName"], "i") },
      { dbStatus: "true" },
    ],
  });
  console.log(task);
  if (!task || task.length == 0)
    return res
      .status(400)
      .send("Sorry Cant Find Any task please go and create a task");

  return res.status(200).send({ task });
};

const deleteTask = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Invalid id");

  let taskImg = await Task.findById(req.params._id);

  taskImg = taskImg.imageUrl;
  taskImg = taskImg.split("/")[4];
  let serverImg = "./uploads/" + taskImg;

  let task = await Task.findByIdAndDelete(req.params._id);

  if (!task) return res.status(400).send("Cant find the task");

  console.log(serverImg);

  try {
    fs.unlinkSync(serverImg);
  } catch (err) {
    console.log("Image no found in server");
  }
  return res.status(200).send({ message: "Task deleted" });
};

module.exports = { saveTask, updateTask, listTask, deleteTask };
