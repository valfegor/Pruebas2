const Board = require("../models/board");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const registerBoard = async (req, res) => {
  if (!req.body.name  || !req.body.description)
    return res.status(400).send("Incomplete Data");

  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("User cannot find");

  let data = [];
  data.push({
    id: req.body._id,
    name: user.name,
    role: "Owner",
    ranking: "0",
  });

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

  const board = new Board({
    userId: req.body._id,
    members: data,
    name: req.body.name,
    description: req.body.description,
    dnStatus: true,
    imageUrl: imageUrl,
  });

  let result = await board.save();
  if (!result) return res.status(400).send("Error registering board");
  return res.status(200).send({ result });
};

const addMember = async (req, res) => {
  if (!req.body.boardId || !req.body.userId)
    return res.status(400).send("Incomplete data");

  let user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("User doesn't exist");

  let member = await Board.findById(req.body.boardId);
  if (!member) return res.status(400).send("Board doesn't exist");

  let newMember = member.members;
  let data = {
    id: user._id,
    name: user.name,
    role: "Guest",
    ranking: "0",
  };

  for (var i = 0; i < newMember.length; i++) {
    if (newMember[i].id.toString() === user._id.toString()) {
      return res
        .status(400)
        .send("the user is currently a member of the board");
    }
  }

  newMember.push(data);
  let board = await Board.findByIdAndUpdate(req.body.boardId, {
    members: newMember,
  });

  if (!board) return res.status(400).send("Board not found");
  return res.status(200).send({ board });
};

const deleteMember = async (req, res) => {
  if (!req.body.boardId || !req.body.userId)
    return res.status(400).send("Incomplete data");

  let user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("User doesn't exist");

  let member = await Board.findById(req.body.boardId);
  if (!member) return res.status(400).send("Board doesn't exist");

  let delMember = member.members;

  for (var i = 0; i < delMember.length; i++) {
    if (delMember[i].id.toString() === user._id.toString()) {
      if (delMember[i].role === "Owner")
        return res.status(400).send("Cannot delete Owner");
      delMember.splice(i, 1);
    }
  }

  let board = await Board.findByIdAndUpdate(req.body.boardId, {
    members: delMember,
  });

  if (!board) return res.status(400).send("Board not found");
  return res.status(200).send("Member remove");
};

const listBoard = async (req, res) => {
  let board = await Board.find();
  if (!board || board.length === 0)
    return res.status(400).send("You have no assigned tasks");
  return res.status(200).send({ board });
};

const listBoardMember = async (req, res) => {
  let board = await Board.find({ members: userId });
  if (!board || board.length === 0)
    return res.status(400).send("You have no assigned tasks");
  return res.status(200).send({ board });
};

const deleteBoard = async (req, body) => {
  let validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Invalid id");

  let taskImg = await Board.findById(req.params._id);
  taskImg = taskImg.imageUrl;
  taskImg = taskImg.split("/")[4];
  let serverImg = "./uploads/" + taskImg;

  let board = await Board.findByIdAndDelete(req.params._id);
  if (!board) return res.status(400).send("Board not found");
  try {
    fs.unlinkSync(serverImg);
  } catch (error) {
    console.log("Image no found in server");
  }
  return res.status(200).send({ message: "RDdeleted" });
};

module.exports = {
  registerBoard,
  listBoard,
  addMember,
  deleteMember,
  deleteBoard,
};
