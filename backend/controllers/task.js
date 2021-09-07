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

  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.boardName ||
    !req.body.score
  )
    return res.status(400).send("Incomplete Data Please Try Again");

  if (req.body.score <= 0 || req.body.score > 5) {
    return res
      .status(400)
      .send("Sorry you cant just use a number between 1 and 5");
  }
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
    score: req.body.score,
    boardName: board.name,
    assigned: false,
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

  let status = Boolean;

  if (req.body.taskStatus == "done") {
    scoreUser = 1;
    status = false;
  } else {
    scoreUser = 0;
    status = true;
  }


  const inactiveTask = await Task.findById({ _id: req.body._id });

  if (inactiveTask.dbStatus == false) {
    return res.status(400).send("You already did that Task");
  }

  const task = await Task.findByIdAndUpdate(req.body._id, {
    taskStatus: req.body.taskStatus,
    dbStatus: status,
    userModify: req.user.name,
  });

  const user = await User.findById(task.assignedTo);

  if (!user)
    return res
      .status(400)
      .send("Please check that user dont have assigned this task");

  if (scoreUser == 1) {
    let parser = parseInt(scoreUser);
    let acumulador = 0;

    for (iterator of user.EarnedPoints) {
      acumulador = iterator + parser;

    }


    const userPoints = await User.findByIdAndUpdate(user._id, {
      $push: { EarnedPoints: acumulador },
    });

    if (!userPoints) return res.status(400).send("Cant Save the points");

    return res.status(200).send({ userPoints });
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

  if (taskImg.taskStatus === "done")
    return res
      .status(400)
      .send("Sorry cant Erase that Task its Already Completed");

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

const asignTask = async (req, res) => {
  //el id hace referencia al id de la tarea que se va a asignar
  //name al nombre del usuario

  if (!req.body._idtask || !req.body._idUser)
    return res
      .status(400)
      .send("Sorry please have to specify a task for the user");

  let assignedtask = await Task.findOne({ _id: req.body._idtask });

  if (assignedtask.assigned === true)
    return res.status(400).send(" Sorry the task its already assigned");

  const existingUser = await User.findOne({ _id: req.body._idUser });

  console.log(existingUser);

  const task = await Task.findByIdAndUpdate(
    { _id: req.body._idtask },
    {
      assigned: true,
      assignedTo: existingUser._id,
    }
  );

  let data = {
    name: task.name,
    idTask: task._id,
    scoretask: task.score,
    completed: false,
  };

  const user = await User.findByIdAndUpdate(
    { _id: req.body._idUser },
    {
      $push: { AssignedTasks: data },
    }
  );

  console.log(user);
  console.log(task);

  return res.status(200).send({ user });
};


const unassingTask = async (req, res) => {
  if (!req.body._idUser || !req.body._idTask) return res.status(400).send("Sorry please have to specify a user");

  const user = await User.findById(req.body._idUser);
  console.log(user.AssignedTasks
  );
  
  const task = await Task.findById(req.body._idTask);

  console.log(task.name);

  const indice = user.AssignedTasks.findIndex(element=>element.name === task.name )

  console.log(indice);

  const arreglo = user.AssignedTasks
  
  arreglo.splice(indice,1);

  const user2 = await User.findByIdAndUpdate(req.body._idUser,{
    AssignedTasks:arreglo

  })
  console.log(arreglo)
  


  
}

module.exports = { saveTask, updateTask, listTask, deleteTask, asignTask, unassingTask };
