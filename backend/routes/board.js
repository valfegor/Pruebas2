const express = require("express");
const router = express.Router();
const BoardController = require("../controllers/board");
const multiparty = require("connect-multiparty");
const mult = multiparty();
const Auth = require("../middleware/auth");
const Upload = require("../middleware/file");
const ValidateUser = require("../middleware/validateUser");

router.post("/registerBoard",mult,Upload,Auth, ValidateUser,BoardController.registerBoard);
router.get("/listBoard", BoardController.listBoard);
router.put("/addMember", BoardController.addMember);
router.put("/deleteMember", BoardController.deleteMember);
router.delete("/deleteTask/:_id", BoardController.deleteBoard);

module.exports = router;
