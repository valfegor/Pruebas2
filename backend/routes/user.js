const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.post("/registerUser", UserController.registerUser);
router.post("/login", UserController.login);
router.get("/listUsers/:name?", UserController.listUser);
router.get("/listUsers/:name?", UserController.listUserAll);
router.put("/updateUser", UserController.updateUser);
router.put("/deleteUser", UserController.deleteUser);
router.post("/registerAdmin", UserController.registerAdmin);
router.get("/getRole/:email", UserController.getRole);

module.exports = router;
